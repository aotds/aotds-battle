import { fire_weapon } from "../store/actions/phases";
import { takeEvery, select, call, put } from "redux-saga/effects";
import { action } from "../actions";
import { get_bogey } from "../store/selectors";
import * as rules from '../rules/weapons';
import { fire_weapon_outcome, damage } from "../actions/bogey";


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


export default function*() {
    yield takeEvery( fire_weapon.type, fire_weapon_outcome_saga );
    yield takeEvery( fire_weapon_outcome.type, weapon_damage );
};
