'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gen_object_movement = undefined;
exports.move_thrust = move_thrust;
exports.move_bank = move_bank;
exports.move_rotate = move_rotate;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var upush = function upush(new_item) {
    return function (array) {
        return [].concat(_toConsumableArray(array), [new_item]);
    };
};

var gen_object_movement = exports.gen_object_movement = function gen_object_movement(ship) {
    var orders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var thrust = orders.thrust,
        turn = orders.turn,
        bank = orders.bank;


    var engine_rating = ship.engine_rating || 0;

    var movement = {
        trajectory: [['POSITION', ship.coords]],
        velocity: ship.velocity || 0,
        coords: ship.coords || [0, 0],
        heading: ship.heading || 0
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

        movement = move_bank(movement, bank);
    }

    if (turn) {
        var _thrust = two_steps(movement.velocity);
        var t = two_steps(turn);

        _lodash2.default.zip(t, _thrust).forEach(function (m) {
            movement = move_thrust(move_rotate(movement, m[0]), m[1]);
        });
    } else {
        movement = move_thrust(movement, movement.velocity);
    }

    return movement;
};

function move_thrust(movement, thrust) {
    var angle = movement.heading * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) {
        return thrust * x;
    });

    return (0, _updeep2.default)({
        trajectory: _updeep2.default.withDefault([], upush(['MOVE', delta])),
        coords: _lodash2.default.zip(movement.coords, delta).map(_lodash2.default.sum)
    })(movement);
};

function move_bank(movement, velocity) {
    var angle = (movement.heading + 3) * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) {
        return velocity * x;
    });

    return (0, _updeep2.default)({
        trajectory: _updeep2.default.withDefault([], upush(['MOVE', delta])),
        coords: _lodash2.default.zip(movement.coords, delta).map(_lodash2.default.sum)
    })(movement);
}

function move_rotate(movement) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return (0, _updeep2.default)({
        trajectory: _updeep2.default.withDefault([], upush(['ROTATE', angle])),
        heading: function (_heading) {
            function heading(_x3) {
                return _heading.apply(this, arguments);
            }

            heading.toString = function () {
                return _heading.toString();
            };

            return heading;
        }(function (heading) {
            heading += angle >= 0 ? angle : 12 + angle % 12;
            heading %= 12;
            return heading;
        })
    })(movement);
}

function two_steps(n) {
    var splitted = [_lodash2.default.floor(n / 2), _lodash2.default.ceil(n / 2)];
    return n < 0 ? splitted.reverse() : splitted;
}