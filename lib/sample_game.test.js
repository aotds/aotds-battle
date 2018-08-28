"use strict";

var _jestMatcherDeepCloseTo = require("jest-matcher-deep-close-to");

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _selectors = require("./middlewares/selectors");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _dice = require("./dice");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

expect.extend({
  toBeDeepCloseTo: _jestMatcherDeepCloseTo.toBeDeepCloseTo,
  toMatchCloseTo: _jestMatcherDeepCloseTo.toMatchCloseTo
});

const debug = require('debug')('aotds:battle:test');

debug.inspectOpts.depth = 99;
Date.prototype.toISOString = jest.fn(() => '2018-01-01');
let turns = [() => Promise.resolve(new _index2.default())];

function wait_forever() {
  return new Promise((a, r) => {});
}

turns[1] = battle => {
  var _ref, _ref2, _battle$state, _ref3, _battle$state2, _ref4, _battle$state3;

  const initial_state = require("./sample_game/initial_state").default;

  battle.dispatch_action('init_game', initial_state);
  expect(battle.state).toMatchObject({
    game: {
      name: 'gemini',
      turn: 0
    },
    bogeys: {
      enkidu: {
        name: 'Enkidu'
      },
      siduri: {
        name: 'Siduri'
      }
    }
  });
  let enkidu_orders = {
    thrust: 1,
    turn: 1,
    bank: 1
  };
  battle.dispatch_action('set_orders', 'enkidu', {
    navigation: enkidu_orders
  });
  battle.dispatch_action('play_turn'); // not yet...

  expect(battle.state).toHaveProperty('game.turn', 0);
  battle.dispatch_action('set_orders', 'siduri', {
    navigation: {
      thrust: 1
    }
  });
  expect(battle.state.bogeys.enkidu.orders.navigation).toMatchObject(enkidu_orders); // let's check the log

  expect(battle.state.log.map(l => l.type).filter(t => !/@@/.test(t))).toEqual(['INIT_GAME', 'SET_ORDERS', 'SET_ORDERS']);
  battle.dispatch_action('play_turn');
  expect(battle.state.game).toMatchObject({
    turn: 1
  });
  expect(battle.state).toMatchSnapshot(); // orders cleared out 

  let still_with_orders = (_ref = (_ref2 = (_battle$state = battle.state, _fp2.default.get('bogeys')(_battle$state)), _fp2.default.values(_ref2)), _fp2.default.filter('orders')(_ref));
  expect(still_with_orders).toEqual([]); // Enkidu still have a drive section

  expect(battle.state.bogeys.enkidu).toHaveProperty('drive.current');

  const expect_close = val => val.map(v => x => expect(x).toBeCloseTo(v)); // ships have moved 


  expect((_ref3 = (_battle$state2 = battle.state, (0, _selectors.get_bogey)('enkidu')(_battle$state2)), _fp2.default.get('navigation')(_ref3))).toMatchCloseTo({
    heading: 1,
    velocity: 1,
    coords: [1.5, 0.9]
  }, 1);
  expect((_ref4 = (_battle$state3 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state3)), _fp2.default.get('navigation')(_ref4))).toMatchCloseTo({
    heading: 6,
    velocity: 1,
    coords: [10, 9]
  }, 1);
  return battle;
};

turns[2] = function turn2(battle) {
  battle.dispatch_action('set_orders', 'enkidu', {
    firecons: {
      1: {
        target_id: 'siduri'
      }
    },
    weapons: {
      1: {
        firecon_id: 1
      },
      2: {
        firecon_id: 1
      },
      3: {
        firecon_id: 1
      }
    }
  });
  (0, _dice.rig_dice)([6, 5, 3, 3, 90, 90]);
  battle.dispatch_action('play_turn', true);
  expect(battle.state.bogeys.enkidu.weaponry.firecons[1]).toMatchObject({
    id: 1,
    target_id: 'siduri'
  });

  const enkidu = () => {
    var _battle$state4;

    return _battle$state4 = battle.state, (0, _selectors.get_bogey)('enkidu')(_battle$state4);
  };

  const siduri = () => {
    var _battle$state5;

    return _battle$state5 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state5);
  };

  expect(enkidu()).toHaveProperty('weaponry.weapons.1.firecon_id', 1);
  let log = battle.state.log;
  log = log.splice(_lodash2.default.findLastIndex(log, {
    type: 'PLAY_TURN'
  }));
  expect(_lodash2.default.filter(log, {
    type: 'DAMAGE',
    bogey_id: 'siduri',
    penetrating: true,
    dice: [3]
  })).toHaveLength(1);
  expect(siduri().structure.shields).toMatchObject({
    1: {
      level: 1
    },
    2: {
      level: 2
    }
  });
  expect(_lodash2.default.filter(log, {
    type: 'INTERNAL_DAMAGE'
  }).length).toBeGreaterThan(0);
  expect(siduri()).toMatchObject({
    structure: {
      hull: {
        current: 3,
        max: 4
      },
      armor: {
        current: 3,
        max: 4
      }
    },
    drive: {
      current: 3,
      damage_level: 1,
      rating: 6
    }
  }); // only siduri gets damage

  expect(enkidu().structure).toMatchObject({
    hull: {
      current: 4
    },
    armor: {
      current: 4
    }
  });
  return battle;
};

turns[3] = function turn3(battle) {
  // turn 3, we stop and fire like mad
  (0, _dice.rig_dice)([4, 1]);

  const enkidu = () => {
    var _battle$state6;

    return _battle$state6 = battle.state, (0, _selectors.get_bogey)('enkidu')(_battle$state6);
  };

  const siduri = () => {
    var _battle$state7;

    return _battle$state7 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state7);
  };

  ['enkidu', 'siduri'].forEach(ship => battle.dispatch_action('set_orders', ship, {
    navigation: {
      thrust: -1
    }
  }));
  battle.dispatch_action('play_turn', true);
  [enkidu(), siduri()].forEach(ship => expect(ship).toHaveProperty('navigation.velocity', 0));
  expect(siduri().drive).toMatchObject({
    damage_level: 1,
    current: 3,
    thrust_used: 1
  });
  return battle;
};

turns[4] = function turn4(battle) {
  // oh my, internal damages on the drive!
  (0, _dice.rig_dice)([6, 1, 6, 1, 5, 90, 90]);
  battle.dispatch_action('play_turn', true);

  const siduri = () => {
    var _battle$state8;

    return _battle$state8 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state8);
  };

  expect(siduri().structure).toMatchObject({
    hull: {
      current: 1,
      max: 4
    },
    armor: {
      current: 2,
      max: 4
    }
  });
  expect(siduri().drive).toMatchObject({
    damage_level: 2,
    current: 0
  });
  return battle;
};

turns[5] = function turn5(battle) {
  var _ref5, _battle$state9;

  (0, _dice.rig_dice)([5, 3]);
  battle.dispatch_action('play_turn', true);
  expect((_ref5 = (_battle$state9 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state9)), _fp2.default.get('structure')(_ref5))).toMatchObject({
    hull: {
      current: 1,
      max: 4
    },
    armor: {
      current: 1,
      max: 4
    }
  });
  return battle;
};

turns[6] = function turn6(battle) {
  var _battle$state10;

  (0, _dice.rig_dice)([4, 6, 2]);
  battle.dispatch_action('play_turn', true);
  let siduri = (_battle$state10 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state10));
  expect(siduri.structure).toMatchObject({
    hull: {
      current: 1,
      max: 4
    },
    armor: {
      current: 0,
      max: 4
    }
  });
  return battle;
};

turns[7] = function turn7(battle) {
  var _battle$state11;

  (0, _dice.rig_dice)([5, 2, 90, 90, 90]);
  battle.dispatch_action('play_turn', true);
  let siduri = (_battle$state11 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state11));
  expect(siduri.structure).toMatchObject({
    hull: {
      current: 0,
      max: 4
    },
    armor: {
      current: 0,
      max: 4
    },
    destroyed: true
  });
  return battle;
};

turns[8] = function turn8(battle) {
  var _battle$state12, _battle$state13;

  battle.dispatch_action('play_turn', true);
  let siduri = (_battle$state12 = battle.state, (0, _selectors.get_bogey)('siduri')(_battle$state12));
  let enkidu = (_battle$state13 = battle.state, (0, _selectors.get_bogey)('enkidu')(_battle$state13)); // siduri is gone

  expect(siduri).toBeUndefined();
  expect(enkidu).toBeDefined();
  expect(battle.state.log.map(l => l.type)).not.toContain('FIRE_WEAPON');
  return battle;
}; // turns.push( 
//     async function(battle) { return await wait_forever() }
// )
// jest.setTimeout(30000000);


let previous = Promise.resolve();
turns = turns.map(t => {
  let p = previous.then(t);
  previous = p;
  return () => p;
});
turns.forEach((t, i) => {
  test(`turn ${i}`, t);
});