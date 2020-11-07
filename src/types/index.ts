export interface Minion {
    id: number,
    worker: Worker|null
}

export interface MinionList {
    count: number,
    minions: Array<Minion>
}

export interface ActionsFile {
    name: string,
    size: number
}
