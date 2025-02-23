export type Leader = string | string[]
export type Follower = {
    selector: string
    speedRatio?: number
}

export type ConcertParams = {
    leader: Leader
    follower: Follower | Follower[]
}

export declare function scrollConcert(params: ConcertParams): () => void;