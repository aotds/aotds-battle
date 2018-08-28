"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _actions = require("../../../actions");

var _actions2 = _interopRequireDefault(_actions);

var _structure = require("./structure");

var _structure2 = _interopRequireDefault(_structure);

var _inflate = require("./inflate");

var _inflate2 = _interopRequireDefault(_inflate);

var _utils = require("../../utils");

var _drive = require("./drive");

var _drive2 = _interopRequireDefault(_drive);

var _firecon = require("./firecon");

var _firecon2 = _interopRequireDefault(_firecon);

var _weapon = require("./weapon");

var _weapon2 = _interopRequireDefault(_weapon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let debug = require('debug')('aotds:battle:reducer:object');

let reaction = {};

reaction.PLAY_TURN = () => (0, _updeep2.default)({
  drive: _updeep2.default.omit('thrust_used')
});

reaction.CLEAR_ORDERS = () => _updeep2.default.omit('orders');

reaction.BOGEY_MOVEMENT = ({
  navigation
}) => {
  return (0, _updeep2.default)({
    navigation: _fp2.default.omit('thrust_used')(navigation),
    drive: {
      thrust_used: navigation.thrust_used
    }
  });
};

reaction.ASSIGN_WEAPON_TO_FIRECON = action => {
  return _updeep2.default.if(_updeep2.default.is('id', action.bogey_id), {
    weaponry: {
      weapons: _updeep2.default.map(w => weapon_reducer(w, action))
    }
  });
};

reaction.SET_ORDERS = action => _updeep2.default.if(s => !_fp2.default.has('orders.done')(s), {
  orders: _updeep2.default.constant(_extends({
    done: action.timestamp || true
  }, action.orders))
});

reaction.EXECUTE_FIRECON_ORDERS = action => _updeep2.default.updateIn(`weaponry.firecons.${action.firecon_id}`, s => (0, _firecon2.default)(s, action));

reaction.EXECUTE_WEAPON_ORDERS = action => _updeep2.default.updateIn(`weaponry.weapons.${action.weapon_id}`, s => (0, _weapon2.default)(s, action));

exports.default = (0, _utils.pipe_reducers)([(0, _utils.init_reducer)({}), (0, _utils.combine_reducers)({
  structure: _structure2.default,
  drive: _drive2.default
}), (0, _utils.actions_reducer)(reaction)]);