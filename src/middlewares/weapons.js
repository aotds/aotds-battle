import fp from 'lodash/fp';
import u from 'updeep';

const debug = require('debug')('aotds:mw');

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
            next(action);
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

// must be after 'fire_weapon' to intercept the
// damage done

// check if damage_dice and/or penetrating_damage_dice
// if there is any, send the DAMAGE
const weapon_damages = mw_for( Actions.FIRE_WEAPON,
    ({ getState, dispatch }) => next => action => {
        next(action);

        let object = get_object_by_id(getState(), action.object_id );
        let weapon = fp.find({ id: action.weapon_id })( fp.getOr([])('weaponry.weapons')(object) );

        let damage_dispatch = ([ dice, penetrating ]) =>
            dispatch( Actions.damage( action.target_id, weapon.type, dice, penetrating ) );

        [ [ 'damage_dice', false ], [ 'penetrating_damage_dice', true ] ]
            .map( u({ 0: x => action[x] }) )
            .filter( x => x[0] )
            .forEach( damage_dispatch );
    }
);

const ship_max_shield = fp.pipe(
    fp.getOr([])('structure.shields'),
    fp.map( 'level' ),
    fp.max
);

export
const calculate_damage = mw_for( Actions.DAMAGE,
    ({ getState, dispatch }) => next => action => {
        let ship = get_object_by_id(getState(), action.object_id );

        let damage_table = { 4: 1, 5: 1, 6: 2 };

        if( !action.penetrating ) {
            let shield = ship_max_shield(ship);

            damage_table = fp.pipe(
                u.if(shield,{ 4: 0 }),
                u.if(shield==2,{ 6: 1 }),
            )(damage_table);
        }

        action = u({
            damage: fp.sumBy( v => damage_table[v] || 0)(action.dice)
        })(action);

        next(action);
    }
);

let middlewares = [
    fire_weapons,
    fire_weapon,
    execute_firecon_orders,
    weapon_damages,
    calculate_damage,
];
export default middlewares;
