import tap from 'tap';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';

import { plotMovement, move_thrust, move_rotate } from './plotMovement';
import { NavigationState, Coords } from '../navigation';

function roundDeep(obj) {
    return fp.mapValues(v => (typeof v === 'object' ? roundDeep(v) : typeof v === 'number' ? _.round(v, 2) : v))(obj);
}

const { test } = tap;

test('move_thrust', async t => {
    const ship: NavigationState = { coords: [0, 0], heading: 1, velocity: 0 };

    const cases: [number, Coords][] = [
        [0, [0, 0]],
        [1, [0.5, 0.87]],
        [10, [5, 8.66]],
    ];

    cases.forEach(([thrust, result]: [number, Coords]) => {
        t.match(roundDeep(move_thrust(ship, thrust)), {
            coords: result,
        });
    });
});

test('move_rotate', async t => {
    const ship = { coords: [0, 0], heading: 0, velocity: 0 } as NavigationState;

    [
        [0, 0],
        [1, 1],
        [-1, 11],
        [12, 0],
    ].forEach(([turn, heading]) => {
        t.is(move_rotate(ship, turn).heading, heading);
    });
});

test('simple movements', async t => {
    const angle: { [angle: string]: Coords } = {
        0: [0, 10],
        1: [5, 8.66],
        2: [8.66, 5],
        3: [10, 0],
        6: [0, -10],
        9: [-10, -0],
        11: [-5, 8.66],
    };

    const ship = { navigation: { coords: [0, 0], velocity: 10, heading: 0 } };

    for (const a in angle) {
        ship.navigation.heading = +a;
        const movement = plotMovement(ship as any);
        t.match(roundDeep(movement) as any, {
            coords: angle[a],
            heading: +a,
        });
    }
});

tap.Test.prototype.addAssert('move_ok', 3, function(
    this: any,
    ship: any,
    orders: any,
    expected: object,
    message = 'move match',
    extra = {},
) {
    const navigation = roundDeep(plotMovement(u.updateIn('orders.navigation', orders)(ship)));

    return this.match(navigation, expected, message, extra);
});

test('change of speed', async t => {
    const ship = {
        navigation: {
            coords: [0, 0],
            heading: 0,
            velocity: 10,
        },
        drive: { rating: 6, current: 6 },
    } as any;

    t.move_ok(ship, { thrust: 6 }, { velocity: 16, coords: [0, 16] }, 'accelerate within engine capacity');

    t.move_ok(ship, { thrust: 16 }, { velocity: 16, coords: [0, 16] }, 'accelerate more than engine capacity');

    t.move_ok(ship, { thrust: -6 }, { velocity: 4, coords: [0, 4] }, 'decelerate');

    t.move_ok(
        u.updateIn('navigation.velocity', 2, ship),
        { thrust: -6 },
        { velocity: 0, coords: [0, 0] },
        'decelerate to min of zero',
    );
});

test('turning', async t => {
    const ship = {
        navigation: { coords: [0, 0], velocity: 5, heading: 0 },
        drive: { current: 6 },
    };

    t.move_ok(
        ship,
        { turn: 3 },
        {
            coords: [4, 1.73],
            velocity: 5,
            heading: 3,
        },
        'turn of 3',
    );
    t.move_ok(
        ship,
        { turn: -3 },
        {
            coords: [-4, 1.73],
            velocity: 5,
            heading: 9,
        },
        'turn of -3',
    );
    t.move_ok(
        ship,
        { turn: -9 },
        {
            coords: [-4, 1.73],
            velocity: 5,
            heading: 9,
        },
        "can't turn more than limit",
    );
});

test('banking', async t => {
    const ship = {
        navigation: {
            coords: [0, 0],
            velocity: 5,
            heading: 0,
        },
        drive: { current: 6 },
    };

    const tests = [
        [
            'bank while heading at 3',
            u({ navigation: { heading: 3 } })(ship),
            { bank: -3 },
            { coords: [5, 3], heading: 3, velocity: 5 },
        ],
        ['bank of 3', ship, { bank: 3 }, { coords: [3, 5], heading: 0, velocity: 5 }],
        ['bank of -3', ship, { bank: -3 }, { coords: [-3, 5], heading: 0, velocity: 5 }],
        ["can't bank more than the limit", ship, { bank: -9 }, { coords: [-3, 5], heading: 0, velocity: 5 }],
    ];

    tests.forEach(([desc, ship, orders, expected]) => t.move_ok(ship, orders, expected, desc));
});

const with_orders = (orders: any) => u.updateIn('orders.navigation', orders);

test('complex maneuvers', async t => {
    const ship = {
        navigation: { coords: [0, 0], velocity: 5, heading: 0 },
        drive: { current: 6 },
    };

    const navigation = roundDeep(plotMovement(with_orders({ bank: -1, thrust: -1, turn: 2 })(ship)));

    t.match(navigation.trajectory, [
        { type: 'POSITION', coords: [0, 0] },
        { type: 'BANK', coords: [-1, -0], delta: [-1, -0] },
        { type: 'ROTATE', delta: 1, heading: 1 },
        { type: 'MOVE', coords: [-0, 1.73], delta: [1, 1.73] },
        { type: 'ROTATE', delta: 1, heading: 2 },
        { type: 'MOVE', coords: [1.73, 2.73], delta: [1.73, 1] },
    ]);
});

test('maneuvers', async t => {
    const ship = {
        navigation: { coords: [0, 0], velocity: 2, heading: 0 },
        drive: { current: 6 },
    };

    let course = plotMovement(with_orders({ bank: -1, thrust: -1, turn: 2 })(ship));

    t.match(course.maneuvers, {
        thrust: [-2, 3],
        bank: [-3, 3],
        turn: [-3, 3],
    });

    course = plotMovement(with_orders({ bank: 0, thrust: -1 })(ship));

    t.match(course.maneuvers, {
        thrust: [-2, 6],
        bank: [-3, 3],
        turn: [-3, 3],
    });
});

test('course is stable', async t => {
    let ship: any = {
        navigation: { coords: [0, 0], velocity: 2, heading: 0 },
        drive: { current: 6 },
    };

    let course: any = plotMovement(with_orders({ bank: -1, thrust: -1, turn: 2 })(ship));

    // don't recursively accumulate coursey cruft
    t.ok(!course.course);

    ship = u.updateIn('navigation.course', u.constant(course), ship);

    t.ok(!ship?.navigation?.course?.course);

    course = plotMovement(ship);
    t.ok(!course.course);

    ship = u.updateIn('navigation.course', u.constant(course), ship);

    t.ok(!ship?.navigation?.course?.course);
});
