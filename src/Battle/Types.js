// @flow

import type { ActionBase, ActionType } from './Actions';

export
type BattleState = {
};

export type BattleAction = {
};

export type ReducerActions<T> = {
    [ActionType]: ( state: T, action: any ) => T
}
