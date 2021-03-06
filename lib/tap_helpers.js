"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tap) {
  tap.Test.prototype.addAssert('has_coords', 2, function (observed, expected, message, extra) {
    if (!message) message = 'has_coords';
    if (!Array.isArray(expected)) expected = expected.coords;
    if (!Array.isArray(observed)) observed = observed.coords;

    if (_.sum(_.zip(observed, expected).map(x => Math.pow(x[0] - x[1], 2))) < 0.01) {
      return this.pass(message);
    }

    return this.same(observed, expected, message);
  });
  tap.Test.prototype.addAssert('match_move', 2, function (observed, expected, message, extra) {
    return this.test(message || 'match_move', tap => {
      if (expected.coords) {
        tap.has_coords(observed, expected);
      }

      observed = _.omit(observed, ['coords']);
      expected = _.omit(expected, ['coords']);
      tap.match(observed, expected);
      tap.end();
    });
  });
};

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }