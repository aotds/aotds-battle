import { dux } from '.';

test('basic setOrders', () => {
    const store = dux.createStore({ id: 'enkidu' });

    store.dispatch.setOrders('enkidu',{
                navigation: { thrust: 2 },
            }
        );

    const state = store.getState();

    expect(state).toHaveProperty('orders.navigation.thrust', 2);
});
