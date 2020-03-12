import dux from '.';

test('action ids', () => {
    const store = dux.createStore();

    store.dispatch({type: 'noop'});
    const action = store.dispatch({type: 'noop'});

    expect(action).toHaveProperty('meta.action_id',2);
});
test('timestamps', () => {
    const store = dux.createStore();

    const action = store.dispatch({type: 'noop'});

    expect(action).toHaveProperty('meta.timestamp');
});
