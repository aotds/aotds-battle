import fp from 'lodash/fp';

import dux, { inflate } from '.';

const sample_bogey = inflate({
    orders: {
        firecons: [
            {
                firecon_id: 2,
                target_id: 'siduri',
            },
        ],
        weapons: [{ weapon_id: 2, firecon_id: 2 }],
    },
    weaponry: { firecons: 2, weapons: [{}, {}] },
});

test('firecon_orders_phase', () => {
    const result = dux.reducer(sample_bogey, dux.actions.firecon_orders_phase);

    expect(fp.find({ id: 2 }, result.weaponry.firecons)).toHaveProperty('target_id', 'siduri');
});

test('weapon_orders_phase', () => {
    const result = dux.reducer(sample_bogey, dux.actions.weapon_orders_phase);

    expect(fp.find({ id: 2 }, result.weaponry.weapons)).toHaveProperty('firecon_id', 2);
});

test('inflate bogey', () => {
    const ship = inflate({
        drive: 8,
        weaponry: {
            shields: [1, 2, 2],
        },
    });

    expect(ship).toMatchObject({
        drive: {
            rating: 8,
            current: 8,
            damage_level: 0,
        },
        weaponry: {
            shields: [
                { id: 1, level: 1 },
                { id: 2, level: 2 },
                { id: 3, level: 2 },
            ],
        },
    });
});
