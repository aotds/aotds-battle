import _ from 'lodash';

import { takeEvery, select, put, take } from 'redux-saga/effects';

import { movement_phase } from './movement';
import { play_turn } from './play_turn';

const debug = require('debug')('aotds:sagas');

import { PLAY_TURN, MOVEMENT_PHASE } from '~/actions';

export default function* () {
    yield takeEvery( PLAY_TURN, play_turn );

    yield takeEvery( MOVEMENT_PHASE, movement_phase );
}
