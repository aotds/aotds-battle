"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _index = require("./index");

var _jestMatcherDeepCloseTo = require("jest-matcher-deep-close-to");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:movements:test');

expect.extend({
  toMatchCloseTo: _jestMatcherDeepCloseTo.toMatchCloseTo,
  toBeDeepCloseTo: _jestMatcherDeepCloseTo.toBeDeepCloseTo
});
test('move_thrust', () => {
  let ship = {
    coords: [0, 0],
    heading: 1,
    trajectory: [],
    velocity: 0
  };
  [[0, [0, 0]], [1, [0.5, 0.9]], [10, [5, 8.7]]].forEach(([thrust, result]) => {
    expect((0, _index.move_thrust)(ship, thrust).coords //).toHaveProperty( 'coords', result )
    ).toBeDeepCloseTo(result, 1);
  });
});
test('move_rotate', () => {
  let ship = {
    coords: [0, 0],
    heading: 0,
    trajectory: [],
    velocity: 0
  };
  [[0, 0], [1, 1], [-1, 11], [12, 0]].forEach(([turn, heading]) => {
    expect((0, _index.move_rotate)(ship, turn)).toHaveProperty('heading', heading);
  });
});
test('simple movements', () => {
  let angle = {
    0: [0, 10],
    1: [5, 8.7],
    2: [8.7, 5],
    3: [10, 0],
    6: [0, -10],
    9: [-10, 0],
    11: [-5, 8.7]
  };
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 10,
      heading: 0
    }
  };

  for (let a in angle) {
    ship.navigation.heading = +a;
    let movement = (0, _index.plot_movement)(ship);
    expect(movement).toMatchCloseTo({
      coords: angle[a],
      heading: +a
    }, 1);
  }
});

const move_ok = (ship, orders, expected) => () => {
  let navigation = (0, _index.plot_movement)(ship, orders);
  expect(navigation).toMatchCloseTo(expected, 1);
};

describe('change of speed', () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      heading: 0,
      velocity: 10
    },
    drive: {
      current: 6
    }
  };
  test('accelerate within engine capacity', move_ok(ship, {
    thrust: 6
  }, {
    velocity: 16,
    coords: [0, 16]
  }));
  test('accelerate more than engine capacity', move_ok(ship, {
    thrust: 16
  }, {
    velocity: 16,
    coords: [0, 16]
  }));
  test('decelerate', move_ok(ship, {
    thrust: -6
  }, {
    velocity: 4,
    coords: [0, 4]
  }));
  test('decelerate to min of zero', move_ok((0, _updeep2.default)({
    navigation: {
      velocity: 2
    }
  })(ship), {
    thrust: -6
  }, {
    velocity: 0,
    coords: [0, 0]
  }));
});
describe('turning', () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 5,
      heading: 0
    },
    drive: {
      current: 6
    }
  };
  test('turn of 3', move_ok(ship, {
    turn: 3
  }, {
    coords: [4, 1.73],
    velocity: 5,
    heading: 3
  }));
  test("turn of -3", move_ok(ship, {
    turn: -3
  }, {
    coords: [-4, 1.7],
    velocity: 5,
    heading: 9
  }));
  test("can't turn more than limit", move_ok(ship, {
    turn: -9
  }, {
    heading: 9
  }));
});
describe('banking', () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 5,
      heading: 0
    },
    drive: {
      current: 6
    }
  };
  let tests = [['bank while heading at 3', (0, _updeep2.default)({
    navigation: {
      heading: 3
    }
  })(ship), {
    bank: -3
  }, {
    coords: [5, 3],
    heading: 3,
    velocity: 5
  }], ['bank of 3', ship, {
    bank: 3
  }, {
    coords: [3, 5],
    heading: 0,
    velocity: 5
  }], ['bank of -3', ship, {
    bank: -3
  }, {
    coords: [-3, 5],
    heading: 0,
    velocity: 5
  }], ["can't bank more than the limit", ship, {
    bank: -9
  }, {
    coords: [-3, 5],
    heading: 0,
    velocity: 5
  }]];
  tests.forEach(([desc, ship, orders, expected]) => test(desc, move_ok(ship, orders, expected)));
});
test('complex manoeuvers', () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 5,
      heading: 0
    },
    drive: {
      current: 6
    }
  };
  let navigation = (0, _index.plot_movement)(ship, {
    bank: -1,
    thrust: -1,
    turn: 2
  });
  expect(navigation.trajectory).toBeDeepCloseTo([{
    type: "POSITION",
    coords: [0, 0]
  }, {
    type: "BANK",
    coords: [-1, 0],
    delta: [-1, 0]
  }, {
    type: "ROTATE",
    delta: 1,
    heading: 1
  }, {
    type: "MOVE",
    coords: [0, 1.7],
    delta: [1, 1.7]
  }, {
    type: "ROTATE",
    delta: 1,
    heading: 2
  }, {
    type: "MOVE",
    coords: [1.7, 2.7],
    delta: [1.7, 1]
  }], 1);
  move_ok(ship, {
    bank: -1,
    thrust: -1,
    turn: 2
  }, {
    velocity: 4,
    heading: 2,
    coords: [1.73, 2.73]
  })();
});
test('maneuvers', () => {
  let ship = {
    navigation: {
      coords: [0, 0],
      velocity: 2,
      heading: 0
    },
    drive: {
      current: 6
    }
  };
  let course = (0, _index.plot_movement)(ship, {
    bank: -1,
    thrust: -1,
    turn: 2
  });
  expect(course.maneuvers).toMatchObject({
    thrust: [-2, 3],
    bank: [-3, 3],
    turn: [-3, 3]
  });
  course = (0, _index.plot_movement)(ship, {
    bank: 0,
    thrust: -1
  });
  expect(course.maneuvers).toMatchObject({
    thrust: [-2, 6],
    bank: [-3, 3],
    turn: [-3, 3]
  });
});