import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as crypto from "crypto";
import { Room, Client, Map, Message, Response, Action, TeamSide, MapAction, MapActionResult } from './types';

// global rooms (no database). We have to be careful about memory grow / leak
let rooms: Room[] = [];

// avoid crash when receiving garbage messages
function parse(str: string): Message {
    let message = new Message(Action.None, null);
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
wss.on('connection', (ws: WebSocket | any) => {

    // set unique ID for client
    ws.id = token();

    //connection is up, let's handle messages
    ws.on('message', (message: string) => {

        const obj: Message = parse(message);
        switch(obj.action) {

            // when joining a room
            case Action.Join: {
                const joined_room: Room | any = rooms.find((x: Room) => x.token == obj.data);
                if (joined_room) {
                    // link room to client (if needed)
                    if (joined_room.clients.findIndex((x: Client) => x.id === ws.id) < 0) {
                        joined_room.clients.push(new Client(ws.id));
                    }
                }
                ws.send(JSON.stringify(new Response(joined_room, joined_room ? '' : 'No room found for this token')));
                break;
            }

            // when sending form to create a new room
            case Action.Create: {
                const new_room : Room = new Room(token(), obj.data.remaining_maps, obj.data.actions);
                if (new_room.isValid()) {
                    // link room to client
                    new_room.clients.push(new Client(ws.id));
                    // add room
                    rooms.push(new_room);
                    // send room
                    console.log(new_room);
                    ws.send(JSON.stringify(new Response(new_room)));
                } else {
                    ws.send(JSON.stringify(new Response(null, 'Bad room structure received')));
                }
                break;
            }

            // when someone is joining a team as captain
            case Action.Captain: {
                const teamside : TeamSide = <TeamSide>obj.data;
                const room: Room | any = rooms.find((x: Room) => x.clients.findIndex(c => c.id == ws.id) > -1);
                if (room && room.token) {
                    let client = room.clients.findIndex((x: Client) => x.id === ws.id && x.captain === TeamSide.None);
                    // if the client is in the room and there is no captain on this side, ok, you can become a captain
                    if (client && !room.clients.findIndex((x: Client) => x.captain === teamside)) {
                        (<Client>room.clients.find((x: Client) => x.id === ws.id)).captain = teamside;
                        // send updated room for all clients
                        wss.clients.forEach( (client: WebSocket) => {
                            client.send(JSON.stringify(new Response(room)));
                        })
                    } else {
                        ws.send(JSON.stringify(new Response(null, "You can not become captain on this team, the slot is already taken")));
                    }
                } else {
                    ws.send(JSON.stringify(new Response(null, "You are not in a room right now, you can't become a captain")));
                }
                break;
            }

            // when a captain is voting a map
            case Action.Vote: {
                const map : Map = <Map>obj.data;
                const room_index: number = rooms.findIndex((x: Room) => x.clients.findIndex(c => c.id == ws.id) > -1);
                if (room_index > -1) {
                    let room = rooms[room_index];
                    // is there any action available
                    let action_index = room.actions.findIndex((x: MapActionResult) => x.map.name === '');
                    if (action_index < 0) {
                        ws.send(JSON.stringify(new Response(null, "This map has already been voted")));
                    } else {
                        let action = room.actions[action_index];
                        let picked_map = room.remaining_maps.find((x: Map) => x.name === map.name);
                        if (picked_map) {
                            action.map = picked_map;
                            room.remaining_maps.splice(room.remaining_maps.findIndex((x: Map) => x.name === map.name), 1);

                            // picking random map if next_action is random
                            let next_action = room.actions.find((x: MapActionResult) => x.map.name === '');
                            while(next_action && next_action.action === MapAction.Random) {
                                const random_map = room.remaining_maps[Math.floor(Math.random()*room.remaining_maps.length)];
                                next_action.map = random_map;
                                next_action = room.actions.find((x: MapActionResult) => x.map.name === '');
                            }
                            
                            // send updated room for all clients
                            wss.clients.forEach( (client: WebSocket) => {
                                client.send(JSON.stringify(new Response(room)));
                            })

                            // removing room if no more action needed
                            if (!next_action) {
                                rooms.splice(room_index, 1);
                            }
                        } else {
                            ws.send(JSON.stringify(new Response(null, "This map has already been voted")));
                        }
                    }
                } else {
                    ws.send(JSON.stringify(new Response(null, "You are not in a room right now, you can't vote for a map")));
                }
                break;
            }
        }
        
        //log the rooms
        console.log(rooms);
    });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

// check if clients are still alive
setInterval(() => {
    console.log('interval');

    // remove dead rooms (to avoid memory grow / leak)
    rooms.forEach( (room: Room, index_room: number) => {
        room.clients.forEach( (x: Client, index_client: number) => {
            let find = false;
            wss.clients.forEach( (ws: WebSocket | any) => {
                if (x.id === ws.id) {
                    find = true;
                }
            });

            // remove dead client from room
            if (!find) {
                room.clients.splice(index_client, 1);
            }
        });
        if (room.clients.length === 0) {
            rooms.splice(index_room, 1);
        }
    });
    console.log(wss.clients);
    console.log(rooms);
}, 10000);