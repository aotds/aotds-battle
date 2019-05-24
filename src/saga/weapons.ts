import { fire_weapon } from "../store/actions/phases";
import { takeEvery, select, call } from "redux-saga/effects";
import { action } from "../actions";
import { get_bogey } from "../store/selectors";
import * as rules from '../rules/weapons';

const fire_weapon_outcome = action( 'FIRE_WEAPON_OUTCOME', ( ) => ({
}) );

function *fire_weapon_outcome_saga(action: ReturnType<typeof fire_weapon>) {
    let attacker = yield select( get_bogey, action.payload.bogey_id );
    let target = yield select( get_bogey, action.payload.target_id );
    let weapon = attacker.weaponry.weapons[ action.payload.weapon_id ];

    yield call( rules.fire_weapon, attacker, target, weapon );
}


export default function*() {
    yield takeEvery( fire_weapon.type, fire_weapon_outcome_saga );
};
