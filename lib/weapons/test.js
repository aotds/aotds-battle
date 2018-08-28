"use strict";

var _index = require("./index");

var _dice = require("../dice");

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dice.cheatmode)();

const debug = require('debug')('aotds:weapons');

describe('relative_coords', () => {
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 1
    }
  };
  let target = {
    navigation: {
      coords: [0, 10],
      heading: 5
    }
  };
  [{
    coords: [0, 10],
    e: {
      angle: 0,
      bearing: -1,
      target_angle: 6,
      target_bearing: 1
    }
  }, {
    coords: [0, -10],
    e: {
      angle: 6,
      bearing: 5,
      target_angle: 0,
      target_bearing: -5
    }
  }, {
    coords: [10, 0],
    e: {
      angle: 3,
      bearing: 2,
      target_angle: -3,
      target_bearing: 4
    }
  }].forEach(({
    coords,
    e
  }) => {
    test(JSON.stringify(coords), () => {
      expect((0, _index.relative_coords)(attacker, _updeep2.default.updateIn('navigation.coords', coords)(target))).toMatchObject(e);
    });
  });
});
test('basic', () => {
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 0
    }
  };
  let target = {
    navigation: {
      coords: [10, 1],
      heading: 6
    }
  };
  let weapon = {};
  (0, _dice.rig_dice)([6, 6, 1]);
  let result = (0, _index.fire_weapon)(attacker, target, {
    type: 'beam',
    class: 1,
    arcs: ['FS']
  });
  expect(result).toMatchObject({
    damage_dice: [6],
    penetrating_damage_dice: [6, 1]
  });
});
test('bug w/ Front', () => {
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 0
    }
  };
  let target = {
    navigation: {
      coords: [1, 10],
      heading: 6
    }
  };
  let weapon = {};
  (0, _dice.rig_dice)([6, 6, 1]);
  let result = (0, _index.fire_weapon)(attacker, target, {
    type: 'beam',
    class: 1,
    arcs: ['F']
  });
  expect(result).toMatchObject({
    damage_dice: [6],
    penetrating_damage_dice: [6, 1]
  });
});
test('beam-2', () => {
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 0
    }
  };
  let target = {
    navigation: {
      coords: [0, 10],
      heading: 6
    }
  };
  let weapon = {};
  (0, _dice.rig_dice)([6, 6, 1, 6, 2]);
  let result = (0, _index.fire_weapon)(attacker, target, {
    type: 'beam',
    class: 2,
    arcs: ['F']
  });
  expect(result).toMatchObject({
    damage_dice: [6, 6],
    penetrating_damage_dice: [1, 6, 2]
  });
});
describe('target bearing', () => {
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 0
    }
  };
  let target = {
    navigation: {
      coords: [0, 10],
      heading: 0
    }
  };
  let weapon = {
    type: 'beam',
    class: 2,
    arcs: ['F']
  };

  _fp2.default.times(Number)(12).forEach(heading => test(`heading ${heading}`, () => {
    (0, _dice.rig_dice)(_fp2.default.times(_fp2.default.constant(1))(6));
    let result = (0, _index.fire_weapon)(attacker, _updeep2.default.updateIn('navigation.heading', heading)(target), weapon);
    let type = [0, 1, 11].some(x => heading === x) ? 'penetrating_damage_dice' : 'damage_dice';
    expect(result).toMatchObject({
      [type]: [1, 1]
    });
  }));
});
describe("aft", () => {
  (0, _dice.rig_dice)([1, 1]);
  let attacker = {
    navigation: {
      coords: [0, 0],
      heading: 6
    },
    drive: {}
  };
  let target = {
    navigation: {
      coords: [0, 10],
      heading: 6
    }
  };
  let weapon = {
    type: 'beam',
    class: 2,
    arcs: ['A']
  };
  test('no thrust used? fire away', () => {
    let result = (0, _index.fire_weapon)(attacker, target, weapon);
    expect(result).toMatchObject({
      damage_dice: [1, 1]
    });
  });
  test('thrust used? no fire', () => {
    let result = (0, _index.fire_weapon)(_updeep2.default.updateIn('drive.thrust_used', 2)(attacker), target, weapon);
    expect(result).toHaveProperty('drive_interference', true);
    expect(result).not.toHaveProperty('damage_dice');
  });
});
test('no target', () => {
  let result = (0, _index.fire_weapon)({}, null, {});
  expect(result).toHaveProperty('aborted');
});
test('no weapon', () => {
  let result = (0, _index.fire_weapon)({}, {}, null);
  expect(result).toHaveProperty('aborted');
});