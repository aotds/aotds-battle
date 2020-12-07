import dux  from '.';
import { test } from 'tap';

test('action ids', async t => {
    const store = dux.createStore();

    t.match(store.dispatch({ type: 'noop' }), { meta: { action_id: 1 } } as any);

    t.match(store.dispatch({ type: 'noop' }), { meta: { action_id: 2 } } as any);

    t.equal(store.getState(), 3, 'store is updated');
});
