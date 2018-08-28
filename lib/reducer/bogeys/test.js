"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _actions = require("../../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('init_game', () => {
  let state = (0, _index2.default)(undefined, (0, _actions.init_game)({
    bogeys: [{
      id: 'enkidu'
    }, {
      id: 'siduri'
    }]
  }));
  expect(state).toHaveProperty('enkidu');
  expect(state).toHaveProperty('siduri');
  console.log(state);
});