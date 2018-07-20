'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _selectors = require('./middlewares/selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:battle:test');

const mainstate = {
    objects: [{ name: 'Enkidu', id: 'enkidu',
        weaponry: {
            firecons: [{ id: 1 }, { id: 2 }],
            weapons: [{ id: 1 }, { id: 2 }]
        }
    }, { name: 'Siduri', id: 'siduri' }]
};

test('set orders for enkidu', () => {

    const battle = new _index2.default(mainstate);

    battle.set_orders('enkidu', {
        navigation: {
            thrust: 3,
            turn: -1
        },
        weaponry: {
            firecons: [{
                firecon_id: 1,
                weapons: [2],
                target_id: 'siduri'
            }]
        }
    });

    let ship_orders = (0, _selectors.get_object_by_id)(battle.state, 'enkidu').orders;

    expect(ship_orders).toMatchObject({
        navigation: {
            thrust: 3,
            turn: -1
        },
        weaponry: {
            firecons: [{
                firecon_id: 1,
                weapons: [2],
                target_id: 'siduri'
            }]
        }
    });

    expect(ship_orders.done).toEqual(expect.anything());

    // setting it a second time shouldn't work
    battle.set_orders('enkidu', {
        navigation: { thrust: 0, turn: 1 }
    });

    ship_orders = (0, _selectors.get_object_by_id)(battle.state, 'enkidu').orders;
    expect(ship_orders).toMatchObject({ navigation: { thrust: 3, turn: -1 } });
});