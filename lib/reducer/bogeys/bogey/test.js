"use strict";

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _actions = require("../../../actions");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('thrust_used', () => {
  let ship = {
    drive: {},
    navigation: {}
  };
  let state = (0, _index2.default)(ship, (0, _actions.bogey_movement)('enkidu', {
    thrust_used: 2
  }));
  expect(state).toMatchObject({
    drive: {
      thrust_used: 2
    }
  });
  state = (0, _index2.default)(state, (0, _actions.play_turn)());
  expect(state.drive).not.toHaveProperty('thrust_used');
});
test('internal damage', () => {
  let ship = {
    drive: {
      rating: 9
    },
    weaponry: {
      firecons: [{
        id: 1
      }],
      weapons: [{
        id: 1
      }]
    }
  };
  ship = (0, _index2.default)(ship, (0, _actions.internal_damage)('enkidu', {
    type: 'drive'
  }));
  expect(ship).toMatchObject({
    drive: {
      damage_level: 1,
      current: 4
    }
  });
  ship = (0, _index2.default)(ship, (0, _actions.internal_damage)('enkidu', {
    type: 'drive'
  }));
  expect(ship).toMatchObject({
    drive: {
      damage_level: 2,
      current: 0
    }
  });
});