import _ from 'lodash';
import u from 'updeep';

const debug = require('debug')('aotds:movements:test');

import { plot_movement, round_coords, move_thrust,
    move_rotate
} from './index';

const round = x => _.round(x,1)
const roundup_nav= u({ 
    coords: u.map( round ),
    trajectory: u.map( u({
        coords: u.map(round),
        delta:  u.map(round),
    }) )
});


test( 'move_thrust', () => {
    let ship = { coords: [ 0, 0 ], heading: 1, trajectory: [], velocity: 0 };

    [ [ 0, [0,0] ], [ 1, [0.5,0.9] ], [ 10, [5,8.7] ] ].forEach(
        ([ thrust, result ]) => {
            expect( 
                roundup_nav( move_thrust( ship, thrust ) )
            ).toHaveProperty( 'coords', result )
        });
});

test( 'move_rotate', () => {
    let ship = { coords: [ 0, 0 ], heading: 0, trajectory: [], velocity: 0 };

    [
        [ 0, 0 ],
        [ 1, 1 ],
        [ -1, 11 ],
        [ 12, 0 ]
    ].forEach( ([ turn, heading ]) => {
        expect( move_rotate( ship, turn ) ).toHaveProperty( 'heading', heading );
    });
});


test( 'simple movements', () => {

    let angle = {
        0:  [0, 10 ],
        1:  [5, 8.7],
        2:  [ 8.7, 5 ],
        3:  [10, 0 ],
        6:  [0, -10 ],
        9:  [-10, 0],
        11: [ -5, 8.7 ]
    };

    let ship = { navigation: { coords: [0,0], velocity: 10, heading: 0 } };

    for ( let a in angle ) {
        ship.navigation.heading = +a;
        let [ movement ] = Array.from(plot_movement(ship));
        debug(movement);
        expect( roundup_nav( movement.navigation ) ).toMatchObject({
            coords: angle[a],
            heading: +a,
        });
    }
});

// tap.test( 'change of speed', { autoend: true }, tap => {
//     let ship = { 
//         coords: [0,0], 
//         heading: 0,
//         velocity: 10,
//         engine_rating: 6 
//     };

//     tap.match_move( ship::plot_movement({ thrust: 6 }), 
//          { velocity: 16, coords: [0,16] }, "accelerate" );

//      tap.match_move( ship::plot_movement({ thrust: 7 }),
//          { velocity: 16, coords: [0,16] }, 
//          "accelerate within engine capacity" 
//      ); 

//     tap.match_move( ship::plot_movement({ thrust: -6 }),
//          { velocity: 4, coords: [0,4] }, "decelerate" ); 

//      tap.match_move( ({ ...ship, velocity: 2 })::plot_movement( { thrust: -6 }),
//          { velocity: 0, coords: [0,0] }, "decelerate to min zero" ); 

// });

// tap.test( 'turning', tap => {
//     let ship = { coords: [0,0], velocity: 5, heading: 0, engine_rating: 6 };

//     tap.match_move( ship::plot_movement( { turn: 3 } ), {
//             coords: [ 4, 1.73 ],
//             velocity: 5,
//             heading: 3
//         },
//         "turn of 3",
//     );

//      tap.match_move( ship::plot_movement( { turn: -3 } ), {
//              coords: [ -4, 1.7 ],
//             velocity: 5,
//             heading: 9
//         },
//         "turn of -3",
//     );

//     tap.match_move( ship::plot_movement({ turn: -9 } ), {
//             heading: 9
//         },
//         "can't turn more than limit",
//     );

//     tap.end();
// });

// tap.test( 'banking', {autoend: true}, tap => {
//     let ship = {coords: [0,0], velocity: 5, heading: 0, engine_rating:  6 };

//     tap.match_move( ship::plot_movement({ bank: 3 } ), {
//         coords: [ 3,5],
//         heading: 0,
//         velocity: 5
//     }, "bank of 3" );

//     tap.match_move( ship::plot_movement({ bank: -3 } ), {
//         coords: [ -3,5],
//         heading: 0,
//         velocity: 5
//     }, "bank of -3" );

//     tap.match_move( ship::plot_movement({ bank: -9 } ), {
//         coords: [ -3,5],
//         heading: 0,
//         velocity: 5
//     }, "can't bank more than limit" );

//     tap.match_move( ({...ship, heading: 3 })::plot_movement({ bank: -3 } ), {
//         coords: [ 5,3],
//         heading: 3,
//         velocity: 5
//     }, "banking at 3" );


// });

// tap.test( 'complex manoeuvers', { autoend: true }, tap => {

//     let ship = { 
//         coords: [0,0], velocity: 5, heading: 0, engine_rating:  6 };

//     tap.match_move( ship::plot_movement(
//         { bank: -1, thrust: -1, turn: 2 } ), {
//         velocity: 4,
//         heading: 2,
//         coords: [ 1.73,2.73]
//     }, "complex manoeuver" );

// });
