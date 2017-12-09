import * as WebSocket from 'ws';

export enum Action {
    Join = "JOIN",
    Create = "CREATE",
    Captain = "CAPTAIN",
    Vote = "VOTE",
    None = "NONE"
}

export enum MapAction {
    None = "NONE",
    Ban = "BAN",
    Pick = "PICK",
    Random = "RANDOM"
}

export enum TeamSide {
    None = "NONE",
    A = "A",
    B = "B"
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
        public action: MapAction = MapAction.None,
        public side: TeamSide = TeamSide.None,
        public map: Map = new Map()
    ){}
}

export class Lobby {
    constructor(
        public token: string = '',
        public remaining_maps: Map[] = [],
        public actions: MapActionResult[] = [],
        public nameTeamA: string = 'Team 1',
        public nameTeamB: string = 'Team 2',
        public clients: Client[] = [],
        public captainA: string = '',
        public captainB: string = '',
        public last_check: number = 0
    ){}

    isValid(): boolean {
        return this.nameTeamA !== '' && this.nameTeamB !== '' && this.remaining_maps.length > 0 && this.remaining_maps.length >= this.actions.length;
    }
}

export class Message {
    constructor(
        public action: Action = Action.None,
        public data: Lobby | Map | Team | any
    ){}
}

export class Response {
    public data: any;
    public error: string = '';

    constructor(data: any, error: string = ''){
        this.data = data;
        if (this.data && this.data.lobby && this.data.lobby instanceof Lobby) {
            this.data.lobby = {...this.data.lobby, clients: []};
        }
        this.error = error;
    }
}

export class Client {
    constructor(
        public id: string = '',
        public isAlive: boolean = true
    ){}
}