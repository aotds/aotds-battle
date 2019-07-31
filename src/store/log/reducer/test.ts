import log_reducer from './index';
import { LogState } from './types';


test( 'basic', () => {
    let state : LogState = [
        { meta: { action_id: 1 }, type: 'ONE' }
    ];

    state = log_reducer( state, {
        type: 'TWO', meta: { action_id: 2, parent_ids: [ 1 ] },
    })

    state = log_reducer( state, {
        type: 'THREE', meta: { action_id: 3, parent_ids: [ 1, 2 ] },
    })

    state = log_reducer( state, {
        type: 'FIVE', meta: { action_id: 5, parent_ids: [ 1,2 ]  },
    })

    state = log_reducer( state, {
        type: 'FOUR', meta: { action_id: 4 },
    })

    expect(state).toMatchObject([
        { type: 'ONE',
            subactions: [
                { type: 'TWO', subactions: [ { type: 'THREE' }, { type: 'FIVE' } ] }
            ]
        },
        { type: 'FOUR' },
    ])

});
