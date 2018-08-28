"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _actions = require("../actions");

var _schemas = require("../schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:test');

expect.extend({
  toMatchSchema(received) {
    const pass = _schemas.ajv.validate({
      '$ref': 'http://aotds.babyl.ca/battle/game'
    }, received);

    if (pass) {
      return {
        message: () => `expected schema to not be valid, but it is`,
        pass: true
      };
    } else {
      return {
        message: () => `expected schema to be valid.\nschema: ${JSON.stringify(received)}\nerror: ${JSON.stringify(_schemas.ajv.errors)} `,
        pass: false
      };
    }
  }

});
test('basic', () => {
  let state = (0, _index2.default)(undefined, {
    type: 'DUMMY'
  });
  expect(state).toMatchObject({
    game: {
      turn: 0
    }
  });
  expect(state).toMatchSchema();
});
test('with bogey', () => {
  let state = (0, _index2.default)(undefined, _actions.actions.init_game({
    bogeys: [{
      id: 'enkidu'
    }]
  }));
  expect(state).toMatchSchema();
  expect(state).toHaveProperty('bogeys.enkidu');
  debug(state);
});