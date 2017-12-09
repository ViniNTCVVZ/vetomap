import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as crypto from "crypto";
import { Lobby, Client, Map, Message, Response, Action, TeamSide, MapAction, MapActionResult } from './types';

// mutex library
var mutexify = require('mutexify');
var lock = mutexify();

// global lobbies (no database). We have to be careful about memory grow / leak
let lobbies: Lobby[] = [];

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

// creating new token for new lobby
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

            // when joining a lobby
            case Action.Join: {
                const joined_lobby: Lobby | any = lobbies.find((x: Lobby) => x.token === obj.data.token);
                if (joined_lobby) {
                    // client token in localstorage
                    if (obj.data.client_token !== '') {
                        const existing_item_index = joined_lobby.clients.findIndex((x: Client) => x.id === obj.data.client_token);
                        // remove previous websocket and set new client_token (if needed)
                        if ( existing_item_index != -1) {
                            joined_lobby.clients.splice(existing_item_index, 1);
                            ws.id = obj.data.client_token;
                        }
                    }
                    
                    // link lobby to client (if needed)
                    if (joined_lobby.clients.findIndex((x: Client) => x.id === ws.id) < 0) {
                        joined_lobby.clients.push(new Client(ws.id));
                    }
                }
                ws.send(JSON.stringify(new Response({ lobby: joined_lobby, client_id: ws.id}, joined_lobby ? '' : 'No lobby found for this token')));
                break;
            }

            // when sending form to create a new lobby
            case Action.Create: {
                const new_lobby : Lobby = new Lobby(token(), obj.data.remaining_maps, obj.data.actions);
                if (new_lobby.isValid()) {
                    // link lobby to client
                    new_lobby.clients.push(new Client(ws.id));
                    // add lobby
                    lobbies.push(new_lobby);
                    // send lobby
                    ws.send(JSON.stringify(new Response({ lobby: new_lobby, client_id: ws.id})));
                } else {
                    ws.send(JSON.stringify(new Response(null, 'Bad lobby structure received')));
                }
                break;
            }

            // when someone is joining a team as captain
            case Action.Captain: {
                const teamside : TeamSide = <TeamSide>obj.data;
                const lobby: Lobby | any = lobbies.find((x: Lobby) => x.clients.findIndex((c: Client) => c.id === ws.id) > -1);
                if (lobby && lobby.token) {
                    // protected the code to avoid collision
                    lock( (release: any) => {
                        let client = lobby.clients.find((x: Client) => x.id === ws.id);
                        // client not found :/
                        if (!client) {
                            ws.send(JSON.stringify(new Response(null, "It seems you're not connected to any room :/")));
                        } else if (lobby.captainA === client.id || lobby.captainB === client.id) {
                            // already captain !
                            ws.send(JSON.stringify(new Response(null, "You are already the captain of the other team !")));
                        } else if ((teamside === TeamSide.A && lobby.captainA === '') || (teamside === TeamSide.B && lobby.captainB === '')) {
                            // if there is no captain on this side, then you can become the captain
                            if (teamside === TeamSide.A) {
                                lobby.captainA = client.id;
                            } else {
                                lobby.captainB = client.id;
                            }
                            // send updated lobby for all clients
                            wss.clients.forEach( (client: WebSocket | any) => {
                                client.send(JSON.stringify(new Response({ lobby: lobby, client_id: client.id })));
                            })
                        } else {
                            ws.send(JSON.stringify(new Response(null, "You can not become captain on this team, the slot is already taken")));
                        }
                        release();
                    });
                } else {
                    ws.send(JSON.stringify(new Response(null, "You are not in a lobby right now, you can't become a captain")));
                }
                break;
            }

            // when a captain is voting a map
            case Action.Vote: {
                // protected the code to avoid collision
                lock((release: any) => {
                    const map: Map = <Map>obj.data;
                    const lobby_index: number = lobbies.findIndex((x: Lobby) => x.clients.findIndex((c: Client) => c.id === ws.id) > -1);
                    if (lobby_index > -1) {
                        let lobby = lobbies[lobby_index];
                        // is there any action available
                        let action_index = lobby.actions.findIndex((x: MapActionResult) => x.map.name === '');
                        if (action_index < 0) {
                            ws.send(JSON.stringify(new Response(null, "This map has already been voted")));
                        } else {
                            let action = lobby.actions[action_index];
                            let chosen_map_index = lobby.remaining_maps.findIndex((x: Map) => x.name === map.name);
                            if (chosen_map_index != -1) {
                                action.map = new Map(lobby.remaining_maps[chosen_map_index].name);
                                lobby.remaining_maps.splice(chosen_map_index, 1);

                                // picking random map if next_action is random
                                let next_action = lobby.actions.find((x: MapActionResult) => x.map.name === '');
                                while (next_action && next_action.action === MapAction.Random) {
                                    const random_map_index = Math.floor(Math.random() * lobby.remaining_maps.length);
                                    const random_map = lobby.remaining_maps[random_map_index];
                                    next_action.map = new Map(random_map.name);
                                    lobby.remaining_maps.splice(random_map_index, 1);
                                    next_action = lobby.actions.find((x: MapActionResult) => x.map.name === '');
                                }

                                // send updated lobby for all clients
                                wss.clients.forEach((client: WebSocket | any) => {
                                    client.send(JSON.stringify(new Response({ lobby: lobby, client_id: client.id })));
                                })

                                // removing lobby if no more action needed
                                if (!next_action) {
                                    lobbies.splice(lobby_index, 1);
                                }
                            } else {
                                ws.send(JSON.stringify(new Response(null, "This map has already been voted")));
                            }
                        }
                    } else {
                        ws.send(JSON.stringify(new Response(null, "You are not in a lobby right now, you can't vote for a map")));
                    }
                    release();
                });
                break;
            }
        }
    });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

// check if clients are still alive
setInterval(() => {

    // remove dead lobbies (to avoid memory grow / leak)
    lobbies.forEach( (lobby: Lobby, index_lobby: number) => {
        lobby.clients.forEach( (x: Client, index_client: number) => {
            let find = false;
            wss.clients.forEach( (ws: WebSocket | any) => {
                if (x.id === ws.id) {
                    find = true;
                }
            });

            // remove dead client from lobby
            if (!find) {
                lobby.clients.splice(index_client, 1);
            }
        });
        if (lobby.clients.length === 0) {
            lobbies.splice(index_lobby, 1);
        }
    });
    console.log('number of lobbies : ' + lobbies.length);
}, 10000);