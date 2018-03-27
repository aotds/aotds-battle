import u from 'updeep';
import fp from 'lodash/fp';

import actions from '../../../actions';
import structure from './structure';

import { actions_reducer } from '../../utils';

let debug = require('debug')('aotds:battle:reducer:object');


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

let reaction = {};

reaction.PLAY_TURN = () => u({ drive: u.omit('thrust_used') });

reaction.DAMAGE = action =>
    u.if( u.is( 'id', action.object_id ),
    { structure: s => structure(s,action) });

reaction.CLEAR_ORDERS = () => u.omit('orders');

reaction.MOVE_OBJECT = ({ object_id, navigation }) => {
    return u.if( u.is( 'id', object_id ), { 
        navigation: fp.omit( 'thrust_used' )( navigation ),
        drive: { thrust_used: navigation.thrust_used },
    } );
};

reaction.EXECUTE_SHIP_FIRECON_ORDERS = action => state => {
    if( action.object_id !== state.id ) return state;

    let reduce_firecon = f => firecon_reducer(f, action );
    return  u({
        weaponry: { firecons: u.map( reduce_firecon ) }
    })(state);
};

export default actions_reducer(reaction, {} );

