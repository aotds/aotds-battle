import fp from 'lodash/fp';

import { dux } from '../dux';

import initial from './initial';

export const actions = [
    dux.actions.initGame(initial),
    dux.actions.setOrders({
        bogeyId: 'enkidu',
        orders: {
            navigation: { thrust: 1, turn: 1, bank: 1 },
        },
    }),
    dux.actions.tryPlayTurn(),
    dux.actions.setOrders({
        bogeyId: 'siduri',
        orders: {
            navigation: { thrust: 1 },
        },
    }),
    dux.actions.tryPlayTurn(),
];

/*

export const tests = state => {
    expect(state).toHaveProperty('game.name', 'gemini');

    expect(state.log).not.toHaveLength(0);

    expect(state).toHaveProperty('game.turn', 1);

    const { enkidu, siduri } = fp.keyBy('id', state.bogeys);

    expect(enkidu.navigation).toMatchObject({
        heading: 1,
        velocity: 1,
        coords: [1.5, 0.87],
    });

    expect(siduri.navigation).toMatchObject({
        heading: 6,
        velocity: 1,
        coords: [10, 9],
    });

    expect(enkidu.weaponry.firecons).toHaveLength(1);
    expect(siduri.weaponry.firecons).toHaveLength(0);
};
*/
