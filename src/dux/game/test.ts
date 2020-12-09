import dux from '.';

test('play_turn', () => {
    const store = dux.createStore();

    store.dispatch(store.actions.play_turn());

    expect(store.getState()).toHaveProperty('turn', 1);
});
