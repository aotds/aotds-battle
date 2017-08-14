// @flow
import { actionsHandler } from './utils';

type Action = {
    type: string,
    payload?: any,
};

type LogState = Array<Action>;

type LR = ( state: LogState, action: Action ) => LogState; 

type LogReducer = {
    [*]: LR
};

let reducer :LogReducer = {};

reducer['@@redux/INIT'] = state => state;
reducer['*']            = (state,action) => state.concat(action);

export default actionsHandler( reducer, [] );
