import _ from 'lodash';
import { takeEvery, select, put } from 'redux-saga/effects';
import Action from './Actions';

const find_object  = (state,id) => _.find( state.objects,  { id } );

const check_if_object_destroyed = function *( action ) {

    let ship = yield select(find_object, action.object_id);

    if( ship.is_destroyed ) return; // already destroyed

    if( ( ship.hull <= 0 ) {
        yield put( Action.destroyed({ object_id: ship.id }) );
    }

};


export default function *() {

    yield takeEvery( Action.DAMAGE, check_if_object_destroyed )

}
