import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Room, Map, Format, Mode, MapAction, Message, Action, Response } from '../types/types';

@Injectable()
export class ApiService {

  defaultFormat: number = 3;

  mapList: Map[] = [
    new Map('cache', true),
    new Map('cobblestone', true),
    new Map('dust2', false),
    new Map('inferno', true),
    new Map('mirage', true),
    new Map('nuke', true),
    new Map('overpass', true),
    new Map('train', true)
  ];

  formats: Format[] = [
    new Format('Best of 1', 1, [
      new Mode('Ban ... Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random
      ])
    ]),
    new Format('Best of 2', 2, [
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Pick x2', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick
      ]),
      new Mode('Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random
      ]),
      new Mode('Pick x2', [
        MapAction.Pick, MapAction.Pick
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random
      ]),
    ]),
    new Format('Best of 3', 3, [
      new Mode('Ban x2, Pick x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Ban x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Ban x2, Ban x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Ban, MapAction.Random, MapAction.Random, MapAction.Random
      ]),
      new Mode('Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random, MapAction.Random
      ]),
    ]),
    new Format('Best of 5', 5, [
      new Mode('Ban x2, Pick x2, Pick x2 then Random', [
        MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick x2, Ban x2, Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick x2, Pick x2, Ban x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Ban, MapAction.Ban, MapAction.Random
      ]),
      new Mode('Pick x2, Pick x2 then Random', [
        MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Pick, Ban, Pick, Ban, Pick, Pick then Random', [
        MapAction.Pick, MapAction.Ban, MapAction.Pick, MapAction.Ban, MapAction.Pick, MapAction.Pick, MapAction.Random
      ]),
      new Mode('Random', [
        MapAction.Random, MapAction.Random, MapAction.Random, MapAction.Random, MapAction.Random
      ]),
    ])
  ];

  api_url: string = 'ws://localhost:8999';
  current_room: Room = null;
  ws: WebSocket;

  constructor() { }

  createRoom(room: Room): Promise<Room> {
    return new Promise( (resolve, reject) => {
      this.ws = new WebSocket(this.api_url);
      this.ws.onerror = (error) => {
        reject("Unable to reach the server. Service unavailable. You can't create new room for map veto right now. I'm sorry :'(");
        this.ws.onerror = this.onError;
      };
      this.ws.onopen = () => {
        let message = new Message(Action.Create, room);
        this.ws.send(JSON.stringify(message));
      }
      this.ws.onmessage = (message: MessageEvent) => {
        const res: Response = JSON.parse(message.data);
        resolve(res.data);
        this.ws.onmessage = this.onMessage;
      };
    });
  }

  joinRoom(token: string): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      const message = new Message(Action.Join, token);
      if (!this.ws) {
        this.ws = new WebSocket(this.api_url);
        this.ws.onopen = () => {
          this.ws.send(JSON.stringify(message));
        }
      } else {
        this.ws.send(JSON.stringify(message));
      }
      
      this.ws.onerror = (error) => {
        reject(error);
        this.ws.onerror = this.onError;
      };
      this.ws.onmessage = (message: MessageEvent) => {
        const res: Response = JSON.parse(message.data);
        if (res.error) {
          reject(res.error);
        } else {
          this.current_room = res.data;
          this.ws.onmessage = this.onMessage;
          resolve(true);
        }
      };
    });
  }

  onError(error) {
    // console.log(error);
  }

  onMessage(message) {
    // console.log(message);
  }

}
