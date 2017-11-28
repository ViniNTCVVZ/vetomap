import * as WebSocket from 'ws';

export enum Action {
    Join,
    Create,
    Captain,
    Vote,
    None
}

export enum MapAction {
    Ban,
    Pick,
    Random
}

export enum TeamSide {
    A,
    B
}

export class Team {
    side: TeamSide;
    name: string;

    constructor(side: TeamSide, name: string) {
        this.side = side;
        this.name = name;
    }
}

export class Map {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class Room {
    remaining_maps: Map[] = [];
    picked_maps: Map[] = [];
    actions: MapAction[];
}

export class Client extends WebSocket {
    isAlive: boolean = true;
    captain: number = 0;
    room: Room = new Room();
}

export class Message {
    action: Action = Action.None;
    data: Room | Map | Team | any;
}
