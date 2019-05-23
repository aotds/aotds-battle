// @format

import reducer from './reducer';
import { set_orders } from './bogey/actions';
import { BogeysState } from './types';
import { clear_orders } from '../actions/phases';
import { bogey_movement, bogey_firecon_orders, bogey_weapon_orders } from '../../actions/bogey';
import { NavigationState } from './bogey/navigation/types';
import _ from 'lodash';

const BogeyReducer = require('./bogey/reducer');

test('set_orders', () => {
    let state: BogeysState = {
        enkidu: {},
        siduri: {},
    };

    state = reducer(state, set_orders('enkidu', { navigation: { thrust: 2 } }));

    expect(state).toHaveProperty('enkidu.orders.navigation.thrust', 2);
    expect(state).not.toHaveProperty('siduri.orders');
});

test('clear_orders trigger bogey_reducer', async () => {
    let state = reducer({ enkidu: { orders: { navigation: {} } } }, clear_orders());

    expect(state).not.toHaveProperty('enkidu.orders.navigation');
});

describe('bogey_movement', () => {
    const move = bogey_movement('enkidu', { foo: 1 } as any);

    const run_red = (ship: string) =>
        reducer(
            {
                [ship]: {
                    id: ship,
                },
            },
            move,
        );

    test('bad id', () => {
        expect(run_red('siduri')).toEqual({ siduri: { id: 'siduri' } });
    });

    test('good id', () => {
        expect(run_red('enkidu')).toEqual({ enkidu: { id: 'enkidu', navigation: { foo: 1 } } });
    });
});

test('bogey_firecon_orders', () => {
    const original_state = {
        enkidu: {
            id: 'enkidu',
            weaponry: {
                firecons: [{}],
            },
        },
        siduri: { id: 'siduri' },
    };

    let state = reducer(original_state, bogey_firecon_orders('enkidu', 0, { target_id: 'siduri' }));

    expect(state).toHaveProperty('enkidu.weaponry.firecons.0.target_id', 'siduri');
});

test('bogey_weapon_orders', () => {
    const original_state = {
        enkidu: {
            id: 'enkidu',
            weaponry: {
                weapons: [{}],
            },
        },
        siduri: { id: 'siduri' },
    };

    let state = reducer(original_state, bogey_weapon_orders('enkidu', 0, { firecon_id: 0 }));

    expect(state).toHaveProperty('enkidu.weaponry.weapons.0.firecon_id', 0);
});
