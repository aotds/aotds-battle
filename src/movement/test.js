import _ from 'lodash';
import u from 'updeep';

const debug = require('debug')('aotds:movements:test');

import { plot_movement, round_coords, move_thrust,
    move_rotate
} from './index';

import {toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo, toMatchCloseTo });

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
                move_thrust( ship, thrust ).coords
            //).toHaveProperty( 'coords', result )
            ).toBeDeepCloseTo( result, 1 )
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
        expect( movement.navigation ).toMatchCloseTo({
            coords: angle[a],
            heading: +a,
        },1);
    }
});

const move_ok = ( ship, orders, expected ) => () => {
    let [ { navigation } ] = Array.from(plot_movement(ship, orders));
    debug("!!%O", expected);
    expect( navigation ).toMatchCloseTo( expected, 1 );
};

describe( 'change of speed', () => {
    let ship = { 
        navigation: { 
            coords: [0,0], 
            heading: 0,
            velocity: 10,
        },
        drive_rating: 6 
    };

    test( 'accelerate within engine capacity', move_ok(
        ship, { thrust: 6 },
        { velocity: 16, coords: [ 0,16 ] }
    ));

    test( 'accelerate more than engine capacity', move_ok(
        ship, { thrust: 16 },
        { velocity: 16, coords: [ 0,16 ] }
    ));

    test( 'decelerate', move_ok(
        ship, { thrust: -6 },
        { velocity: 4, coords: [ 0,4 ] }
    ));

    test( 'decelerate to min of zero', move_ok(
        u({ navigation: { velocity: 2 } })(ship), { thrust: -6 },
        { velocity: 0, coords: [ 0,0 ] }
    ));
});

describe( 'turning', () => {
    let ship = { 
        navigation: { coords: [0,0], velocity: 5, heading: 0 },
        drive_rating: 6 
    };

    test( 'turn of 3', move_ok( ship, { turn: 3 }, {
        coords: [ 4, 1.73 ],
        velocity: 5,
        heading: 3
    }));

    test( "turn of -3", move_ok( ship, { turn: -3 }, {
             coords: [ -4, 1.7 ],
            velocity: 5,
            heading: 9
        }));

    test( "can't turn more than limit", move_ok( ship, { turn: -9 }, {
            heading: 9
        }));

});

describe( 'banking', () => {
    let ship = { navigation: {
        coords: [0,0], velocity: 5, heading: 0 
    }, drive_rating:  6 };

    let tests = [
        [ 'bank while heading at 3', 
            u({ navigation: { heading: 3 }})(ship), { bank: -3 }, { coords: [5,3], heading: 3, velocity: 5 } ],
        [ 'bank of 3', ship, { bank: 3 }, { coords: [3,5], heading: 0, velocity: 5 } ],
        [ 'bank of -3', ship, { bank: -3 }, { coords: [-3,5], heading: 0, velocity: 5 } ],
        [ "can't bank more than the limit",
            ship, { bank: -9 }, { coords: [-3,5], heading: 0, velocity: 5 } ],
    ];

    tests.forEach( ([ desc, ship, orders, expected ]) => 
        test( desc, move_ok( ship, orders, expected ) )
    );

});

test( 'complex manoeuvers', () => {

    let ship = { 
        navigation: { coords: [0,0], velocity: 5, heading: 0 }, drive_rating:  6 
    };

    let [ { navigation } ] = Array.from( plot_movement( ship, 
        { bank: -1, thrust: -1, turn: 2 }
    ) );

    debug.inspectOpts.depth = 10;
    debug( "%O", navigation);

    expect(navigation.trajectory).toBeDeepCloseTo(
        [
            { type: "POSITION", coords: [0,0] },
            { type: "BANK", coords: [-1,0], delta: [ -1, 0] },
            { type: "ROTATE", delta: 1, heading: 1 },
            { type: "MOVE", coords: [0,1.7], delta: [ 1, 1.7] },
            { type: "ROTATE", delta: 1, heading: 2 },
            { type: "MOVE", coords: [1.7,2.7], delta: [ 1.7, 1] },
            { type: "POSITION", coords: [1.7,2.7] },
        ], 1
    );

    move_ok( ship, 
        { bank: -1, thrust: -1, turn: 2 }, {
        velocity: 4,
        heading: 2,
        coords: [ 1.73,2.73]
    })();

});
