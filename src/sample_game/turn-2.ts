import fp from 'lodash/fp';

import battle_dux from '../dux';

const debug = require('debug')('aotds');

export const dice = [[6, 5], [3], [1], [1], [90]];

export const actions = [
    battle_dux.actions.set_orders({
        bogey_id: 'enkidu',
        orders: {
            firecons: [{ firecon_id: 1, target_id: 'siduri' }],
            weapons: [
                { weapon_id: 1, firecon_id: 1 },
                { weapon_id: 2, firecon_id: 1 },
                { weapon_id: 3, firecon_id: 1 },
            ],
        },
    }),
    battle_dux.actions.play_turn(),
];

export const tests = state => {
    const { enkidu, siduri } = fp.keyBy('id', state.bogeys);

    enkidu.weaponry.weapons.forEach(weapon => {
        expect(weapon).toHaveProperty('firecon_id', 1);
    });

    debug(state.log);

    expect(
        state.log.find(({ type, payload }) => type === 'weapon_fire_outcome' && payload?.outcome?.damage_dice[0] === 6),
    ).toMatchObject({
        type: 'weapon_fire_outcome',
        payload: {
            outcome: {
                damage_dice: [6, 5],
                penetrating_damage_dice: [3],
            },
        },
    });

    // siduri got hit
    expect(siduri).toHaveProperty('structure.hull.current', 3);

    // not enkidu
    expect(enkidu).toHaveProperty('structure.hull.current', 4);
};
