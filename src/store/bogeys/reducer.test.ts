// @format

import reducer from './reducer';
import { set_orders } from './bogey/actions';
import { BogeysState } from './types';
import { clear_orders } from '../actions/phases';
import { bogey_movement } from '../../actions/bogey';
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
    const bogey = jest.fn();

    beforeAll(() => {
        BogeyReducer.bogey_upreducer = jest.fn(() => bogey);
    });

    beforeEach(() => {
        bogey.mockClear();
    });

    afterAll(() => {
        BogeyReducer.bogey_upreducer.mockClear();
    });

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
        run_red('siduri');

        expect(bogey).not.toHaveBeenCalled();
        bogey.mockClear();
    });

    test('good id', () => {
        bogey.mockClear();
        run_red('enkidu');

        expect(bogey).toHaveBeenCalled();
        bogey.mockClear();
    });
});
