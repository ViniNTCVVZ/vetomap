import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as crypto from "crypto";
import { Room, Client, Map, Message, Response, Action, TeamSide, MapAction } from './types';

// global rooms (no database). We have to be careful about memory leak / grow.
let rooms: Room[] = [];

// avoid crash when receiving garbage messages
function parse(str: string): Message {
    let message = new Message();
    try {
        message = JSON.parse(str);
    } 
    catch(e) {
        console.log('error parsing message : ' + e);
    }
    finally {
        return message;
    }
}

// creating new token for new room
function token(): string {
    return crypto.randomBytes(64).toString('hex');
}

// initialize express application
const app = express();

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// when new client connecting
wss.on('connection', (ws: Client) => {

    // checking if client is alived mechanism
    ws.isAlive = true;
    ws.id = token();
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    //connection is up, let's handle messages
    ws.on('message', (message: string) => {

        const obj: Message = parse(message);
        switch(obj.action) {

            // when joining a room
            case Action.Join:
                const joined_room: Room | undefined = rooms.find(x => x.token == obj.data);
                if (joined_room) {
                    // link room to client and client to room
                    ws.room = joined_room;
                    joined_room.clients.push(ws);
                }
                ws.send(new Response(joined_room, joined_room ? '' : 'No room found for this token'));
                break;

            // when sending form to create a new room
            case Action.Create:
                const new_room : Room = <Room>obj.data;
                if (new_room.isValid()) {
                    new_room.token = token();
                    // link room to client and client to room
                    ws.room = new_room;
                    new_room.clients.push(ws);
                    // add room
                    rooms.push(new_room);
                    // send room
                    ws.send(new Response(new_room));
                } else {
                    ws.send(new Response(null, 'Bad room structure received'));
                }
                break;

            // when someone is joining a team as captain
            case Action.Captain:
                const teamside : TeamSide = <TeamSide>obj.data;
                if (ws.room && ws.room.token) {
                    let room =  rooms.find(x => x.token == ws.room.token);
                    if (!room) {
                        ws.send(new Response(null, "This room is no longer available"));
                    } else {
                        let client = room.clients.findIndex(x => x.id === ws.id && x.captain === TeamSide.None);
                        // if the client is in the room and there is no captain on this side, ok, you can become a captain
                        if (client && !room.clients.findIndex(x => x.captain === teamside)) {
                            (<Client>room.clients.find(x => x.id === ws.id)).captain = teamside;
                            // send updated room for all clients
                            wss.clients.forEach( client => {
                                client.send(new Response(room));
                            })
                        } else {
                            ws.send(new Response(null, "You can not become captain on this team, the slot is already taken"));
                        }
                    }
                } else {
                    ws.send(new Response(null, "You are not in a room right now, you can't become a captain"));
                }
                break;

            // when a captain is voting a map
            case Action.Vote:
                const map : Map = <Map>obj.data;
                if (ws.room && ws.room.token) {
                    let room_index = rooms.findIndex(x => x.token == ws.room.token);
                    if (room_index < 0) {
                        ws.send(new Response(null, "This room is no longer available"));
                    } else {
                        let room = rooms[room_index];
                        // is there any action available
                        let action_index = room.actions.findIndex(x => x.map.name === '');
                        if (action_index < 0) {
                            ws.send(new Response(null, "This map has already been voted"));
                        } else {
                            let action = room.actions[action_index];
                            let picked_map = room.remaining_maps.find(x => x.name === map.name);
                            if (picked_map) {
                                action.map = picked_map;
                                room.remaining_maps.splice(room.remaining_maps.findIndex(x => x.name === map.name), 1);

                                // picking random map if next_action is random
                                let next_action = room.actions.find(x => x.map.name === '');
                                while(next_action && next_action.action === MapAction.Random) {
                                    const random_map = room.remaining_maps[Math.floor(Math.random()*room.remaining_maps.length)];
                                    next_action.map = random_map;
                                    next_action = room.actions.find(x => x.map.name === '');
                                }
                                
                                // send updated room for all clients
                                wss.clients.forEach( client => {
                                    client.send(new Response(room));
                                })

                                // removing room if no more action needed
                                if (!next_action) {
                                    rooms.splice(room_index, 1);
                                }
                            } else {
                                ws.send(new Response(null, "This map has already been voted"));
                            }
                        }
                    }
                } else {
                    ws.send(new Response(null, "You are not in a room right now, you can't vote for a map"));
                }
                break;
        }
        //log the received message and send it back to the client
        console.log('received: %s', message);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

// check if clients are alive mechanism
setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
        const ws_obj = <Client>ws;
        if (!ws_obj.isAlive) {

            // if client has join a room, we have to remove the room if no more client on this room
            if (ws_obj.room && ws_obj.room.token) {
                const index_current_room = rooms.findIndex(x => x.token == ws_obj.room.token);
                // room exists ?
                if (index_current_room > -1) {
                    const index = rooms[index_current_room].clients.findIndex(x => x.id == ws_obj.id);
                    if (index > -1) {
                        // remove client from room
                        rooms[index_current_room].clients.splice(index, 1);
                    }
                    if (rooms[index_current_room].clients.length === 0) {
                        // remove room because no more client in it
                        rooms.splice(index_current_room, 1);
                    }
                }
            }

            return ws.terminate();
        }
        
        ws_obj.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);