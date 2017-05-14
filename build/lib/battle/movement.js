"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
;
;
;
function gen_ship_movement(ship, orders) {
    var thrust = orders.thrust, turn = orders.turn, bank = orders.bank;
    var engine_rating = ship.engine_rating || 0;
    var movement = {
        trajectory: [['POSITION', ship.coords]],
        velocity: ship.velocity || 0,
        coords: ship.coords || [0, 0],
        heading: ship.heading || 0
    };
    var engine_power = engine_rating;
    var thrust_range = [
        _.max([-engine_power, -movement.velocity]), engine_power
    ];
    var clamp_thrust = _.partial.apply(_, [_.clamp, _].concat(thrust_range));
    if (thrust) {
        thrust = clamp_thrust(thrust);
        movement.velocity += thrust;
        engine_power -= thrust;
    }
    if (turn) {
        var max = _.min([_.floor(engine_rating / 2), engine_power]);
        turn = _.clamp(turn, -max, max);
        engine_power -= turn;
    }
    if (bank) {
        var max = _.min([_.floor(engine_rating / 2), engine_power]);
        bank = _.clamp(bank, -max, max);
        engine_power -= bank;
        movement = move_bank(bank, movement);
    }
    if (turn) {
        var thrust_1 = [_.floor(movement.velocity / 2), _.ceil(movement.velocity / 2)];
        var t = [_.floor(turn / 2), _.ceil(turn / 2)];
        if (turn < 0) {
            t = t.reverse();
        }
        _.zip(t, thrust_1).forEach(function (m) {
            movement = move_rotate(m[0], movement);
            movement = move_thrust(m[1], movement);
        });
    }
    else {
        movement = move_thrust(movement.velocity, movement);
    }
    movement.coords = round_coords(movement.coords);
    return movement;
}
exports.gen_ship_movement = gen_ship_movement;
function round_coords(coords) {
    return coords.map(function (x) { return _.round(x, 2); });
}
// import _t from 'Game/Schema';
// export 
// let object_calculate_movement = _t('movement')( 
//     (object,orders={}) => {
// });
function move_thrust(velocity, movement) {
    var angle = (6 - movement.heading) * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) { return velocity * x; });
    movement.trajectory.push(['MOVE', delta]);
    movement.coords = _.zip(movement.coords, delta).map(_.sum);
    return movement;
}
function move_bank(velocity, movement) {
    var angle = (6 - movement.heading - 3) * Math.PI / 6;
    var delta = [Math.sin(angle), Math.cos(angle)].map(function (x) { return velocity * x; });
    movement.trajectory.push(['MOVE', delta]);
    movement.coords = _.zip(movement.coords, delta).map(_.sum);
    return movement;
}
function move_rotate(angle, movement) {
    movement.trajectory.push(['ROTATE', angle]);
    movement.heading += angle >= 0 ? angle : (12 + (angle % 12));
    movement.heading %= 12;
    return movement;
}
