'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inflate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _actions = require('../../../actions');

var _actions2 = _interopRequireDefault(_actions);

var _structure = require('./structure');

var _structure2 = _interopRequireDefault(_structure);

var _utils = require('../../utils');

var _drive = require('./drive');

var _drive2 = _interopRequireDefault(_drive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let debug = require('debug')('aotds:battle:reducer:object');

const inflate_firecons = _updeep2.default.if(_fp2.default.isNumber, _fp2.default.pipe(_fp2.default.times(i => i + 1), _fp2.default.map(id => ({ id }))));

const inflate_drive = _updeep2.default.if(_fp2.default.isNumber, max => ({ max, current: max }));

const inflate = exports.inflate = (0, _updeep2.default)({
    drive: inflate_drive,
    structure: _structure.inflate,
    weaponry: {
        firecons: inflate_firecons
    }
});

function firecon_reducer(state = {}, action) {
    switch (action.type) {
        case _actions2.default.EXECUTE_SHIP_FIRECON_ORDERS:
            if (action.firecon_id === state.id) return (0, _updeep2.default)(_fp2.default.pick(['target_id', 'weapons'])(action))(state);

            if (!action.weapons) return state;

            return (0, _updeep2.default)({
                weapons: w => _fp2.default.difference(w)(action.weapons)
            })(state);

        default:
            return state;
    }
}

let weapon_reducer = (0, _utils.actions_reducer)({
    ASSIGN_WEAPON_TO_FIRECON: action => _updeep2.default.if(_updeep2.default.is('id', action.weapon_id), {
        firecon_id: action.firecon_id
    })
});

let reaction = {};

reaction.PLAY_TURN = () => (0, _updeep2.default)({ drive: _updeep2.default.omit('thrust_used') });

reaction.CLEAR_ORDERS = () => _updeep2.default.omit('orders');

reaction.MOVE_OBJECT = ({ object_id, navigation }) => {
    return _updeep2.default.if(_updeep2.default.is('id', object_id), {
        navigation: _fp2.default.omit('thrust_used')(navigation),
        drive: { thrust_used: navigation.thrust_used }
    });
};

reaction.ASSIGN_WEAPON_TO_FIRECON = action => {
    return _updeep2.default.if(_updeep2.default.is('id', action.bogey_id), { weaponry: { weapons: _updeep2.default.map(w => weapon_reducer(w, action)) } });
};

reaction.EXECUTE_SHIP_FIRECON_ORDERS = action => state => {
    if (action.object_id !== state.id) return state;

    let reduce_firecon = f => firecon_reducer(f, action);
    return (0, _updeep2.default)({
        weaponry: { firecons: _updeep2.default.map(reduce_firecon) }
    })(state);
};

reaction.SET_ORDERS = action => _updeep2.default.if(s => !_fp2.default.has('orders.done')(s), {
    orders: _updeep2.default.constant(_extends({
        done: action.timestamp || true
    }, action.orders))
});

let subreducers = (0, _utils.combine_reducers)({ structure: _structure2.default });

exports.default = (0, _utils.pipe_reducers)([(0, _utils.init_reducer)({}), (0, _utils.combine_reducers)({ structure: _structure2.default, drive: _drive2.default }), (0, _utils.actions_reducer)(reaction)]);