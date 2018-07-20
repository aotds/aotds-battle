'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function* () {

    yield (0, _effects.takeEvery)(_Actions2.default.DAMAGE, check_if_object_destroyed);
    yield (0, _effects.takeEvery)(_Actions2.default.WEAPON_FIRE, fire_weapon);
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require('redux-saga/effects');

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _weapons = require('./weapons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const find_object = (state, id) => _lodash2.default.find(state.objects, { id });
const find_weapon = (ship, id) => _lodash2.default.find(ship.weapons, { id });

const check_if_object_destroyed = function* (action) {

    let ship = yield (0, _effects.select)(find_object, action.object_id);

    if (ship.is_destroyed) return; // already destroyed

    if (ship.hull <= 0) {
        yield (0, _effects.put)(_Actions2.default.destroyed({ object_id: ship.id }));
    }
};

const fire_weapon = function* (action) {

    let ship = yield (0, _effects.select)(find_object, action.object_id);
    let target = yield (0, _effects.select)(find_object, action.target_id);
    let weapon = find_weapon(ship, action.weapon_id);

    for (let action of (0, _weapons.weapon_fire)(ship, target, weapon)) {
        yield (0, _effects.put)(action);
    }
};