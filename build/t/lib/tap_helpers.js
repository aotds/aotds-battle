"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function default_1(tap) {
    console.log(tap);
    tap.Test.prototype.addAssert('has_coords', 2, function (observed, expected, message, extra) {
        if (!message)
            message = 'has_coords';
        if (_.sum(_.zip(observed.coords, expected.coords).map(function (x) { return Math.pow(x[0] - x[1], 2); })) < 0.01) {
            return this.pass(message);
        }
        else {
            return this.same(observed, expected, message);
        }
    });
    tap.Test.prototype.addAssert('match_move', 2, function (observed, expected, message, extra) {
        return this.test(message || 'match_move', function (tap) {
            if (expected.coords) {
                tap.has_coords(observed, expected);
            }
            observed = _.omit(observed, ['coords']);
            expected = _.omit(expected, ['coords']);
            tap.match(observed, expected);
            tap.end();
        });
    });
}
exports.default = default_1;
