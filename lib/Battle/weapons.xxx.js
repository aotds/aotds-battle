"use strict";

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _weapons = require("./weapons");

var _dice = require("./dice");

var _Logger = require("../Logger");

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let attacker = {
  "id": "enkidu",
  "name": "Enkidu",
  "drive_rating": 5,
  "heading": 0,
  "coords": [0, 0],
  "firecons": [{
    "id": 0,
    target_id: 'siduri'
  }],
  "weapons": [{
    "arcs": ["F"],
    "class": 1,
    "id": 0,
    "type": "beam",
    "firecon": 0
  }]
};
let target = {
  "coords": [0, 10],
  "firecons": [{
    "id": 0
  }],
  "id": "siduri",
  "name": "Siduri",
  "hull": 12,
  "max_hull": 12,
  "heading": 0,
  "weapons": [{
    "id": 0
  }]
};

_tap2.default.test('basic stuff', {
  autoend: true
}, tap => {
  (0, _dice.rig_dice)(6, 6, 4);
  let result = (0, _weapons.weapon_fire)(attacker, target, attacker.weapons[0]);
  tap.ok(_lodash2.default.findIndex(result, {
    type: 'DAMAGE',
    damage: 2
  }) > -1, 'normal damage');
  tap.ok(_lodash2.default.findIndex(result, {
    type: 'DAMAGE',
    is_penetrating: true,
    damage: 3
  }) > -1, 'penetrating damage');
});