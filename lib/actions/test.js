"use strict";

var _actions = require("../actions");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('it loads', () => {
  test('INIT_GAME', () => {
    expect(_actions.INIT_GAME).toBe('INIT_GAME');
  });
  test('schema', () => {
    expect(_actions2.default.schema).toBeDefined();
    expect(_actions2.default.schema['$id']).toBe('http://aotds.babyl.ca/battle/actions');
  });
  test('action with restrictions', () => {
    expect(_actions.bogey_fire_weapon).toThrow();
    expect(() => (0, _actions.bogey_fire_weapon)('enkidu', 'siduri', 1)).not.toThrow();
  });
});
test('meta info', () => {
  expect(_actions2.default.schema).toHaveProperty('definitions.play_turn.properties.meta');
  expect(_actions2.default.schema).toHaveProperty('definitions.init_game.properties.meta');
  expect(() => _actions2.default.validate({
    type: 'INIT_GAME',
    meta: {
      id: "potato"
    }
  })).toThrow();

  _actions2.default.validate({
    type: 'INIT_GAME',
    meta: {
      id: 1
    }
  });

  expect(() => _actions2.default.validate({
    type: 'INIT_GAME',
    meta: {
      id: 1
    }
  })).not.toThrow();
});