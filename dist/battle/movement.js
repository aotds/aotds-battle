'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gen_ship_movement = undefined;

var _context;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonSchemaTypeChecking = require('../json-schema-type-checking');

var _jsonSchemaTypeChecking2 = _interopRequireDefault(_jsonSchemaTypeChecking);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _JsonSchemaValidator = (0, _jsonSchemaTypeChecking2.default)({
    schemas: _schema2.default
}),
    with_args = _JsonSchemaValidator.with_args,
    returns = _JsonSchemaValidator.returns,
    with_context = _JsonSchemaValidator.with_context,
    with_return = _JsonSchemaValidator.with_return;

var gen_ship_movement = exports.gen_ship_movement = (_context = (_context = function _context() {
    var orders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var thrust = orders.thrust,
        turn = orders.turn,
        bank = orders.bank;


    var engine_rating = this.engine_rating;

    var movement = {
        trajectory: [['POSITION', this.coords]],
        velocity: this.velocity || 0,
        coords: this.coords || [0, 0],
        heading: this.heading || 0
    };

    var engine_power = engine_rating;

    var thrust_range = [_lodash2.default.max([-engine_power, -movement.velocity]), engine_power];

    var clamp_thrust = _lodash2.default.partial.apply(_lodash2.default, [_lodash2.default.clamp, _lodash2.default].concat(thrust_range));

    if (thrust) {
        thrust = clamp_thrust(thrust);
        movement.velocity += thrust;
        engine_power -= thrust;
    }

    if (turn) {
        var max = _lodash2.default.min([_lodash2.default.floor(engine_rating / 2), engine_power]);
        turn = _lodash2.default.clamp(turn, -max, max);
        engine_power -= turn;
    }

    if (bank) {
        var _max = _lodash2.default.min([_lodash2.default.floor(engine_rating / 2), engine_power]);
        bank = _lodash2.default.clamp(bank, -_max, _max);
        engine_power -= bank;

        movement = move_bank(bank, movement);
    }

    if (turn) {
        var _thrust = [_lodash2.default.floor(movement.velocity / 2), _lodash2.default.ceil(movement.velocity / 2)];
        var t = [_lodash2.default.floor(turn / 2), _lodash2.default.ceil(turn / 2)];
        if (turn < 0) {
            t = t.reverse();
        }

        _lodash2.default.zip(t, _thrust).forEach(function (m) {
            var _context2;

            (_context2 = movement, move_rotate).call(_context2, m[0]);
            (_context2 = movement, move_thrust).call(_context2, m[1]);
        });
    } else {
        var _context3;

        (_context3 = movement, move_thrust).call(_context3, movement.velocity);
    }

    movement.coords = round_coords(movement.coords);

    return movement;
}, with_args).call(_context, { items: [_schema2.default.orders] }), with_return).call(_context, 'movement');

function round_coords(coords) {
    return coords.map(function (x) {
        return _lodash2.default.round(x, 2);
    });
}

var move_thrust = (_context = (_context = function _context(velocity) {
    var angle = this.heading * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) {
        return velocity * x;
    });

    this.trajectory.push(['MOVE', delta]);
    this.coords = _lodash2.default.zip(this.coords, delta).map(_lodash2.default.sum);

    return this;
}, with_return).call(_context, 'movement'), with_context).call(_context, 'movement');

function move_bank(velocity, movement) {
    var angle = (movement.heading - 3) * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) {
        return velocity * x;
    });

    movement.trajectory.push(['MOVE', delta]);
    movement.coords = _lodash2.default.zip(movement.coords, delta).map(_lodash2.default.sum);

    return movement;
}

var move_rotate = (_context = (_context = function _context() {
    var angle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    this.trajectory.push(['ROTATE', angle]);
    this.heading += angle >= 0 ? angle : 12 + angle % 12;
    this.heading %= 12;

    return this;
}, with_return).call(_context, 'movement'), with_context).call(_context, 'movement');