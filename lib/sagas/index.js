'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.object_movement_phase = object_movement_phase;
exports.turn_movement_phase = turn_movement_phase;
exports.objects_movement_phase = objects_movement_phase;
exports.play_turn = play_turn;
exports.default = battleSagas;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require('redux-saga/effects');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _movement = require('../movement');

var _selectors = require('./selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:sagas');

// function *play_move_object ( action : PlayMoveObject ) :Generator<> {

//     let { object_id}  = action.payload;

//     let obj = yield select( get_object( object_id ) );

//     let navigation = gen_object_movement( obj, action.payload );

//     yield put( { type: 'MOVE_OBJECT', payload: {
//         object_id,
//         navigation,
//     }})
// }

function* object_movement_phase({ object_id }) {
    let object = yield (0, _effects.select)(_selectors.object_by_id, object_id);

    let mov = (0, _movement.plot_movement)(object, _lodash2.default.get(object, 'orders.navigation', {}));

    for (let action of mov) {
        yield (0, _effects.put)(action);
    }
}

const omp = store => next => action => {
    let object = (0, _selectors.object_by_id)(object_id)(store.getState());

    let mov = (0, _movement.plot_movement)(object, _lodash2.default.get(object, 'orders.navigation', {}));

    for (let action of mov) {
        store.dispatch(action);
    }
};

function* turn_movement_phase() {
    let objects = yield (0, _effects.select)(state => state.objects);

    for (let object of objects) {
        yield (0, _effects.put)(actions.object_movement_phase(object.id, _lodash2.default.get(object, 'orders.navigation', null)));
    }
}

function* objects_movement_phase() {
    let objects = yield (0, _effects.select)(state => _lodash2.default.get(state, 'objects', []));

    for (let obj of objects) {
        yield (0, _effects.put)(_actions2.default.move_object(obj.id));
    }

    yield (0, _effects.put)(_actions2.default.move_objects_done());
}

function* play_turn({ force }) {
    debug(force);
    if (!force) {
        return;
    }

    yield (0, _effects.put)(_actions2.default.start_turn());
    yield (0, _effects.put)(_actions2.default.move_objects());
    yield (0, _effects.take)(_actions2.default.MOVE_OBJECTS_DONE);
    yield (0, _effects.put)(_actions2.default.clear_orders());
}

function* battleSagas() {
    // yield takeEvery( actions.TURN_MOVEMENT_PHASE,   turn_movement_phase );
    // yield takeEvery( actions.OBJECT_MOVEMENT_PHASE, object_movement_phase );
    yield (0, _effects.takeEvery)(_actions2.default.PLAY_TURN, play_turn);
    yield (0, _effects.takeEvery)(_actions2.default.MOVE_OBJECTS, objects_movement_phase);
    yield (0, _effects.takeEvery)(_actions2.default.MOVE_OBJECT, object_movement_phase);
}