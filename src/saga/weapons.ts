import { fire_weapon } from "../store/actions/phases";
import { takeEvery, select, call, put, takeLeading, fork, take } from "redux-saga/effects";
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


function *fire_weapon_outcome_saga(action: ReturnType<typeof fire_weapon>) {
    let attacker = yield select( get_bogey, action.payload.bogey_id );
    let target = yield select( get_bogey, action.payload.target_id );
    let weapon = attacker.weaponry.weapons[ action.payload.weapon_id ];

    const outcome = fire_weapon_outcome(
        action.payload.bogey_id,
        action.payload.target_id,
        yield call( rules.fire_weapon, attacker, target, weapon )
    );

    yield put(outcome);
}

function *weapon_damage( action: ReturnType<typeof fire_weapon_outcome>) {
    const { payload: { target_id, damage_dice = [], penetrating_damage_dice = [] } } = action;

    let target = yield select( get_bogey, target_id );

    if(damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, damage_dice, false );
        yield put( damage( target.id, result.damage, result.is_penetrating ) );
    }

    if(penetrating_damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, penetrating_damage_dice, true );
        yield put( damage( target.id, result.damage, result.is_penetrating ) );
    }

}


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


function *internal_damage_check() {
    let previous_state = {} as BattleState;

    while(true) {
        const action = yield take();
        const state = yield select();

        if( isType( action, damage ) ) {
            const bogey_id = action.payload.bogey_id;

            const get_hull : (x:any) => number = fp.getOr(0)([ 'bogeys', bogey_id, 'structure', 'hull', 'current' ]);

            const delta = get_hull(previous_state) - get_hull(state);

            if( delta > 0 ) {
                const threshold = 100 * delta / ( fp.getOr(1)(['bogeys', bogey_id, 'structure', 'hull', 'rating' ] )(state) as number );

                yield* _.flattenDeep([
                    internal_damage_drive,
                    internal_damage_firecons,
                    internal_damage_weapons,
                    internal_damage_shields
                ].map( (x:any) => x(state.bogeys[bogey_id],threshold) ) )
                .map(system => ({system, check: { threshold, die: dice(1,{ nbr_faces: 100 })[0]  }} ))
                .map( id => ({ hit: id.check.die <= id.check.threshold, ...id } ) )
                .filter( ({hit}) => hit ).map( id =>
                    internal_damage( bogey_id, id )
                ).map( x => put(x) );
            }

        }

        previous_state = state;
    }

}


export default function*() {
    yield takeEvery( fire_weapon.type, fire_weapon_outcome_saga );
    yield takeEvery( fire_weapon_outcome.type, weapon_damage );
    yield fork( internal_damage_check );
};
