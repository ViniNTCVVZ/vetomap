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
        public map: Map = new Map(),
        public action: MapAction = MapAction.None,
        public side: TeamSide = TeamSide.None
    ){}
}

export class Lobby {
    constructor(
        public token: string = '',
        public remaining_maps: Map[] = [],
        public actions: MapActionResult[] = []
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
    data: Lobby;
}
