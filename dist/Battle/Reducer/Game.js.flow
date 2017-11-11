// @flow
import { actionsHandler } from './utils';

import actions from '../Actions';

import type { InitGame } from '../Actions';

import type { ReducerActions } from '../Types';

type GameState = {
    name: string,
    turn: number
}

let reducer : ReducerActions<GameState> = {};

reducer[ actions.INIT_GAME ] = ( state, action :InitGame ) => {
    return { ...state, name: action.payload.name } 
};

export default actionsHandler( reducer, { turn: 0 } );
