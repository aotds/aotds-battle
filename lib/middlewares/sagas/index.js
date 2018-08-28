"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function* () {
  yield (0, _effects.takeEvery)(_actions.PLAY_TURN, _play_turn.play_turn);
  yield (0, _effects.takeEvery)(_actions.MOVEMENT_PHASE, _movement.movement_phase);
};

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require("redux-saga/effects");

var _movement = require("./movement");

var _play_turn = require("./play_turn");

var _actions = require("../../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:sagas');