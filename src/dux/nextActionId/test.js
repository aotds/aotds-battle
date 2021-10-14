import { test } from 'tap';

import dux from './index.js';

test('action ids', async (t) => {
    const store = dux.createStore();

    t.match(store.dispatch({ type: 'noop' }), {
        meta: {
            actionId: 1
        }
    }
    );
    t.match(store.dispatch({ type: 'noop' }), {
        meta: {
            actionId: 2
        }
    }
    );

    t.equal( store.getState(), 3 )
});
