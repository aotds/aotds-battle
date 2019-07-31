import { fire_weapon, weapons_firing_phase } from "../store/actions/phases";
import { action } from "../actions";
import { get_bogey } from "../store/selectors";
import * as rules from '../rules/weapons';
import { fire_weapon_outcome, damage, internal_damage, InternalDamage } from "../actions/bogey";
import { Action } from "../reducer/types";
import { isType } from "ts-action";
import { BattleState } from "../store/types";

import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import dice from '../dice';
import { oc } from 'ts-optchain';
import { BogeyState } from "../store/bogeys/bogey/types";
import { mw_for, mw_compose } from './utils';
import weapons_firing_phase_mw from './weapons_firing_phase';


const fire_weapon_mw = mw_for( fire_weapon, ({getState,dispatch}) => (next) => (action) => {

    let attacker = get_bogey( getState(), action.payload.bogey_id );
    let target =  get_bogey( getState(), action.payload.target_id );
    let weapon = attacker.weaponry.weapons[ action.payload.weapon_id ];

    const outcome = fire_weapon_outcome(
        action.payload.bogey_id,
        action.payload.target_id,
        rules.fire_weapon(attacker, target, weapon )
    );

    dispatch( outcome );
});

const weapon_damage = mw_for( fire_weapon_outcome,
  ({getState,dispatch}) => next => action => {
        const { payload: { target_id, damage_dice = [], penetrating_damage_dice = [] } } = action;

    let target = get_bogey( getState(), target_id );

    if(damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, damage_dice, false );
        dispatch( damage( target.id, result.damage, result.is_penetrating ) );
    }

    if(penetrating_damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, penetrating_damage_dice, true );
        dispatch( damage( target.id, result.damage, result.is_penetrating ) );
    }
});

type InternalDamageResolver = (
  ship: BogeyState,
  percent: number
) => Iterator<InternalDamage>;

type InternalSystem = { type: string, id?: number }

type InternalCheck = (bogey: BogeyState ) => undefined | InternalSystem | InternalSystem[];

const internal_damage_drive : InternalCheck = function(bogey) {
  let drive = bogey.drive;

  if (!drive) return;

  let damage = drive.damage_level || 0;

  if (damage >= 2) return; // already kaput

  return  { type: 'drive' }
}

const internal_damage_firecons : InternalCheck = bogey  =>
    oc(bogey).weaponry.firecons([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'firecon', id }));

const internal_damage_weapons : InternalCheck = bogey  =>
    oc(bogey).weaponry.weapons([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'weapon', id }));

const internal_damage_shields : InternalCheck = bogey  =>
    oc(bogey).structure.shields([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'shield', id }));


const internal_damage_check = mw_for( damage, ({getState,dispatch})=>(next)=>(action) => {

    const bogey_id = action.payload.target_id;

    let bogey = get_bogey( getState(), bogey_id );

    let before = bogey.structure.hull.current;

    next(action);

    bogey = get_bogey( getState(), bogey_id );

    let delta = before - bogey.structure.hull.current;

            if( delta > 0 ) {
                console.log("H*NK");
                const threshold = 100 * delta / ( fp.getOr(1)(['bogeys', bogey_id, 'structure', 'hull', 'rating' ] )(bogey) as number );

                _.flattenDeep([
                    internal_damage_drive,
                    internal_damage_firecons,
                    internal_damage_weapons,
                    internal_damage_shields
                ].map( (x:any) => x(bogey,threshold) ) )
                .map(system => ({system, check: { threshold, die: dice(1,{ nbr_faces: 100, note: `internal damage check ${JSON.stringify(system)}` })[0]  }} ))
                .map( id => ({ hit: id.check.die <= id.check.threshold, ...id } ) )
                .filter( ({hit}) => hit ).map( id =>
                    internal_damage( bogey_id, id )
                ).map( x => dispatch(x) );
            }

});


export default mw_compose([
    fire_weapon_mw,
    weapon_damage,
    weapons_firing_phase_mw,
    internal_damage_check,
]);
