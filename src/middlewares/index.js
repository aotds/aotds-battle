import _ from 'lodash';

let middlewares = []
export default middlewares;

import Actions from '../actions';

import { get_object_by_id } from './selectors';

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

export
const object_movement_phase = mw_for( Actions.MOVE_OBJECT, 
    ({getState, dispatch}) => next => ({ object_id }) => {

        let object = get_object_by_id( getState(), object_id );

        let mov = plot_movement( object, _.get( object, 'orders.navigation', {} ) );

        for ( let action of mov ) {
            dispatch(action);
        }
});

export const objects_movement_phase = mw_for( Actions.MOVE_OBJECTS, 
    ({ getState, dispatch }) => next => action => {
        _.get( getState(), 'objects', [] ).map( o => o.id ).forEach( id => 
            dispatch( Actions.move_object(id) )
        );
});

middlewares.push(objects_movement_phase, object_movement_phase );
