import _ from 'lodash';
import u from 'updeep';

let middlewares = []
export default middlewares;

import Actions from '../actions';

import { get_object_by_id, players_not_done, active_players } from './selectors';

function mw_for( target, inner ) {
    return store => next => action => {
        let func = next;

        if( action.type === target ) {
            func = inner(store)(next);
        }

        return func(action);
    };
}

import { plot_movement } from '../movement';

const debug = require("debug")("aotds:mw");

export
const object_movement_phase = mw_for( Actions.MOVE_OBJECT, 
    ({getState, dispatch}) => next => action => {

        let object = get_object_by_id( getState(), action.object_id );

        next(
            u(
                plot_movement( object, _.get( object, 'orders.navigation' ) )
            )(action)
        )
});

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

    debug(players_not_done(getState()))

    if ( !action.force && (
            players_not_done(getState()).length > 0 
            || active_players(getState()).length <= 1 ) ) {
        return;
    }

    next(action)
    dispatch(Actions.move_objects());
    dispatch(Actions.clear_orders());
});

export 
const objects_movement_phase = mw_for( Actions.MOVE_OBJECTS, 
    ({ getState, dispatch }) => next => action => {
        next(action);
        _.get( getState(), 'objects', [] ).map( o => o.id ).forEach( id => 
            dispatch( Actions.move_object(id) )
        );
});

middlewares.push(objects_movement_phase, object_movement_phase, play_turn );
