import { dux } from '.';

test('setOrders', () => {
	const store = dux.createStore();

	store.dispatch.initGame({
		bogeys: [{ name: 'enkidu' }, { name: 'siduri' }],
	});

	store.dispatch.setOrders('enkidu', { navigation: { thrust: 2 } });

	expect(store.getState.bogey('enkidu')).toHaveProperty(
		'orders.navigation.thrust',
		2,
	);

	expect(store.getState.bogey('siduri')).not.toHaveProperty(
		'orders.navigation.thrust',
		2,
	);
});
