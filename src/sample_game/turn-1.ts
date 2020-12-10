import fp from 'lodash/fp';

import battle_dux from '../dux';
import initial_state from './initial_state';

const debug = require('debug')('aotds');

export const actions = [
    battle_dux.actions.init_game(initial_state),
    battle_dux.actions.set_orders({
        bogey_id: 'enkidu',
        orders: {
            navigation: { thrust: 1, turn: 1, bank: 1 },
        },
    }),
    battle_dux.actions.try_play_turn(),
    battle_dux.actions.set_orders({
        bogey_id: 'siduri',
        orders: {
            navigation: { thrust: 1 },
        },
    }),
    battle_dux.actions.try_play_turn(),
];

export const tests = state => {
    expect(state).toHaveProperty('game.name', 'gemini');

    expect(state.log).not.toHaveLength(0);

    expect(state).toHaveProperty('game.turn', 1);

    expect(state.log).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                type: 'movement_phase',
            }),
        ]),
    );
};
