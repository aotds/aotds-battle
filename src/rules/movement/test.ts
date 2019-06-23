import _ from "lodash";
import u from "updeep";

import { plot_movement, move_thrust, move_rotate } from "./index";
import { NavigationState, Coords } from "../../store/bogeys/bogey/navigation/types";
import { BogeyState } from "../../store/bogeys/bogey/types";
import { NavOrdersState } from "../../store/bogeys/bogey/orders/types";

const debug = require('debug')('aotds:rules:test');


test("move_thrust", () => {
  let ship: NavigationState = { coords: [0, 0], heading: 1, velocity: 0 };

  let cases: [ number, Coords ][] = [[0, [0, 0]], [1, [0.5, 0.87]], [10, [5, 8.66]]];

  cases.forEach(([thrust, result]: [ number, Coords] ) => {
    (expect(
      move_thrust(ship, thrust)
      //).toHaveProperty( 'coords', result )
    ) as any ).toMatchObject( { coords: result } );
  });
});

test("move_rotate", () => {
  let ship = { coords: [0, 0], heading: 0, velocity: 0 } as NavigationState;

  [[0, 0], [1, 1], [-1, 11], [12, 0]].forEach(([turn, heading]) => {
    expect(move_rotate(ship, turn)).toHaveProperty("heading", heading);
  });
});

test("simple movements", () => {
  let angle: { [angle: string ]: Coords } = {
    0: [0, 10],
    1: [5, 8.7],
    2: [8.7, 5],
    3: [10, 0],
    6: [0, -10],
    9: [-10, -0],
    11: [-5, 8.7]
  };

  let ship = { navigation: { coords: [0, 0], velocity: 10, heading: 0 } };

  for (let a in angle) {
    ship.navigation.heading = +a;
    let movement = plot_movement(ship as BogeyState);
    (expect( round_deep(movement)) as any ).toMatchObject(
      {
        coords: angle[a],
        heading: +a
      },
      1
    );
  }
});

function round_deep(thingy:any) {
    if( _.isObject(thingy) ) {
        return u.map( round_deep, thingy );
    }

    if( !_.isNumber(thingy) ) return thingy;

    return _.round(thingy,1);
}

const move_ok = (ship: BogeyState, orders: NavOrdersState, expected: object) => () => {
  let navigation = plot_movement( u.updateIn('orders.navigation',orders)(ship) );
  (expect(round_deep(navigation)) as any).toMatchObject(expected);
};

describe("change of speed", () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      heading: 0,
      velocity: 10
    },
    drive: { rating: 6, current: 6 }
  } as BogeyState;

  const move_ship_ok = _.partial( move_ok, ship );

  test(
    "accelerate within engine capacity",
    move_ship_ok({ thrust: 6 }, { velocity: 16, coords: [0, 16] })
  );

  test(
    "accelerate more than engine capacity",
    move_ok(ship as BogeyState, { thrust: 16 }, { velocity: 16, coords: [0, 16] })
  );

  test(
    "decelerate",
    move_ok(ship as BogeyState, { thrust: -6 }, { velocity: 4, coords: [0, 4] })
  );

  test(
    "decelerate to min of zero",
    move_ok(
      u({ navigation: { velocity: 2 } })(ship),
      { thrust: -6 },
      { velocity: 0, coords: [0, 0] }
    )
  );
});

describe("turning", () => {
  let ship = {
    navigation: { coords: [0, 0], velocity: 5, heading: 0 },
    drive: { current: 6 }
  };

  test(
    "turn of 3",
    move_ok(
      ship as BogeyState,
      { turn: 3 },
      {
        coords: [4, 1.7],
        velocity: 5,
        heading: 3
      }
    )
  );

  test(
    "turn of -3",
    move_ok(
      ship as BogeyState,
      { turn: -3 },
      {
        coords: [-4, 1.7],
        velocity: 5,
        heading: 9
      }
    )
  );

  test(
    "can't turn more than limit",
    move_ok(
      ship as BogeyState,
      { turn: -9 },
      {
        heading: 9
      }
    )
  );
});

describe("banking", () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 5,
      heading: 0
    },
    drive: { current: 6 }
  };

  let tests = [
    [
      "bank while heading at 3",
      u({ navigation: { heading: 3 } })(ship),
      { bank: -3 },
      { coords: [5, 3], heading: 3, velocity: 5 }
    ],
    [
      "bank of 3",
      ship,
      { bank: 3 },
      { coords: [3, 5], heading: 0, velocity: 5 }
    ],
    [
      "bank of -3",
      ship,
      { bank: -3 },
      { coords: [-3, 5], heading: 0, velocity: 5 }
    ],
    [
      "can't bank more than the limit",
      ship,
      { bank: -9 },
      { coords: [-3, 5], heading: 0, velocity: 5 }
    ]
  ];

  tests.forEach(([desc, ship, orders, expected]) =>
    test(desc, move_ok(ship, orders, expected))
  );
});

const with_orders = ( orders: NavOrdersState ) => u.updateIn( 'orders.navigation', orders );

test("complex manoeuvers", () => {
  let ship = {
    navigation: { coords: [0, 0], velocity: 5, heading: 0 },
    drive: { current: 6 }
  };

  let navigation = plot_movement( with_orders({ bank: -1, thrust: -1, turn: 2 })(ship) );

  ( expect(round_deep(navigation.trajectory)) as any ).toMatchObject(
    [
      { type: "POSITION", coords: [0, 0] },
      { type: "BANK", coords: [-1, -0], delta: [-1, -0] },
      { type: "ROTATE", delta: 1, heading: 1 },
      { type: "MOVE", coords: [-0, 1.7], delta: [1, 1.7] },
      { type: "ROTATE", delta: 1, heading: 2 },
      { type: "MOVE", coords: [1.7, 2.7], delta: [1.7, 1] }
    ],
    1
  );

  move_ok(
    ship as BogeyState,
    { bank: -1, thrust: -1, turn: 2 },
    {
      velocity: 4,
      heading: 2,
      coords: [1.7, 2.7]
    }
  )();
});

test("maneuvers", () => {
  let ship = {
    navigation: { coords: [0, 0], velocity: 2, heading: 0 },
    drive: { current: 6 }
  } as BogeyState;

  let course = plot_movement( with_orders({ bank: -1, thrust: -1, turn: 2 })(ship));

  expect(course.maneuvers).toMatchObject({
    thrust: [-2, 3],
    bank: [-3, 3],
    turn: [-3, 3]
  });

  course = plot_movement(with_orders({ bank: 0, thrust: -1 })(ship));

  expect(course.maneuvers).toMatchObject({
    thrust: [-2, 6],
    bank: [-3, 3],
    turn: [-3, 3]
  });
});

test( "course is stable", () => {

  let ship = {
    navigation: { coords: [0, 0], velocity: 2, heading: 0 },
    drive: { current: 6 },
  } as BogeyState;

  let course = plot_movement( with_orders({ bank: -1, thrust: -1, turn: 2 })(ship));

  // don't recursively accumulate coursey cruft
  expect(course).not.toHaveProperty('course');

  ship = u.updateIn( 'navigation.course', u.constant( course), ship );

  expect(ship).not.toHaveProperty('navigation.course.course');

  course = plot_movement(ship);
  expect(course).not.toHaveProperty('course');

  ship = u.updateIn( 'navigation.course', u.constant( course), ship );

  expect(ship).not.toHaveProperty('navigation.course.course');

});
