import tap from 'tap';

import dux from '.';

const store = dux.createStore();

store.dispatch({
    type: 'alpha',
    meta: {
        action_id: 1,
    },
});

store.dispatch({
    type: 'beta',
    meta: {
        action_id: 2,
        parent_actions: [1],
    },
});

store.dispatch({
    type: 'gamma',
    meta: {
        action_id: 3,
    },
});

tap.test('log is okay', async (t) => {
    t.match(store.getState(),[{ type: 'alpha', subactions: [{ type: 'beta' }] }, { type: 'gamma' }]);
});
