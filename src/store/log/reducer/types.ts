import { Action } from "../../../reducer/types";

export type LogAction = Action & {
    subactions?: LogState;
    meta?: {
        id: number,
        parent_ids?: number[]
    }
};

export type LogState = LogAction[];
