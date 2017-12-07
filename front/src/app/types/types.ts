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

export enum TeamState {
    NoCaptain = "nocaptain",
    YourTheCaptain = "yourthecaptain",
    SlotTaken = "slottaken"
}

export class Format {
    constructor(
        public name: string,
        public value: number,
        public modes: Mode[] = []
    ){}
}

export class Mode {
    constructor(
        public name: string = '',
        public actions: MapAction[] = []
    ){}
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
        public captainA: string = '',
        public captainB: string = ''
    ){}
}

export class Message {
    constructor(
        public action: Action = Action.None,
        public data: Lobby | Map | Team | any
    ){}
}

export interface Response {
    error: string;
    data: any;
}
