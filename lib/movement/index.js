'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plot_movement = plot_movement;
exports.move_thrust = move_thrust;
exports.move_bank = move_bank;
exports.move_rotate = move_rotate;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:movement');

const upush = new_item => array => [...array, new_item];

// let ObjectNavigation = {
//     engine_rating: 'integer',
//     velocity: 'number',
//     coords: Array[2]number
//     heading: number,
// }

// let ShipMovementOrder = {
//     thrust: 'integer',
//     turn: 'integer',
//     bank: 'integer',
// }

function plot_movement(ship, orders = {}) {
    let navigation = ship.navigation;

    navigation = (0, _updeep2.default)({ trajectory: [{ type: 'POSITION', coords: navigation.coords }] })(navigation);

    //    navigation = move_thrust( navigation, navigation.velocity );

    let { thrust, turn, bank } = orders;
    if (!thrust) thrust = 0;
    if (!turn) turn = 0;
    if (!bank) bank = 0;

    let engine_rating = _fp2.default.getOr(0)('drive.current')(ship);

    let engine_power = engine_rating;

    let thrust_range = [_lodash2.default.max([-engine_power, -navigation.velocity]), engine_power];

    let clamp_thrust = thrust => _lodash2.default.clamp(thrust, ...thrust_range);

    if (thrust) {
        thrust = clamp_thrust(thrust);
        navigation = (0, _updeep2.default)({ velocity: v => v + thrust })(navigation);
        engine_power -= Math.abs(thrust);
    }

    if (turn) {
        let max = _lodash2.default.min([_lodash2.default.floor(engine_rating / 2), engine_power]);
        turn = _lodash2.default.clamp(turn, -max, max);
        engine_power -= Math.abs(turn);
    }

    if (bank) {
        let max = _lodash2.default.min([_lodash2.default.floor(engine_rating / 2), engine_power]);
        bank = _lodash2.default.clamp(bank, -max, max);
        engine_power -= Math.abs(bank);

        navigation = move_bank(navigation, bank);
    }

    if (turn) {
        let thrust = two_steps(navigation.velocity);
        let t = two_steps(turn);

        _lodash2.default.zip(t, thrust).forEach(m => {
            navigation = move_thrust(move_rotate(navigation, m[0]), m[1]);
        });
    } else {
        navigation = move_thrust(navigation, navigation.velocity);
    }

    // navigation = u({ trajectory: upush({ 
    //     type: 'POSITION', coords: navigation.coords 
    // })})(navigation);

    const sym_range = x => [-x, x];
    const side_maneuver = current => sym_range(_fp2.default.min([Math.abs(current) + engine_power, _lodash2.default.floor(engine_rating / 2)]));

    let max_thrust = Math.abs(thrust) + engine_power;

    let maneuvers = {
        thrust: [_fp2.default.max([-max_thrust, -ship.navigation.velocity]), max_thrust],
        bank: side_maneuver(bank),
        turn: side_maneuver(turn)
    };

    navigation = (0, _updeep2.default)({
        thrust_used: engine_rating - engine_power,
        maneuvers
    })(navigation);

    return navigation;
}

function move_thrust(navigation, thrust) {
    let angle = navigation.heading * Math.PI / 6;
    let delta = [Math.sin(angle), Math.cos(angle)].map(x => thrust * x);

    let coords = _lodash2.default.zip(navigation.coords, delta).map(_lodash2.default.sum);

    return _updeep2.default.if(thrust, {
        trajectory: upush({ type: 'MOVE', delta, coords }),
        coords
    })(navigation);
};

function move_bank(movement, velocity) {
    let angle = (movement.heading + 3) * Math.PI / 6;
    let delta = [Math.sin(angle), Math.cos(angle)].map(x => velocity * x);

    let coords = _lodash2.default.zip(movement.coords, delta).map(_lodash2.default.sum);

    return (0, _updeep2.default)({
        trajectory: _updeep2.default.withDefault([], upush({ type: 'BANK', delta, coords })),
        coords
    })(movement);
}

function canonicalHeading(heading) {
    while (heading < 0) {
        heading += 12;
    }
    return heading % 12;
}

function move_rotate(movement, angle) {
    let heading = canonicalHeading(movement.heading + angle);

    return (0, _updeep2.default)({
        trajectory: _updeep2.default.withDefault([], upush({
            type: 'ROTATE', delta: angle, heading
        })),
        heading
    })(movement);
}

function two_steps(n) {
    let splitted = [_lodash2.default.floor(n / 2), _lodash2.default.ceil(n / 2)];
    return n < 0 ? splitted.reverse() : splitted;
}