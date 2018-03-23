import actions from '../actions';
import u from 'updeep';
import fp from 'lodash/fp';

let debug = require('debug')('aotds:battle:reducer:object');

import structure from './objects/object/structure';

function firecon_reducer(state = {}, action ) {
    switch( action.type ) {
        case actions.EXECUTE_SHIP_FIRECON_ORDERS:
            if( action.firecon_id === state.id ) 
                return u(fp.pick(['target_id','weapons'])(action))(state);

            if( ! action.weapons ) return state;
            
            return u({
                weapons: w => fp.difference(w)(action.weapons)
            })(state);

        default: return state;
    }
}

export default function object(state={}, action ) {
    switch( action.type ) {
        case actions.DAMAGE:
            return u.if(
                u.is( 'id', action.object_id ),
                { structure: s => structure(s,action) })(state);

        case actions.MOVE_OBJECT: 
            let { object_id, navigation } = action;
            return u.if( u.is( 'id', object_id ), { navigation } )(state);

        case actions.CLEAR_ORDERS:
            return u.omit('orders')(state);

        case actions.EXECUTE_SHIP_FIRECON_ORDERS:
            if( action.object_id !== state.id ) return state;

            let reduce_firecon = f => firecon_reducer(f, action );
            return  u({
                weaponry: { firecons: u.map( reduce_firecon ) }
            })(state);

        default: return state;
    }

}
