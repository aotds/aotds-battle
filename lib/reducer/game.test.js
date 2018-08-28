"use strict";

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

var _actions = require("../actions");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds');

test('times', () => {
  let timestamp = '2018-04-03T22:52:33.845Z';
  let state = (0, _game2.default)({
    turn_times: {
      max: "24h"
    }
  }, {
    type: 'PLAY_TURN',
    meta: {
      timestamp
    }
  });
  expect(state).toMatchObject({
    turn_times: {
      max: "24h",
      started: timestamp,
      deadline: '2018-04-04T22:52:33.845Z'
    }
  });
});