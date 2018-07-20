'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.objects_movement_phase = exports.play_turn = exports.add_timestamp = exports.object_movement_phase = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _weapons = require('./weapons');

var _weapons2 = _interopRequireDefault(_weapons);

var _selectors = require('./selectors');

var _utils = require('./utils');

var _movement = require('../movement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require("debug")("aotds:mw");

const object_movement_phase = exports.object_movement_phase = (0, _utils.mw_for)(_actions2.default.MOVE_OBJECT, ({ getState, dispatch }) => next => action => {

    let object = (0, _selectors.get_object_by_id)(getState(), action.object_id);

    next((0, _updeep2.default)({
        navigation: (0, _movement.plot_movement)(object, _lodash2.default.get(object, 'orders.navigation'))
    })(action));
});

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 

const add_timestamp = exports.add_timestamp = () => next => action => {
    action = (0, _updeep2.default)({ timestamp: new Date().toISOString() })(action);
    next(action);
};

const play_turn = exports.play_turn = (0, _utils.mw_for)(_actions2.default.PLAY_TURN, ({ getState, dispatch }) => next => action => {

    if (!action.force && ((0, _selectors.players_not_done)(getState()).length > 0 || (0, _selectors.active_players)(getState()).length <= 1)) {
        debug("waiting for ", (0, _selectors.players_not_done)(getState()));
        return;
    }

    next(action);
    dispatch(_actions2.default.move_objects());
    dispatch(_actions2.default.assign_weapons_to_firecons());
    dispatch(_actions2.default.execute_firecon_orders());
    dispatch(_actions2.default.fire_weapons());
    dispatch(_actions2.default.clear_orders());
});

const objects_movement_phase = exports.objects_movement_phase = (0, _utils.mw_for)(_actions2.default.MOVE_OBJECTS, ({ getState, dispatch }) => next => action => {
    next(action);
    _lodash2.default.get(getState(), 'objects', []).filter(o => o.navigation).map(o => o.id).forEach(id => dispatch(_actions2.default.move_object(id)));
});

let middlewares = [add_timestamp, objects_movement_phase, object_movement_phase, play_turn, ..._weapons2.default];

exports.default = middlewares;