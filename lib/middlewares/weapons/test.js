'use strict';

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _index = require('./index');

var _actions = require('../../actions');

var _actions2 = _interopRequireDefault(_actions);

var _dice = require('../../dice');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:weapon:test');

(0, _dice.cheatmode)();

test('no damage? Nothing happen', () => {
    let store = { getState: jest.fn(), dispatch: jest.fn() };
    let next = jest.fn();

    let ship = { id: 'enkidu', structure: { hull: { current: 14, max: 14 } } };

    store.getState.mockImplementation(() => ({
        objects: [ship]
    }));

    let result = (0, _index.internal_damage)(store)(next)(_actions2.default.damage('enkidu'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(store.dispatch).not.toBeCalled();
});

test('damage? Oh my', () => {
    let store = { getState: jest.fn(), dispatch: jest.fn() };
    let next = jest.fn();

    let ship = { id: 'enkidu',
        drive: { damage_level: 0 },
        weaponry: {
            weapons: [{ id: 1 }, { id: 2, damaged: false }, { id: 3, damaged: true }],
            firecons: [{ id: 1, damaged: true }, { id: 2 }]
        },
        structure: {
            hull: { current: 14, max: 14 },
            shields: [{ id: 1 }, { id: 2 }]
        }
    };

    store.getState.mockImplementationOnce(() => ({ objects: [ship] })).mockImplementationOnce(() => ({ objects: [_updeep2.default.updateIn('structure.hull.current', 12)(ship)] }));

    (0, _dice.rig_dice)([1, 2, 90, 3, 3, 90]);

    let result = (0, _index.internal_damage)(store)(next)(_actions2.default.damage('enkidu'));
    debug(result);

    expect(result).toMatchObject([{ system: { type: 'drive' } }, { system: { type: 'firecon', id: 2 } }, { system: { type: 'weapon', id: 2 } }, { system: { type: 'shield', id: 1 } }]);

    expect(next).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledTimes(4);
});