import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import Actions from '../actions';

import weapon_middlewares from './weapons';
import { add_timestamp, add_action_id, add_parent_action } from './meta';

import { get_object_by_id, players_not_done, active_players } from './selectors';

import { mw_for } from './utils';

const debug = require("debug")("aotds:mw");

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 

export
const play_turn = mw_for( Actions.PLAY_TURN, 
    ({getState, dispatch}) => next => action => {

    if ( !action.force && (
            players_not_done(getState()).length > 0 
            || active_players(getState()).length <= 1 ) ) {
        debug( "waiting for ", players_not_done(getState()) );
        return;
    }

    next(action);
    dispatch(Actions.move_objects());
    dispatch(Actions.execute_firecon_orders());
    dispatch(Actions.assign_weapons_to_firecons());
    dispatch(Actions.execute_firecon_orders());
    dispatch(Actions.fire_weapons());
    dispatch(Actions.clear_orders());
});


let middlewares = [
    add_timestamp,
    add_action_id,
    add_parent_action,
    play_turn,
    ...weapon_middlewares,
];


export default middlewares;
