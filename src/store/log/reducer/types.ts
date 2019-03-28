import { Action } from "../../../reducer/types";

export type LogAction = Action & {
    subactions?: LogState
};

export type LogState = LogAction[];
