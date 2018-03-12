import _ from 'lodash';

import { takeEvery, select, put } from 'redux-saga/effects';

const debug = require('debug')('aotds:sagas');

import Actions from '../actions';

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

import { object_by_id } from './selectors';

export
function *object_movement_phase({ object_id }) {
    let object = yield select( object_by_id, object_id );

    let mov = plot_movement( object, _.get( object, 'orders.navigation', {} ) );
    debug(mov);

    for ( let action of mov ) {
        debug(action);
        yield put(action);
    }

    // let movement = object::plot_movement( _.get( object, 'orders.navigation', {} ) );

    // yield put(
    //     actions.move_object( object_id, movement )
    // )
}

export
function *turn_movement_phase() {
    let objects = yield select( state => state.objects );

    for ( let object of objects ) {
        yield put( actions.object_movement_phase(
            object.id, _.get( object, 'orders.navigation', null ) 
        ) )
    }
}

export
function* objects_movement_phase() {
    let objects = yield select( state => _.get( state, 'objects', [] ) );

    for( let obj of objects ) {
        yield put(Actions.move_object( obj.id ));
    }
}

export default function *battleSagas () {
    // yield takeEvery( actions.TURN_MOVEMENT_PHASE,   turn_movement_phase );
    // yield takeEvery( actions.OBJECT_MOVEMENT_PHASE, object_movement_phase );
    yield takeEvery( Actions.MOVE_OBJECTS, objects_movement_phase );
    yield takeEvery( Actions.MOVE_OBJECT, object_movement_phase );
}
