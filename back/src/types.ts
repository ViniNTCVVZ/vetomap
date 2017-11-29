import * as WebSocket from 'ws';

export enum Action {
    Join,
    Create,
    Captain,
    Vote,
    None
}

export enum MapAction {
    None,
    Ban,
    Pick,
    Random
}

export enum TeamSide {
    None,
    A,
    B
}

export class Team {
    side: TeamSide = TeamSide.None;
    name: string = '';

    constructor(side: TeamSide, name: string) {
        this.side = side;
        this.name = name;
    }
}

export class Map {
    name: string = '';

    constructor(name: string) {
        this.name = name;
    }
}

export class MapActionResult {
    map: Map = new Map('');
    action: MapAction = MapAction.None;
    side: TeamSide = TeamSide.None;
}

export class Room {
    clients: Client[] = [];
    token: string = '';
    remaining_maps: Map[] = [];
    actions: MapActionResult[] = [];

    isValid(): boolean {
        return this.remaining_maps.length > 0 && this.remaining_maps.length == this.actions.length;
    }
}

export class Client extends WebSocket {
    id: string;
    isAlive: boolean = true;
    captain: TeamSide = TeamSide.None;
    room: Room = new Room();
}

export class Message {
    action: Action = Action.None;
    data: Room | Map | Team | any;
}

export class Response {
    error: string = '';
    data: Room;

    constructor(data: any, error: string = '') {
        this.error = error;
        this.data = data;
    }
}
