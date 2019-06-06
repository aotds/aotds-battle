import u from 'updeep';
import { Action } from '../reducer/types';

import { combineReducers } from 'redux';

import game from './game/reducer';
import bogeys from './bogeys/reducer';
import log from './log/reducer';

import { BattleState } from './types';

export default function( state :BattleState = {} as BattleState, action: Action ) {
    return u({
        game: (state :any) => game(state,action),
        bogeys: (state:any) => bogeys(state,action),
        log: (state:any) => log(state,action),
    }, state);
}

