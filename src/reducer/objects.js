import actions from '../actions';
import u from 'updeep';

import object_reducer from './object';

let debug = require('debug')('aotds:test');

export default function objects(state=[],action) {
    switch( action.type ) {
        case actions.INIT_GAME: 
            return action.objects;

        case actions.SET_ORDERS: 
            return state.map(
                u.if(
                    u.is( 'id', action.object_id ), 
                    { orders: { done: true, ...action.orders } }
                )
            );

        case actions.MOVE_OBJECT:
        case actions.CLEAR_ORDERS:
        case actions.EXECUTE_SHIP_FIRECON_ORDERS:
            return state.map( obj => object_reducer( obj, action ) );

        

        default: return state;
    }

}
