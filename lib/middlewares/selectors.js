"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_bogey = exports.get_bogeys = undefined;
exports.select = select;
exports.get_active_players = get_active_players;
exports.get_players_not_done = get_players_not_done;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:selector');

function select(func, ...args) {
  return func(...args);
}

const get_bogeys = exports.get_bogeys = () => _lodash2.default.flow([_fp2.default.getOr({})('bogeys'), _fp2.default.values]);

const get_bogey = exports.get_bogey = id => _fp2.default.flow([_fp2.default.getOr([], 'bogeys'), _fp2.default.find({
  id
})]);

function get_active_players(state) {
  return _fp2.default.reject({
    status: 'inactive'
  })(state.game.players);
}

;

function get_players_not_done(state) {
  var _ref, _ref2, _ref3, _state, _active_players;

  let active_players = get_active_players(state); // all bogeys not done 

  let players_not_done = (_ref = (_ref2 = (_ref3 = (_state = state, _fp2.default.get('bogeys')(_state)), _fp2.default.reject('orders.done')(_ref3)), _fp2.default.map('player_id')(_ref2)), _fp2.default.uniq(_ref));
  return _active_players = active_players, _fp2.default.filter(p => _lodash2.default.includes(players_not_done, p.id))(_active_players);
}