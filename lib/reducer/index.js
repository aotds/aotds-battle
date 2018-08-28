"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _redux = require("redux");

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

var _log = require("./log");

var _log2 = _interopRequireDefault(_log);

var _bogeys = require("./bogeys");

var _bogeys2 = _interopRequireDefault(_bogeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reducer = (0, _redux.combineReducers)({
  game: _game2.default,
  bogeys: _bogeys2.default,
  log: _log2.default
});
exports.default = reducer;