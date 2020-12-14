import fp from 'lodash/fp';
import _ from 'lodash';

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

    console.log(result);
    expect(fp.find({ id: 2 }, result.weaponry.weapons)).toHaveProperty('firecon_id', 2);
});
