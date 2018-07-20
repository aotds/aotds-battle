import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import Actions from '../actions';
import weapon_middlewares from './weapons';

import { get_object_by_id, players_not_done, active_players } from './selectors';

import { mw_for } from './utils';

import { plot_movement } from '../movement';

const debug = require("debug")("aotds:mw");

export
const object_movement_phase = mw_for( Actions.MOVE_OBJECT, 
    ({getState, dispatch}) => next => action => {

        let object = get_object_by_id( getState(), action.object_id );

        next(
            u({
                navigation: plot_movement( object, _.get( object, 'orders.navigation' ) )
            })(action)
        )
});

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 

export const add_timestamp = () => next => action => {
    action = u({ timestamp: (new Date).toISOString() })(action);
    next(action);
};

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

export 
const objects_movement_phase = mw_for( Actions.MOVE_OBJECTS, 
    ({ getState, dispatch }) => next => action => {
        next(action);
        _.get( getState(), 'objects', [] )
            .filter( o => o.navigation )
            .map( o => o.id ).forEach( id => 
            dispatch( Actions.move_object(id) )
        );
});



let middlewares = [
    add_timestamp,
    objects_movement_phase, 
    object_movement_phase, 
    play_turn,
    ...weapon_middlewares,
];


export default middlewares;
