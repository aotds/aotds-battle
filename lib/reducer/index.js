'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inflate = undefined;

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _redux = require('redux');

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _objects = require('./objects');

var _objects2 = _interopRequireDefault(_objects);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const inflate = exports.inflate = (0, _updeep2.default)({
  objects: _objects.inflate
});

const reducer = (0, _redux.combineReducers)({
  game: _game2.default,
  objects: _objects2.default,
  log: _log2.default
});

exports.default = reducer;