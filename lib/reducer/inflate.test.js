"use strict";

var _inflate = require("./inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds');

test('inflate', () => {
  let inflated = (0, _inflate2.default)({
    game: {},
    bogeys: [{
      id: 'enkidu',
      drive: 3,
      structure: {
        shields: [1, 1, 2]
      },
      weaponry: {
        firecons: 2
      }
    }]
  });
  expect(inflated).toMatchSnapshot();
});