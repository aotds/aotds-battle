import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';

const debug = require('debug')('aotds:mw');

import * as weapons from '../../weapons';

import { mw_for } from '../utils';
import Actions from '../../actions';
import { get_object_by_id, players_not_done, active_players } from '../selectors';

import { roll_die, roll_dice } from '../../dice';

const fire_weapons = mw_for( Actions.FIRE_WEAPONS,
    ({ getState, dispatch }) => next => action => {
        next(action);

        getState().objects.forEach( obj => {
            fp.getOr([])('weaponry.firecons')(obj)
                .filter( f => f.target_id )
                .forEach( firecon => {
                    fp.getOr([])('weaponry.weapons')(obj)
                        .filter( w => w.firecon_id === firecon.id )
                        .forEach( w => {
                        dispatch(Actions.fire_weapon( obj.id, firecon.target_id, w.id ));
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

        _.get( getState(), 'objects', [] ).forEach( bogey => {
            _.get(bogey,'orders.firecons',[]).forEach( order => {
                dispatch(Actions.assign_target_to_firecon(
                    bogey.id, order.firecon_id, order.target_id
                ));
            });
        });
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

function internal_damage_drive(ship,percent) {
    if( !ship.drive ) return;

    let damage = fp.getOr(0)('drive.damage_level')(ship);

    debug(damage);
    if( damage >= 2 ) return;

    let roll = roll_die(100);
    debug(roll);
    
    if( roll > percent ) return;

    return {
        type: 'drive',
        dice: { rolled: roll, target: percent },
    };
}

function internal_damage_firecons(ship,percent) {
    let firecons = fp.reject('damaged')( fp.getOr([])('weaponry.firecons')(ship) ).map(
        fp.pick('id')
    )
        .map( f => ({ ...f, dice: { target: percent, rolled: roll_die(100)}, type: 'firecon' }) )
        .filter( f => f.dice.rolled <= percent )
    ;

    return firecons;
}

function internal_damage_weapons(ship,percent) {
    let weapons = fp.reject('damaged')( fp.getOr([])('weaponry.weapons')(ship) ).map(
        fp.pick('id')
    )
        .map( f => ({ ...f, dice: { target: percent, rolled: roll_die(100)}, type: 'weapon' }) )
        .filter( f => f.dice.rolled <= percent )
    ;

    return weapons;
}

const assign_weapons_to_firecons = mw_for( Actions.ASSIGN_WEAPONS_TO_FIRECONS, 
    ({getState, dispatch }) => next => action => {
        fp.getOr([])('objects')(getState()).forEach( bogey => {
            let orders = fp.getOr([])('orders.weapons')(bogey);
            orders.forEach( order => {
                dispatch( Actions.assign_weapon_to_firecon(
                    bogey.id, order.weapon_id, order.firecon_id
                )) 
            })
        });
    }
);


function internal_damage_shields(ship,percent) {
    let weapons = fp.reject('damaged')( fp.getOr([])('structure.shields')(ship) ).map(
        fp.pick('id')
    )
        .map( f => ({ ...f, dice: { target: percent, rolled: roll_die(100)}, type: 'shield' }) )
        .filter( f => f.dice.rolled <= percent )
    ;

    return weapons;
}

export
const internal_damage = mw_for( Actions.DAMAGE,
    ({ getState, dispatch }) => next => action => {
        let ship = () => get_object_by_id(getState(), action.object_id );

        let before = fp.get('structure.hull')(ship());
        next(action);
        
        ship = ship();
        let after = fp.get('structure.hull')(ship);

        // no damage? nothing to do
        if( before === after ) return;

        let { current: previous_hull } = before;
        let { current, max } = after;

        let damage = previous_hull - current;

        let probability = parseInt(100 * damage / max);

        debug(probability);

        let damaged = [
            internal_damage_drive,
            internal_damage_firecons,
            internal_damage_weapons,
            internal_damage_shields,
        ].map( f => f(ship,probability) )
        .filter( x => x )
        .reduce( (accum,b) => accum.concat(b), [] )
        .map( d => Actions.internal_damage( ship.id, fp.omit('dice')(d), d.dice ) );

        debug(damaged);

        damaged.forEach( dispatch );

        return damaged;

        // TODO: repair crews

        // TODO: core systems
    }
);

let middlewares = [
    assign_weapons_to_firecons,
    fire_weapons,
    fire_weapon,
    execute_firecon_orders,
    weapon_damages,
    calculate_damage,
    internal_damage,
];
export default middlewares;
