"use strict";

var _inflate = require("./inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('weapons', () => {
  let ship = {
    weaponry: {
      weapons: [{
        foo: 1
      }]
    }
  };
  expect((0, _inflate2.default)(ship).weaponry.weapons).toMatchObject({
    1: {
      foo: 1
    }
  });
});