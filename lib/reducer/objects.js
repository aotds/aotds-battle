'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inflate = undefined;

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _object = require('./objects/object');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let debug = require('debug')('aotds:test');

const inflate = exports.inflate = _updeep2.default.map(_object.inflate);

const assertAction = {
    set(object, prop, value) {
        if (prop !== '*' && !_actions2.default[prop]) throw new Error(`${prop} is not a known action`);

        return Reflect.set(...arguments);
    }
};

let redaction = new Proxy({}, assertAction);

const default_selector = action => _fp2.default.matchesProperty('id', action.object_id);
const only_target_object = (selector = default_selector) => action => {
    return _updeep2.default.map(_updeep2.default.if(selector(action), obj => (0, _object2.default)(obj, action)));
};

redaction.PLAY_TURN = action => _updeep2.default.reject(_updeep2.default.is('structure.status', 'destroyed'));

redaction.INTERNAL_DAMAGE = only_target_object();
redaction.DAMAGE = only_target_object();

redaction.INIT_GAME = ({ objects }) => () => objects;

const bogey_reducer = (0, _utils.mapping_reducer)(_object2.default);

redaction.SET_ORDERS = bogey_reducer(({ object_id: id }) => _lodash2.default.matches({ id }));

redaction['*'] = action => state => {
    switch (action.type) {

        case _actions2.default.MOVE_OBJECT:
        case _actions2.default.CLEAR_ORDERS:
        case _actions2.default.EXECUTE_SHIP_FIRECON_ORDERS:
        case _actions2.default.ASSIGN_WEAPON_TO_FIRECON:
            return state.map(obj => (0, _object2.default)(obj, action));

        default:
            return state;
    }
};

debug(redaction);
exports.default = (0, _utils.actions_reducer)(redaction, []);