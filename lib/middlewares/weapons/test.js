"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require("../../actions");

var _dice = require("../../dice");

var _2 = require("./");

var _index = require("./index");

var _selectors = require("../selectors");

var selectors = _interopRequireWildcard(_selectors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:sagas:weapon:test');

(0, _dice.cheatmode)();
test('no damage? Nothing happen internally', () => {
  let getState = jest.fn();
  let dispatch = jest.fn();
  let next = jest.fn();
  getState.mockReturnValue({
    bogeys: {
      enkidu: {
        id: 'enkidu',
        structure: {
          hull: {
            max: 14,
            current: 14
          }
        }
      }
    }
  });
  (0, _index.internal_damage_check)({
    getState,
    dispatch
  })(next)(_actions.actions.damage('enkidu'));
  expect(next).toHaveBeenCalled();
  expect(dispatch).not.toHaveBeenCalled();
});

const mock_mw_args = () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn()
  },
  next: jest.fn()
});

test('internal damage? Oh my', () => {
  var _mocked$store$dispatc;

  let mocked = mock_mw_args();
  let ship = {
    id: 'enkidu',
    drive: {
      damage_level: 0
    },
    weaponry: {
      weapons: {
        1: {
          id: 1
        },
        2: {
          id: 2,
          damaged: false
        },
        3: {
          id: 3,
          damaged: true
        }
      },
      firecons: {
        1: {
          id: 1,
          damaged: true
        },
        2: {
          id: 2
        }
      }
    },
    structure: {
      hull: {
        current: 14,
        max: 14
      },
      shields: {
        1: {
          id: 1
        },
        2: {
          id: 2
        }
      }
    }
  };
  (0, _dice.rig_dice)([1, 2, 90, 3, 3, 90]);
  selectors.get_bogey = jest.fn();
  selectors.get_bogey.mockReturnValueOnce(() => ship);
  selectors.get_bogey.mockReturnValueOnce(() => _updeep2.default.updateIn('structure.hull.current', 12)(ship));
  mocked.store.getState.mockReturnValueOnce({});
  (0, _index.internal_damage_check)(mocked.store, mocked.next, _actions.actions.damage('enkidu'));
  expect(mocked.store.getState).toHaveBeenCalled();
  expect((_mocked$store$dispatc = mocked.store.dispatch.mock.calls, _fp2.default.flatten(_mocked$store$dispatc))).toMatchObject([{
    type: 'drive'
  }, {
    type: 'firecon',
    id: 2
  }, {
    type: 'weapon',
    id: 2
  }, {
    type: 'shield',
    id: 1
  }].map(system => ({
    type: 'INTERNAL_DAMAGE',
    system
  })));
});
test('firecon_orders_phase', () => {
  var _ref, _mocked$store$dispatc2;

  let mocked = mock_mw_args();
  selectors.select = jest.fn((_ref = function (a, b) {
    return [{
      id: 'enkidu',
      orders: {
        firecons: {
          1: {
            firecon_id: 1,
            target_id: 'siduri'
          }
        }
      }
    }, {
      id: 'siduri',
      orders: {
        firecons: {
          2: {
            firecon_id: 2,
            target_id: 'enkidu'
          }
        }
      }
    }, {
      id: 'gilgamesh'
    }];
  }, _lodash2.default.curry(_ref)));
  (0, _2.firecon_orders_phase)(mocked.store)(mocked.next)(_actions.actions.firecon_orders_phase());
  expect(mocked.store.getState).toHaveBeenCalled();
  expect(selectors.select).toHaveBeenCalled();
  expect(mocked.store.dispatch).toHaveBeenCalledTimes(2);
  expect((_mocked$store$dispatc2 = mocked.store.dispatch.mock.calls, _lodash2.default.flatten(_mocked$store$dispatc2))).toMatchObject([_actions.actions.execute_firecon_orders('enkidu', 1, {
    target_id: 'siduri'
  }), _actions.actions.execute_firecon_orders('siduri', 2, {
    target_id: 'enkidu'
  })]);
});
test('bogey_firing_actions', () => {
  let ship = {
    id: 'enkidu',
    weaponry: {
      firecons: {
        1: {
          id: 1,
          target_id: 'siduri'
        }
      },
      weapons: {
        1: {
          id: 1,
          firecon_id: 1
        },
        2: {
          id: 2,
          firecon_id: 1
        },
        3: {
          id: 3
        }
      }
    }
  };
  let actions = (0, _2.bogey_firing_actions)(ship);
  expect(actions).toMatchObject([(0, _actions.bogey_fire_weapon)('enkidu', 'siduri', 1), (0, _actions.bogey_fire_weapon)('enkidu', 'siduri', 2)]);
});