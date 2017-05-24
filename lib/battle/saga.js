import _ from 'lodash';
import { takeEvery, select, put } from 'redux-saga/effects';
import Action from './Actions';

const find_object  = (state,id) => _.find( state.objects,  { id } );
const find_weapon  = (ship,id) => _.find( ship.weapons,  { id } );

const check_if_object_destroyed = function *( action ) {

    let ship = yield select(find_object, action.object_id);

    if( ship.is_destroyed ) return; // already destroyed

    if( ship.hull <= 0 ) {
        yield put( Action.destroyed({ object_id: ship.id }) );
    }

};

import { weapon_fire } from './weapons';

const fire_weapon = function* ( action ) {

    let ship    = yield select( find_object, action.object_id );
    let target  = yield select( find_object, action.target_id );
    let weapon  = find_weapon( ship, action.weapon_id );

    for ( let action of weapon_fire( ship, target, weapon ) ) {
        yield put(action);
    }
};



export default function *() {

    yield takeEvery( Action.DAMAGE, check_if_object_destroyed )
    yield takeEvery( Action.WEAPON_FIRE, fire_weapon )

}
