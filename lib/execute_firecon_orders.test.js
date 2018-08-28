'use strict';

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require('./middlewares/selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:battle:test');

test('basic', () => {
    let state = {
        objects: [{ id: 'siduri' }, {
            id: 'enkidu',
            weaponry: {
                firecons: [{ id: 1 }, { id: 2, weapons: [2, 3] }],
                weapons: [{ id: 1 }, { id: 2 }, { id: 3 }]
            },
            orders: {
                firecons: [{ firecon_id: 1, weapons: [1, 2], target_id: 'siduri' }]
            }
        }]
    };

    let battle = new _index2.default(state);

    battle.dispatch(_actions2.default.execute_firecon_orders());

    expect(battle.state.log.map(l => l.type)).toEqual(['EXECUTE_FIRECON_ORDERS', 'EXECUTE_SHIP_FIRECON_ORDERS']);

    let enkidu = (0, _selectors.get_object_by_id)(battle.state, 'enkidu');

    expect(enkidu.weaponry).toMatchObject({
        firecons: [{ id: 1, target_id: 'siduri', weapons: [1, 2] }, { id: 2, weapons: [3] }]
    });

    debug(battle.state.log);
});