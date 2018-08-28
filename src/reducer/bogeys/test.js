import bogeys from './index';

import { init_game } from '~/actions'

test('init_game', () => {

    let state = bogeys(undefined, init_game({ bogeys: [ { id: 'enkidu' }, { id: 'siduri' } ] }));

    expect(state).toHaveProperty('enkidu');
    expect(state).toHaveProperty('siduri');

    console.log(state);
});
