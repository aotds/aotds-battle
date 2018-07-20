'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.relative_coords = relative_coords;
exports.fire_weapon = fire_weapon;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _dice = require('../dice');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:test');

(0, _dice.cheatmode)();

const rad2angle = rad => rad * 6 / Math.PI;

const canonize_angle = angle => {
    while (angle > 6) {
        angle -= 12;
    }
    while (angle <= -6) {
        angle += 12;
    }
    return angle;
};

function relative_coords(ship, target) {
    let result = {};
    let relative = _fp2.default.pipe([_fp2.default.map(_fp2.default.get('navigation.coords')), _fp2.default.zipAll, _fp2.default.map(x => x[1] - x[0])])([ship, target]);

    result.angle = rad2angle(Math.atan2(relative[0], relative[1]));

    result.bearing = result.angle - ship.navigation.heading;

    result.target_angle = 6 + result.angle;

    result.target_bearing = result.target_angle - target.navigation.heading;

    result = (0, _updeep2.default)({
        angle: canonize_angle,
        bearing: canonize_angle,
        target_bearing: canonize_angle,
        target_angle: canonize_angle,
        distance: Math.sqrt(_fp2.default.sum(relative.map(function (x) {
            return Math.pow(x, 2);
        })))
    })(result);

    return result;
}

const arc_range = {
    F: [[-1, 1]],
    FS: [[1, 3]],
    AS: [[3, 5]],
    A: [[5, 6], [-6, -5]],
    AP: [[-5, -3]],
    FP: [[-3, -1]]
};

const in_range = (min, max) => value => {
    return value >= min && value <= max;
};

function inArc(angle, arcs = Object.keys(arc_range)) {
    return arcs.find(a => arc_range[a].some(r => in_range(...r)(angle)));
}

function fire_weapon(attacker, target, weapon) {
    let result = { weapon };

    result = (0, _updeep2.default)(relative_coords(attacker, target))(result);

    if (!inArc(result.bearing, _fp2.default.getOr([], 'arcs')(weapon))) {
        return (0, _updeep2.default)({ no_firing_arc: true })(result);
    }

    if (inArc(result.bearing, ['A']) && _fp2.default.get('drive.thrust_used')(attacker)) {
        return (0, _updeep2.default)({ drive_interference: true })(result);
    }

    var nbr_dice = weapon.class - Math.trunc(result.distance / 12);

    if (nbr_dice <= 0) {
        return (0, _updeep2.default)({ out_of_range: true })(result);
    }

    let damage_dice = [];
    let penetrating_damage_dice = [];

    damage_dice = (0, _dice.roll_dice)(nbr_dice);
    penetrating_damage_dice = (0, _dice.roll_dice)(damage_dice.filter(x => x == 6).length, { reroll: [6] });

    if (inArc(result.target_bearing, ['A'])) {
        penetrating_damage_dice.unshift(...damage_dice);
        damage_dice = [];
    }

    result = (0, _updeep2.default)(_fp2.default.pickBy(v => v.length)({ damage_dice, penetrating_damage_dice }))(result);

    return result;
}

//     // split the damage calculation apart?

//     var table = { 4: 1, 5: 1, 6: 2 };
//     var damage = _.sum(dice.map(function (d) { return table[d] || 0; }));
//     if (damage > 0) {
//         yield {
//             type: 'DAMAGE',
//             object_id: target.id,
//             damage
//         };
//     }
//     damage = _.sum(penetrating.map(function (d) { return table[d] || 0; }));
//     if (damage > 0) {
//         yield {
//             type: 'DAMAGE',
//             is_penetrating: true,
//             object_id: target.id,
//             damage
//         };
//     }
// }