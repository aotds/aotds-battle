import _ from 'lodash';

import { takeEvery, select, put } from 'redux-saga/effects';

const debug = require('debug')('sagas');

import Action from '../actions';

import { plot_movement } from '../movement';

// function *play_move_object ( action : PlayMoveObject ) :Generator<> {
    
//     let { object_id}  = action.payload;

//     let obj = yield select( get_object( object_id ) );

//     let navigation = gen_object_movement( obj, action.payload );

//     yield put( { type: 'MOVE_OBJECT', payload: {
//         object_id,
//         navigation,
//     }})
// }

export
function *object_movement_phase({ object_id }) {
    let object = yield select( state => _.find( state.objects, { id: object_id } ) );

    let movement = object::plot_movement( _.get( object, 'orders.navigation', {} ) );

    yield put(
        Action.move_object( object_id, movement )
    )
}

export
function *turn_movement_phase() {
    let objects = yield select( state => state.objects );

    for ( let object of objects ) {
        yield put( Action.object_movement_phase(
            object.id, _.get( object, 'orders.navigation', null ) 
        ) )
    }
}

export default function *battleSagas () {
    yield takeEvery( Action.TURN_MOVEMENT_PHASE,   turn_movement_phase );
    yield takeEvery( Action.OBJECT_MOVEMENT_PHASE, object_movement_phase );
}
