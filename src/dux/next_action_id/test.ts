import dux from '.';

test('action ids', async () => {
    const store = dux.createStore();

    expect(store.dispatch({ type: 'noop' })).toHaveProperty('meta.action_id', 1);

    expect(store.dispatch({ type: 'noop' })).toHaveProperty('meta.action_id', 2);

    expect(store.getState()).toEqual(3);
});
