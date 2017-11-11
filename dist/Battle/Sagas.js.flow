//@flow

import _ from 'lodash';

import { takeEvery, select, put } from 'redux-saga/effects';

import actions from './Actions';

import type { PlayMoveObject } from './Actions';

import { gen_object_movement } from './movement';

const get_object = id => state => _.find( state.objects, { id } );

function *play_move_object ( action : PlayMoveObject ) :Generator<> {
    
    let { object_id}  = action.payload;

    let obj = yield select( get_object( object_id ) );

    let navigation = gen_object_movement( obj, action.payload );

    yield put( { type: 'MOVE_OBJECT', payload: {
        object_id,
        navigation,
    }})
}

export default function *() : Generator<> {
    yield takeEvery( actions.PLAY_MOVE_OBJECT, play_move_object );
}
