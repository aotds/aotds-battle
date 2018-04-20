import u from 'updeep';
import fp from 'lodash/fp';

import actions from '../../../actions';
import structure, { inflate as inflate_structure } from './structure';

import { 
    mapping_reducer,
    actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';

import drive from './drive';

let debug = require('debug')('aotds:battle:reducer:object');

const inflate_firecons = u.if( fp.isNumber,     
    fp.pipe( fp.times( i => i+1 ), fp.map( id => ({id}) ) )
);

const inflate_drive = u.if( fp.isNumber,     
    max => ({ max, current: max })    
);


export const inflate = u({ 
    drive: inflate_drive,
    structure: inflate_structure,
    weaponry: {
        firecons: inflate_firecons,
    },
});

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

reaction.SET_ORDERS = action => u({ 
    orders: u.constant({
        done: action.timestamp || true,
        ...action.orders
    })
});


let subreducers = combine_reducers({ structure });

export default pipe_reducers([
    init_reducer({}),
    combine_reducers({ structure, drive }),
    actions_reducer(reaction),
]);
