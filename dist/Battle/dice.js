'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rigged_dice = undefined;
exports.rig_dice = rig_dice;
exports.roll_dice = roll_dice;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rigged_dice = exports.rigged_dice = [];


var gen_dice = function gen_dice() {
    return rigged_dice.length > 0 ? rigged_dice.shift() : _lodash2.default.random(1, 6);
};

/** 
 * Rig the next calls to roll_dice()
 * @param dice the dice values to return. Overwrite any previous rigging.
 */
function rig_dice() {
    for (var _len = arguments.length, dice = Array(_len), _key = 0; _key < _len; _key++) {
        dice[_key] = arguments[_key];
    }

    exports.rigged_dice = rigged_dice = dice;
}

/**
 * options for roll_dice
 */


/**
 * roll the dice
 * @param nbr_dice How many dice to roll
 * @param options.reroll Array of values for which we reroll
 * @return dice values
 */
function roll_dice(nbr_dice) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (nbr_dice == 0) return [];

    var roll = _lodash2.default.times(nbr_dice, gen_dice);

    if (!options.reroll) options.reroll = [];

    var reroll = options.reroll || [];

    return roll.concat(roll_dice(roll.filter(function (n) {
        return reroll.indexOf(n) > -1;
    }).length, options));
};