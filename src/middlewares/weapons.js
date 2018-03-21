import fp from 'lodash/fp';
import u from 'updeep';

import * as weapons from '../weapons';

import { mw_for } from './utils';
import Actions from '../actions';
import { get_object_by_id, players_not_done, active_players } from './selectors';

const fire_weapons = mw_for( Actions.FIRE_WEAPONS,
    ({ getState, dispatch }) => next => action => {
        next(action);

        getState().objects.forEach( obj => {
            fp.getOr([])('weaponry.firecons')(obj)
                .filter( f => f.target_id )
                .forEach( firecon => {
                    fp.getOr([])('weapons')(firecon).forEach( w => {
                        dispatch(Actions.fire_weapon( obj.id, firecon.target_id, w ));
                    })
                });
        });
    }
);

const fire_weapon = mw_for( Actions.FIRE_WEAPON,
    ({ getState, dispatch }) => next => action => {

        let { object_id, target_id, weapon_id } = action;

        let state = getState();
        let object = get_object_by_id(state, object_id );
        let target = get_object_by_id(state, target_id );
        let weapon = fp.find({ id: weapon_id })( fp.getOr([])('weaponry.weapons')(object) );

        if(object && target && weapon) {
            action = u( weapons.fire_weapon( object, target, weapon ) )(action);
        }

        next(action);

        if( action.damage_dice ) {
            dispatch( Actions.inflict_damage( 
                target_id, { dice: action.damage_dice } 
            ));
        }

        if( action.penetrating_damage_dice ) {
            dispatch( Actions.inflict_damage( 
                target_id, {
                    dice: action.penetrating_damage_dice,
                    penetrating: true 
                } 
            ));
        }

    }
);

export
const execute_firecon_orders = mw_for( Actions.EXECUTE_FIRECON_ORDERS,
    ({ getState, dispatch }) => next => action => {
        next(action);

        let transform = fp.pipe([
            fp.getOr( [] )('objects'),
            fp.map( obj => ({ object_id: obj.id, firecons: fp.get('orders.firecons')(obj) }) ),
            fp.filter( fp.get('firecons') ),
            fp.map( ({ object_id, firecons }) => firecons.map( f => ([ object_id, f.firecon_id, fp.omit('firecon_id')(f) ]) ) ),
            fp.flatten,
            fp.map( o => dispatch(Actions.execute_ship_firecon_orders(...o) ) )
        ]);

        let x = transform( getState() );

    }
);

let middlewares = [
    fire_weapons,
    fire_weapon,
    execute_firecon_orders,
];
export default middlewares;
