import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import Action from './Actions';

import log from './Reducer/Log';

let objects = handleActions({
    [Action.INIT_GAME]: ( state, { objects }) => [ ...objects ]
}, []);


let game = handleActions({
    [Action.INIT_GAME]: ( state, { name }) => ({ name })
}, {} );

let reducer = combineReducers( { log, objects, game } );

export default reducer;
