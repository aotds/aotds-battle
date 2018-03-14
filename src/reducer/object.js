import actions from '../actions';
import u from 'updeep';

let debug = require('debug')('aotds:battle:reducer:object');

export default function object(state={}, action ) {
    switch( action.type ) {
        case actions.MOVE_OBJECT_STORE: 
            let { object_id, navigation } = action;
            return u.if( u.is( 'id', object_id ), { navigation } )(state);

        case actions.CLEAR_ORDERS:
            return u.omit('orders')(state);

        default: return state;
    }

}
