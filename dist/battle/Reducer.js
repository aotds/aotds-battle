'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionsHandler;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _Log = require('./Reducer/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function actionsHandler(actions, default_state) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : default_state;
        var action = arguments[1];

        var reducer = actions[action.type] || actions['*'];

        if (reducer) return reducer(state, action);

        return state;
    };
}

function firecon_reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (state.id !== action.firecon_id) {
        return state;
    }

    switch (action.type) {
        case _Actions2.default.FIRECON_TARGET:
            return _extends({}, state, { target_id: action.target_id });

        default:
            return state;
    }
}

function weapon_reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (state.id !== action.weapon_id) {
        return state;
    }

    switch (action.type) {
        case _Actions2.default.FIRECON_WEAPON:
            return _extends({}, state, { firecon_id: action.firecon_id });

        default:
            return state;
    }
}

function object_reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (state.id !== action.object_id) {
        return state;
    }

    switch (action.type) {
        case _Actions2.default.FIRECON_TARGET:
            return _extends({}, state, { firecons: state.firecons.map(function (f) {
                    return firecon_reducer(f, action);
                }) });

        case _Actions2.default.FIRECON_WEAPON:
            return _extends({}, state, { weapons: state.weapons.map(function (f) {
                    return weapon_reducer(f, action);
                }) });

        case _Actions2.default.DAMAGE:
            return _extends({}, state, { hull: state.hull - action.damage });

        case _Actions2.default.DESTROYED:
            return _extends({}, state, { is_destroyed: true });

        default:
            return state;
    }
}

var objects = actionsHandler((_actionsHandler = {}, _defineProperty(_actionsHandler, _Actions2.default.INIT_GAME, function (state, action) {
    return action.objects;
}), _defineProperty(_actionsHandler, '*', function _(state, action) {

    if (action.object_id) {
        return state.map(function (o) {
            return object_reducer(o, action);
        });
    }

    return state;
}), _actionsHandler), []);

var game = actionsHandler(_defineProperty({}, _Actions2.default.INIT_GAME, function (state, _ref) {
    var name = _ref.name;
    return { name: name };
}), {});

var reducer = (0, _redux.combineReducers)({ log: _Log2.default, objects: objects, game: game });

exports.default = reducer;