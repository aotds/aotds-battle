import bogey_dux from '.';

test('basic set_orders', () => {
    const store = bogey_dux.createStore({ id: 'enkidu' });

    store.dispatch(
        bogey_dux.actions.set_orders({
            bogey_id: 'enkidu',
            orders: {
                navigation: { thrust: 2 },
            },
        }),
    );

    const state = store.getState();

    expect(state).toHaveProperty('orders.navigation.thrust', 2);
});

test('orders for this ship only', () => {
    const store = bogey_dux.createStore({ id: 'enkidu' });

    store.dispatch(
        bogey_dux.actions.set_orders({
            bogey_id: 'siduri',
            orders: {
                navigation: { thrust: 2 },
            },
        }),
    );

    const state = store.getState();

    expect(state).not.toHaveProperty('orders.navigation.thrust', 2);
});
