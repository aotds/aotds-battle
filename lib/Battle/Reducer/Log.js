// @flow
import { actionsHandler } from './utils';

import type { ActionBase } from '../Actions';

type LogState = Array<ActionBase>;

type LR = ( state: LogState, action: ActionBase ) => LogState; 

type LogReducer = {
    [string]: LR
};

let reducer :LogReducer = {};

reducer['@@redux/INIT'] = state => state;
reducer['*']            = (state,action) => state.concat(action);

export default actionsHandler( reducer, [] );
