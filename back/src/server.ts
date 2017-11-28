import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Client, Map, Message, Action } from './types';

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

// map list
const maps: Map[] = [
    new Map(1, 'cache'),
    new Map(2, 'cobblestone'),
    new Map(3, 'dust2'),
    new Map(4, 'inferno'),
    new Map(5, 'mirage'),
    new Map(6, 'nuke'),
    new Map(7, 'overpass'),
    new Map(8, 'train')
];

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
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    //connection is up, let's handle messages
    ws.on('message', (message: string) => {

        const obj: Message = parse(message);
        switch(obj.action) {
            // when joining a room
            case Action.Join:
                break;
            // when sending form to create a new room
            case Action.Create:
                break;
            // when someone is joining a team as captain
            case Action.Captain:
                break;
            // when a captain is voting a map
            case Action.Vote:
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
        const obj = <Client>ws;
        if (!obj.isAlive) return ws.terminate();
        
        obj.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);