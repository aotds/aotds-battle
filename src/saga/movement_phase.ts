import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { bogey_movement } from '../actions/bogey';
import { plot_movement } from '../rules/movement';
import { get_bogeys, get_bogey } from '../store/selectors';
import { BogeyState } from '../store/bogeys/bogey/types';
import { movement_phase } from '../store/actions/phases';
import fp from 'lodash/fp';

const debug = require('debug')('aotds:saga:mp');

function *move_bogeys () {

    let ships = yield select(get_bogeys);

    for( let id of ships.map( fp.get('id') ) ) {
        debug(id);
        const bogey = yield select( get_bogey, id );
        debug(bogey);
        const nav = yield call(plot_movement,bogey);
        yield put( bogey_movement( id, nav ) );
    };

}

export default function*() {
    yield takeEvery( movement_phase.type, move_bogeys );
};
