import { put, select } from 'redux-saga/effects';
import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { actions, types } from '~/actions';

import { get_bogey } from '../selectors';
import { roll_die } from '../../../dice';

const debug = require('debug')('aotds:mw:sagas:weapons');

const spy = thingy => { debug(thingy); return thingy };

export default function*() {
    yield takeEvery(types.INTERNAL_DAMAGE_CHECK, internal_damage_check);
    yield takeEvery(types.FIRE_WEAPONS_PHASE, fire_weapons_phase);
}

export function* internal_damage_check({ bogey_id, hull }) {
    if(! hull.damage ) return;  // nothing happened 

    let bogey = yield select(get_bogey, bogey_id);

    let probability = parseInt(100 * hull.damage / hull.max);

    let systems = [
        internal_damage_drive,
        internal_damage_firecons,
        internal_damage_weapons,
        internal_damage_shields,
    ] 
        |> fp.map( f => f(bogey,probability) )
        |> fp.flatten
        |> fp.filter( 'dice.hit' )
        |> fp.map( ({system,dice}) => actions.internal_damage( bogey_id, system, dice ) )
        |> spy
        |> fp.map( a => put(a));

    debug(systems);

    yield* systems;

//         // TODO: repair crews

//         // TODO: core systems
}

function roll_against_target(target) {
    let rolled = roll_die(100);
    return { target, rolled, hit: rolled <= target };
}

function internal_damage_drive({drive},percent) {
    if( !drive ) return;

    let damage = drive.damage_level || 0;

    if( damage >= 2 ) return; // already kaput

    return {
        system: { type: 'drive' }, dice: roll_against_target(percent)
    };
}

// import * as weapons from '../../weapons';

// import { mw_for } from '../utils';
// import Actions from '../../actions';
// import { get_object_by_id, players_not_done, active_players } from '../selectors';

// import { roll_die, roll_dice } from '../../dice';

function* fire_weapons_phase() {
    let bogeys = yield( select( get_bogeys ) );

    yield* bogeys.map( fire_bogey_weapons );
}

function* fire_bogey_weapons(bogey) {

    let firecons = _.get(bogey,'weaponry.firecons',[]) |> fp.filter('target_id');

    let weapons = _.get(bogey,'weaponry.weapons',[]);

    for( let f of firecons ) {
        yield* weapons 
            |> fp.filter({ firecon_id: f.id })
            |> fp.map( ({id}) => actions.fire_weapon(bogey.id, f.target_id, id) )
            |> fp.map( a => put(a) )
    }
}

function* fire_weapon( bogey_id, target_id, weapon_id ) {
    let bogey = yield select( get_bogey, bogey_id );
    let weapon = bogey.weaponry.weapons[weapon_id];

    let target = yield select( get_bogey, target_id );

    let action = actions.


}
// const fire_weapon = mw_for( Actions.FIRE_WEAPON,
//     ({ getState, dispatch }) => next => action => {

//         let { object_id, target_id, weapon_id } = action;

//         let state = getState();
//         let object = get_object_by_id(state, object_id );
//         let target = get_object_by_id(state, target_id );
//         let weapon = fp.find({ id: weapon_id })( fp.getOr([])('weaponry.weapons')(object) );

//         if(object && target && weapon) {
//             action = u( weapons.fire_weapon( object, target, weapon ) )(action);
//             next(action);
//         }

//     }
// );

// export
// const execute_firecon_orders = mw_for( Actions.EXECUTE_FIRECON_ORDERS,
//     ({ getState, dispatch }) => next => action => {
//         next(action);

//         _.get( getState(), 'objects', [] ).forEach( bogey => {
//             _.get(bogey,'orders.firecons',[]).forEach( order => {
//                 dispatch(Actions.assign_target_to_firecon(
//                     bogey.id, order.firecon_id, order.target_id
//                 ));
//             });
//         });
//     }
// );

// // must be after 'fire_weapon' to intercept the
// // damage done

// // check if damage_dice and/or penetrating_damage_dice
// // if there is any, send the DAMAGE
// const weapon_damages = mw_for( Actions.FIRE_WEAPON,
//     ({ getState, dispatch }) => next => action => {
//         next(action);

//         let object = get_object_by_id(getState(), action.object_id );
//         let weapon = fp.find({ id: action.weapon_id })( fp.getOr([])('weaponry.weapons')(object) );

//         let damage_dispatch = ([ dice, penetrating ]) =>
//             dispatch( Actions.damage( action.target_id, weapon.type, dice, penetrating ) );

//         [ [ 'damage_dice', false ], [ 'penetrating_damage_dice', true ] ]
//             .map( u({ 0: x => action[x] }) )
//             .filter( x => x[0] )
//             .forEach( damage_dispatch );
//     }
// );

// const ship_max_shield = fp.pipe(
//     fp.getOr([])('structure.shields'),
//     fp.map( 'level' ),
//     fp.max
// );

// export
// const calculate_damage = mw_for( Actions.DAMAGE,
//     ({ getState, dispatch }) => next => action => {
//         let ship = get_object_by_id(getState(), action.object_id );

//         let damage_table = { 4: 1, 5: 1, 6: 2 };

//         if( !action.penetrating ) {
//             let shield = ship_max_shield(ship);

//             damage_table = fp.pipe(
//                 u.if(shield,{ 4: 0 }),
//                 u.if(shield==2,{ 6: 1 }),
//             )(damage_table);
//         }

//         action = u({
//             damage: fp.sumBy( v => damage_table[v] || 0)(action.dice)
//         })(action);

//         next(action);
//     }
// );

const roll_system = ( type, details, target ) => (
    { system: { type, ...details }, dice: roll_against_target(target) });


function internal_damage_firecons(ship,percent) {
    return ship |> fp.getOr({})('weaponry.firecons') |> fp.values
        |> fp.reject('damaged')
        |> fp.map('id') 
        |> fp.map( id => roll_system( 'firecon', { id }, percent ) )
}

function internal_damage_weapons(ship,percent) {
    return ship |> fp.getOr([])('weaponry.weapons')
        |> fp.reject('damaged')
        |> fp.map('id')
        |> fp.map( id => roll_system( 'weapon', { id }, percent ) );
}

function* assign_weapons_to_firecons() {
    let bogeys = yield select( get_bogeys );

    bogeys = bogeys |> fp.filter('orders.weapons');

    for ( let bogey of bogeys ) {
        yield* _.get(bogey,'orders.weapons',[]) 
            |> fp.map( ({ weapon_id, firecon_id }) 
                => actions.assign_weapon_to_firecon( bogey.id, weapon_id, firecon_id) )
            |> fp.map( a => put(a) );
    }
        
}

function internal_damage_shields(ship,percent) {
    return ship |> fp.getOr([])('structure.shields')
        |> fp.reject('damaged')
        |> fp.map('id')
        |> fp.map( id => roll_system( 'shield', { id }, percent ) );
}

