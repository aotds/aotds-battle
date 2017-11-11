'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.weapon_fire = undefined;
exports.relative_coords = relative_coords;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dice = require('./dice');

var _jsonSchemaTypeChecking = require('../json-schema-type-checking');

var _jsonSchemaTypeChecking2 = _interopRequireDefault(_jsonSchemaTypeChecking);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _JsonSchemaValidator = (0, _jsonSchemaTypeChecking2.default)({
    schemas: _schema2.default
}),
    with_args = _JsonSchemaValidator.with_args,
    returns = _JsonSchemaValidator.returns,
    with_context = _JsonSchemaValidator.with_context,
    with_return = _JsonSchemaValidator.with_return;

function relative_coords(ship, target) {
    var result = {};
    var relative = _lodash2.default.zip.apply(null, [ship, target].map(function (s) {
        return s.coords;
    })).map(function (x) {
        return x[1] - x[0];
    });

    result.angle = Math.atan2(relative[0], relative[1]) * 180 / Math.PI;

    result.bearing = result.angle - ship.heading;

    result.distance = Math.sqrt(relative.map(function (x) {
        return Math.pow(x, 2);
    }).reduce(function (a, b) {
        return a + b;
    }));

    result.angle = _lodash2.default.round(result.angle, 0);
    result.bearing = _lodash2.default.round(result.bearing, 0);
    result.distance = _lodash2.default.round(result.distance, 2);

    return result;
}

var arcs = {
    F: [-30, 30],
    FP: [-90, -30],
    FS: [30, 90],
    AS: [90, 150],
    A: [-150, 150],
    AF: [-150, -90]
};

var weapon_fire = exports.weapon_fire = regeneratorRuntime.mark(function weapon_fire(attacker, target, weapon) {
    var weapon_fired, _relative_coords, distance, bearing, in_weapon_arc, nbr_dice, dice, penetrating, table, damage;

    return regeneratorRuntime.wrap(function weapon_fire$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    // right now it's all beam weapons
                    weapon_fired = _Actions2.default.weapon_fired({
                        object_id: attacker.id,
                        target_id: target.id,
                        weapon_id: weapon.id
                    });
                    _relative_coords = relative_coords(attacker, target), distance = _relative_coords.distance, bearing = _relative_coords.bearing;


                    weapon_fired.distance = distance;
                    weapon_fired.bearing = bearing;

                    in_weapon_arc = function in_weapon_arc(bearing) {
                        return weapon.arcs.map(function (x) {
                            return arcs[x];
                        }).some(function (arc) {
                            return _lodash2.default.inRange.apply(_lodash2.default, [bearing].concat(_toConsumableArray(arc)));
                        });
                    };

                    if (in_weapon_arc(bearing)) {
                        _context.next = 8;
                        break;
                    }

                    weapon_fired.no_firing_arc = true;
                    return _context.abrupt('return', actions);

                case 8:
                    nbr_dice = weapon.class - Math.trunc(distance / 12);


                    if (nbr_dice <= 0) {
                        nbr_dice = 0;
                        weapon_fired.out_of_range = true;
                    }

                    dice = (0, _dice.roll_dice)(nbr_dice);
                    penetrating = (0, _dice.roll_dice)(dice.filter(function (d) {
                        return d == 6;
                    }).length, { reroll: [6] });


                    weapon_fired.dice = dice;

                    weapon_fired.dice_penetrating = penetrating;

                    _context.next = 16;
                    return weapon_fired;

                case 16:

                    // split the damage calculation apart?

                    table = { 4: 1, 5: 1, 6: 2 };
                    damage = _lodash2.default.sum(dice.map(function (d) {
                        return table[d] || 0;
                    }));

                    if (!(damage > 0)) {
                        _context.next = 21;
                        break;
                    }

                    _context.next = 21;
                    return {
                        type: 'DAMAGE',
                        object_id: target.id,
                        damage: damage
                    };

                case 21:
                    damage = _lodash2.default.sum(penetrating.map(function (d) {
                        return table[d] || 0;
                    }));

                    if (!(damage > 0)) {
                        _context.next = 25;
                        break;
                    }

                    _context.next = 25;
                    return {
                        type: 'DAMAGE',
                        is_penetrating: true,
                        object_id: target.id,
                        damage: damage
                    };

                case 25:
                case 'end':
                    return _context.stop();
            }
        }
    }, weapon_fire, this);
});