import actions from '../actions';
import u from 'updeep';

import { actions_reducer } from './utils';

import object_reducer from './object';

let debug = require('debug')('aotds:test');

const assertAction = {
    set( object, prop, value ) {
        if( prop !== '*' && ! actions[prop] ) throw new Error( `${prop} is not a known action` );

        return Reflect.set(...arguments);
    }
};

let redaction = new Proxy({}, assertAction );

redaction.PLAY_TURN = action => 
    u.reject( u.is( 'structure.status', 'destroyed' ) );

redaction['*']  = action => state => {
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
        case actions.DAMAGE:
            return state.map( obj => object_reducer( obj, action ) );


        default: return state;
    }

};

debug(redaction);
export default actions_reducer( redaction, [] );
    
