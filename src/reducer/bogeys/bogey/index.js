import u from 'updeep';
import fp from 'lodash/fp';

import actions from '../../../actions';
import structure from './structure';
import inflate from './inflate';

import { 
    mapping_reducer,
    actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';

import drive from './drive';

let debug = require('debug')('aotds:battle:reducer:object');


function firecon_reducer(state = {}, action ) {
    switch( action.type ) {
        case actions.ASSIGN_TARGET_TO_FIRECON:
            if( action.firecon_id !== state.id ) return state;


            return u(fp.pick(['target_id'])(action))(state);

        default: return state;
    }
}

let weapon_reducer = actions_reducer({
    ASSIGN_WEAPON_TO_FIRECON: action => u.if(
        u.is( 'id', action.weapon_id ), {
            firecon_id: action.firecon_id
        }),
});

let reaction = {};

reaction.PLAY_TURN = () => u({ drive: u.omit('thrust_used') });

reaction.CLEAR_ORDERS = () => u.omit('orders');

reaction.MOVE_OBJECT = ({ object_id, navigation }) => {
    return u.if( u.is( 'id', object_id ), { 
        navigation: fp.omit( 'thrust_used' )( navigation ),
        drive: { thrust_used: navigation.thrust_used },
    } );
};

reaction.ASSIGN_WEAPON_TO_FIRECON = action => {
    return u.if( u.is( 'id', action.bogey_id ), { weaponry: { weapons: 
        u.map( w => weapon_reducer(w,action) ) } } );
};

reaction.ASSIGN_TARGET_TO_FIRECON = action => state => {
    if( action.bogey_id !== state.id ) return state;

    let reduce_firecon = f => firecon_reducer(f, action );
    return  u({
        weaponry: { firecons: u.map( reduce_firecon ) }
    })(state);
};

reaction.SET_ORDERS = action => u.if( s => !fp.has('orders.done')(s), { 
    orders: u.constant({
        done: (action.timestamp || true),
        ...(action.orders)
    })
});


let subreducers = combine_reducers({ structure });

export default pipe_reducers([
    init_reducer({}),
    combine_reducers({ structure, drive }),
    actions_reducer(reaction),
]);
