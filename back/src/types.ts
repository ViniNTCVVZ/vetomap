import * as WebSocket from 'ws';

export enum Action {
    Join,
    Create,
    Captain,
    Vote,
    None
}

export enum MapAction {
    None = "NONE",
    Ban = "BAN",
    Pick = "PICK",
    Random = "RANDOM"
}

export enum TeamSide {
    None,
    A,
    B
}

export class Team {
    constructor(
        public side: TeamSide = TeamSide.None, 
        public name: string = ''
    ) {}
}

export class Map {
    constructor(
        public name: string = '',
        public picked: boolean = false
    ){}
}

export class MapActionResult {
    constructor(
        public map: Map = new Map(),
        public action: MapAction = MapAction.None,
        public side: TeamSide = TeamSide.None
    ){}
}

export class Lobby {
    constructor(
        public token: string = '',
        public remaining_maps: Map[] = [],
        public actions: MapActionResult[] = [],
        public clients: Client[] = []
    ){}

    isValid(): boolean {
        return this.remaining_maps.length > 0 && this.remaining_maps.length == this.actions.length;
    }
}

export class Message {
    constructor(
        public action: Action = Action.None,
        public data: Lobby | Map | Team | any
    ){}
}

export class Response {
    public data: Lobby;
    public error: string = '';

    constructor(data: Lobby | any, error: string = ''){
        if (data) {
            this.data = new Lobby(data.token, data.remaining_maps, data.actions);
        }
        this.error = error;
    }
}

export class Client {
    constructor(
        public id: string = '',
        public isAlive: boolean = true,
        public captain: TeamSide = TeamSide.None
    ){}
}