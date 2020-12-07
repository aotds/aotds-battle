import tap from 'tap';

import { initial_location } from './initial_location';
import { V } from '../../Vector';
import {BogeyState} from './bogey';

tap.test('first ship', async t => {
    const location = initial_location({} as any);

    t.equal(location.velocity, 0);
});

tap.test('subsequent ship', async(t) => {
    const location = initial_location(
        {
            player_id: 'yenzie',
        } as any,
        [{ player_id: 'yenzie', navigation: { coords: [0, 0] } }, { navigation: { coords: [10, 10] } }] as BogeyState[],
    );

    t.ok(V(location.coords).distance([0, 0]) >= 20);
    t.ok(V(location.coords).distance([10, 10]) >= 50);
});
