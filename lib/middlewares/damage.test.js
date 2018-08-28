'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _weapons = require('./weapons');

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:test');

let mock_siduri = {};
jest.mock('./selectors', () => {
    return {
        'get_object_by_id': () => mock_siduri
    };
});

[['no shields', [], 4], ['shields level 1', [{ level: 1 }], 3], ['shields level 2', [{ level: 2 }], 2]].forEach(([desc, shields, damage]) => test(desc, () => {
    let store = { getState: jest.fn() };
    let next = jest.fn();

    mock_siduri.structure = { shields };

    let action = _actions2.default.damage('siduri', 'beam', [1, 2, 3, 4, 5, 6]);

    (0, _weapons.calculate_damage)(store)(next)(action);

    expect(next).toHaveBeenCalledWith(_extends({}, action, { damage }));
}));