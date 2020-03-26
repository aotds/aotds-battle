import dux, { actionIdEffect } from '.';
import { test } from 'tap';

test('action ids', t => {
    dux.addEffect(
        '*',
        actionIdEffect(state => state),
    );

    const store = dux.createStore();

    t.matches(store.dispatch({ type: 'noop' }), { meta: { action_id: 1 } });

    t.matches(store.dispatch({ type: 'noop' }), { meta: { action_id: 2 } });

    t.equal(store.getState(), 3, 'store is updated');

    t.end();
});
