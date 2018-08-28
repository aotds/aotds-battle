"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculate_damage = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ship_max_shield = _lodash2.default.flow(_fp2.default.getOr({})('structure.shields'), _fp2.default.values, _fp2.default.map('level'), _fp2.default.max);

const calculate_damage = exports.calculate_damage = function ({
  bogey,
  penetrating,
  dice
}) {
  var _dice$map;

  let damage_table = {
    4: 1,
    5: 1,
    6: 2
  };

  if (!penetrating) {
    let shield = ship_max_shield(bogey);
    console.log(shield);
    damage_table = _fp2.default.pipe(_updeep2.default.if(shield, {
      4: 0
    }), _updeep2.default.if(shield == 2, {
      6: 1
    }))(damage_table);
  }

  return _dice$map = dice.map(d => damage_table[d] || 0), _fp2.default.sum(_dice$map);
};