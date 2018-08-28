"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rigged_dice = undefined;
exports.roll_die = roll_die;
exports.cheatmode = cheatmode;
exports.rig_dice = rig_dice;
exports.roll_dice = roll_dice;

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let rigged_dice = exports.rigged_dice = [];
let cheatmode_enabled = false;

function roll_die(nbr_faces = 6) {
  if (cheatmode_enabled && !rigged_dice.length) {
    throw new Error("not enough dice");
  }

  return rigged_dice.length > 0 ? rigged_dice.shift() : _fp2.default.random(1, nbr_faces);
}

function cheatmode(enabled = true) {
  cheatmode_enabled = enabled;
}
/** 
 * Rig the next calls to roll_dice()
 * @param dice the dice values to return. Overwrite any previous rigging.
 */


function rig_dice(dice) {
  exports.rigged_dice = rigged_dice = dice;
}
/**
 * roll the dice
 * @param nbr_dice How many dice to roll
 * @param options.reroll Array of values for which we reroll
 * @return dice values
 */


function roll_dice(nbr_dice, options) {
  if (nbr_dice == 0) return [];

  let reroll_on = _fp2.default.pathOr([])('reroll')(options);

  let nbr_faces = _fp2.default.getOr(6)('nbr_faces')(options);

  let roll = _fp2.default.times(() => roll_die(nbr_faces))(nbr_dice);

  return roll.concat(roll_dice(_fp2.default.filter(x => _fp2.default.contains(x)(reroll_on))(roll).length, options));
}

;