"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap = require("tap");
var movement_1 = require("../lib/battle/movement");
var tap_helpers_1 = require("./lib/tap_helpers");
console.log(tap);
tap_helpers_1.default(tap);
tap.test('simple movements', function (tap) {
    var angle = {
        0: [0, -10],
        1: [5, -8.66],
        2: [8.66, -5],
        3: [10, 0],
        6: [0, 10],
        9: [-10, 0],
        11: [-5, -8.66]
    };
    var ship = { coords: [0, 0], velocity: 10, heading: 0 };
    for (var a in angle) {
        var movement = movement_1.gen_ship_movement(__assign({}, ship, { heading: +a }));
        tap.match_move(movement, __assign({}, ship, { coords: angle[a], heading: +a }));
    }
    tap.end();
});
tap.test('change of speed', { autoend: true }, function (tap) {
    var ship = {
        coords: [0, 0],
        heading: 0,
        velocity: 10,
        engine_rating: 6
    };
    tap.match_move(movement_1.gen_ship_movement(ship, { thrust: 6 }), { velocity: 16, coords: [0, -16] }, "accelerate");
    tap.match_move(movement_1.gen_ship_movement(ship, { thrust: 7 }), { velocity: 16, coords: [0, -16] }, "accelerate within engine capacity");
    tap.match_move(movement_1.gen_ship_movement(ship, { thrust: -6 }), { velocity: 4, coords: [0, -4] }, "decelerate");
    tap.match_move(movement_1.gen_ship_movement(__assign({}, ship, { velocity: 2 }), { thrust: -6 }), { velocity: 0, coords: [0, 0] }, "decelerate to min zero");
});
// tap.test( 'turning', tap => {
//     let ship = { coords: [0,0], velocity: 5, heading: 0, engine_rating: 6 };
//     tap.match_move( object_calculate_movement( ship, { turn: 3 } ), {
//             coords: [ 4, -1.7 ],
//             velocity: 5,
//             heading: 3
//         },
//         "turn of 3",
//     );
//     tap.match_move( object_calculate_movement( ship, { turn: -3 } ), {
//             coords: [ -4, -1.7 ],
//             velocity: 5,
//             heading: 9
//         },
//         "turn of -3",
//     );
//     tap.match_move( object_calculate_movement( ship, { turn: -9 } ), {
//             heading: 9
//         },
//         "can't turn more than limit",
//     );
//     tap.end();
// });
// tap.test( 'banking', {autoend: true}, tap => {
//     let ship = {coords: [0,0], velocity: 5, heading: 0, engine_rating:  6 };
//     tap.match_move( object_calculate_movement(ship, { bank: 3 } ), {
//         coords: [ 3,-5],
//         heading: 0,
//         velocity: 5
//     }, "bank of 3" );
//     tap.match_move( object_calculate_movement(ship, { bank: -3 } ), {
//         coords: [ -3,-5],
//         heading: 0,
//         velocity: 5
//     }, "bank of -3" );
//     tap.match_move( object_calculate_movement(ship, { bank: -9 } ), {
//         coords: [ -3,-5],
//         heading: 0,
//         velocity: 5
//     }, "can't bank more than limit" );
// });
// tap.test( 'complex manoeuvers', { autoend: true }, tap => {
//     let ship = { 
//         coords: [0,0], velocity: 5, heading: 0, engine_rating:  6 };
//     tap.match_move( object_calculate_movement( ship, 
//         { bank: -1, thrust: -1, turn: 2 } ), {
//         velocity: 4,
//         heading: 2,
//         coords: [ 1.73,-2.73]
//     }, "complex manoeuver" );
// });
