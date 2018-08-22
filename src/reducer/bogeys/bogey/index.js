import u from 'updeep';
import fp from 'lodash/fp';

import actions from '../../../actions';
import structure from './structure';
import inflate from './inflate';

import { 
    mapping_reducer,
    actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';

import drive from './drive';
import firecon from './firecon';

let debug = require('debug')('aotds:battle:reducer:object');


let weapon_reducer = actions_reducer({
    ASSIGN_WEAPON_TO_FIRECON: action => u.if(
        u.is( 'id', action.weapon_id ), {
            firecon_id: action.firecon_id
        }),
});

let reaction = {};

reaction.PLAY_TURN = () => u({ drive: u.omit('thrust_used') });

reaction.CLEAR_ORDERS = () => u.omit('orders');

reaction.BOGEY_MOVEMENT = ({ navigation }) => {
    return u({ 
        navigation: fp.omit( 'thrust_used' )( navigation ),
        drive: { thrust_used: navigation.thrust_used },
    } );
};

reaction.ASSIGN_WEAPON_TO_FIRECON = action => {
    return u.if( u.is( 'id', action.bogey_id ), { weaponry: { weapons: 
        u.map( w => weapon_reducer(w,action) ) } } );
};

reaction.SET_ORDERS = action => u.if( s => !fp.has('orders.done')(s), { 
    orders: u.constant({
        done: (action.timestamp || true),
        ...(action.orders)
    })
});

reaction.EXECUTE_FIRECON_ORDERS = action => u.updateIn(
    `weaponry.firecons.${action.firecon_id}`, s => firecon(s,action)
);

let subreducers = combine_reducers({ structure });

export default pipe_reducers([
    init_reducer({}),
    combine_reducers({ structure, drive }),
    actions_reducer(reaction),
]);
