// @format

import fp from 'lodash/fp';

import { play_steps } from './play_phases';

test('play_phases', () => {
    let gen = play_steps();
    expect(
        Array.from(gen)
            .filter(x => x)
            .map(fp.get(['payload', 'action', 'type'])),
    ).toEqual([
        'MOVEMENT_PHASE',
        'FIRECONS_ORDER_PHASE',
        'WEAPONS_ORDER_PHASE',
        'WEAPONS_FIRING_PHASE',
        'CLEAR_ORDERS',
    ]);
});
