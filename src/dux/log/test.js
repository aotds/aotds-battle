import { test } from 'tap';

import dux from './index.js';

const store = dux.createStore();

store.dispatch({
    type: 'alpha',
    meta: {
        actionId: 1,
    },
});

store.dispatch({
    type: 'beta',
    meta: {
        actionId: 2,
        parentActionId: 1,
    },
});

store.dispatch({
    type: 'gamma',
    meta: {
        actionId: 3,
    },
});

test('log is okay', async (t) => {
    t.match(
        store.getState.orderedLog(),
    [
        { type: 'alpha', subactions: [{ type: 'beta' }] },
        { type: 'gamma' },
    ]);
});
