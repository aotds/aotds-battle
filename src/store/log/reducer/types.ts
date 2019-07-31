import { Action } from "../../../reducer/types";

export type LogAction = Action & {
    subactions?: LogState;
    meta?: {
        action_id: number,
        parent_ids?: number[]
    }
};

export type LogState = LogAction[];
