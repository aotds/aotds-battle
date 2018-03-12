import actions from '../actions';
import u from 'updeep';

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
            )
        

        default: return state;
    }

}
