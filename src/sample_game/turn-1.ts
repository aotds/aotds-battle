import fp from 'lodash/fp';

import { init_game } from '../dux/game/actions';
import battle_dux from '../dux';

import initial_state from './initial_state';

export const actions = [
    battle_dux.actions.init_game(initial_state),
    battle_dux.actions.set_orders( { bogey_id: 'enkidu', orders: {
        navigation: { thrust: 1, turn: 1, bank: 1 },
    }}),
    battle_dux.actions.try_play_turn(),
    battle_dux.actions.set_orders({bogey_id:'siduri', orders: {
        navigation: { thrust: 1 },
    }}),
    battle_dux.actions.try_play_turn(),
];

export const tests = state => {

    expect(state).toHaveProperty('game.name', 'gemini');

    expect(state.log).not.toHaveLength(0);
    console.log(state);

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
