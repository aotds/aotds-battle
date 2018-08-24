import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { crossProduct } from '~/utils';
import { actions, 
    BOGEY_FIRE_WEAPON, 
    FIRECON_ORDERS_PHASE, WEAPON_ORDERS_PHASE, WEAPON_FIRING_PHASE } from '~/actions';
import { roll_die } from '~/dice';

import { get_bogey, get_bogeys, select } from '../selectors';
import { mw_for, subactions } from '../utils';

import * as weapons from '~/weapons';

const debug = require('debug')('aotds:mw:weapons');

const spy = thingy => { debug(thingy); return thingy };


export const internal_damage_check = mw_for( 'DAMAGE', 
    store => next => action => {

        let before = store.getState() |> get_bogey( action.bogey_id ) |> fp.get('structure.hull.current');

        subactions( () => () => () => {
            let bogey = store.getState() |> get_bogey( action.bogey_id );

            let hull = bogey.structure.hull;
            
            let damage = before - hull.current;

            if(!damage) return;

            let probability = parseInt(100 * damage / hull.max);

            let systems = [
                internal_damage_drive,
                internal_damage_firecons,
                internal_damage_weapons,
                internal_damage_shields,
            ]   |> fp.map( f => f(bogey,probability) )
                |> fp.flatten
                |> spy
                |> fp.filter( 'dice.hit' )
                |> fp.map( ({system,dice}) => actions.internal_damage( bogey.id, system, dice ) )
                |> fp.map( store.dispatch );
        } )(store,next,action);
    }
);

//         // TODO: repair crews

//         // TODO: core systems

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


}

const bogey_fire_weapon = function({getState},next,action) {
    let { bogey_id, target_id, weapon_id } = action;

    let bogey  = getState() |> get_bogey(bogey_id);
    let target = getState() |> get_bogey(target_id);
    let weapon = _.get(bogey,'weaponry.weapons.' + weapon_id);

    next(
       u( weapons.fire_weapon( bogey, target, weapon ) )(action)
    );
} |> _.curry |> mw_for( BOGEY_FIRE_WEAPON );



// must be after 'fire_weapon' to intercept the
// damage done

// check if damage_dice and/or penetrating_damage_dice
// if there is any, send the DAMAGE 

const weapon_damages = function({getState,dispatch},next,action) {
    let bogey = getState() |> get_bogey(action.bogey_id);
    let weapon = action.weapon;

    _.pick( action, [ 'damage_dice', 'penetrating_damage_dice' ] )
        |> _.entries 
        |> fp.map( 
                ([ type, dice ]) => actions.damage( 
                    action.target_id, weapon.type, dice, /penetrating/.test(type)
            )
        )
        |> fp.map( dispatch )
        ;

} |> _.curry  |> subactions |> mw_for( BOGEY_FIRE_WEAPON );



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

// function* assign_weapons_to_firecons() {
//     let bogeys = yield select( get_bogeys );

//     bogeys = bogeys |> fp.filter('orders.weapons');

//     for ( let bogey of bogeys ) {
//         yield* _.get(bogey,'orders.weapons',[]) 
//             |> fp.map( ({ weapon_id, firecon_id }) 
//                 => actions.assign_weapon_to_firecon( bogey.id, weapon_id, firecon_id) )
//             |> fp.map( a => put(a) );
//     }
        
// }

function internal_damage_shields(ship,percent) {
    return ship |> fp.getOr([])('structure.shields')
        |> fp.reject('damaged')
        |> fp.map('id')
        |> fp.map( id => roll_system( 'shield', { id }, percent ) );
}

export
const firecon_orders_phase = function({dispatch,getState},next,action) {
    getState() |> select( get_bogeys ) 
        |> fp.filter( 'orders.firecons' )
        |> fp.map( b => crossProduct( [b.id], b.orders.firecons |> fp.entries ) )
        |> fp.flatten 
        |> fp.map( ([ id, [ firecon_id, orders ] ]) => actions.execute_firecon_orders( id, firecon_id, orders ) )
        |> fp.map( dispatch )
    ;
} |> _.curry |> subactions |> mw_for( FIRECON_ORDERS_PHASE );

export
const weapon_orders_phase = function({dispatch,getState},next,action) {
    getState() |> select( get_bogeys ) 
        |> fp.filter( 'orders.weapons' )
        |> fp.map( b => crossProduct( [b.id], b.orders.weapons |> fp.entries ) )
        |> fp.flatten 
        |> fp.map( ([ id, [ weapon_id, orders ] ]) => actions.execute_weapon_orders( id, weapon_id, orders ) )
        |> fp.map( dispatch )
    ;
} |> _.curry |> subactions |> mw_for( WEAPON_ORDERS_PHASE );

export
function bogey_firing_actions(bogey) {
    let firecons = bogey |> fp.getOr({})('weaponry.firecons') |> fp.values |> fp.filter('target_id');

    const weapons_for = firecon_id => bogey |> fp.getOr({})('weaponry.weapons') |> fp.values |> fp.filter({ firecon_id });

    return firecons 
        |> fp.map( f => crossProduct( [f.target_id], weapons_for(f.id) ) ) 
        |> fp.flatten 
        |> fp.map( ([target_id,{id: weapon_id}]) => 
            actions.bogey_fire_weapon( bogey.id, target_id, weapon_id ) );

}

export
const weapon_firing_phase = function({dispatch,getState},next,action) {
    getState() 
        |> select( get_bogeys ) 
        |> fp.map( bogey_firing_actions )
        |> fp.flatten
        |> fp.map( dispatch )
    ;
} |> _.curry |> subactions |> mw_for( WEAPON_FIRING_PHASE );

    

export default [
    internal_damage_check, 
    firecon_orders_phase,
    weapon_orders_phase,
    weapon_firing_phase,
    bogey_fire_weapon,
    weapon_damages,
];
