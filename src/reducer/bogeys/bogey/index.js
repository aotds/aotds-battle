import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { 
    mapping_reducer,
    actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';
import actions from '../../../actions';
import drive from './drive';
import firecon from './firecon';
import inflate from './inflate';
import structure from './structure';
import weapon from './weapon';

let debug = require('debug')('aotds:battle:reducer:object');


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

reaction.EXECUTE_WEAPON_ORDERS = action => u.updateIn(
    `weaponry.weapons.${action.weapon_id}`, s => weapon(s,action)
);

export default pipe_reducers([
    init_reducer({}),
    combine_reducers({ 
        structure, 
        drive
    }),
    actions_reducer(reaction),
]);
