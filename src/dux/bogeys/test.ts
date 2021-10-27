import { mockMiddleware } from '../../utils/mockMiddleware';
import dux, { _fireconOrdersPhaseEffect } from '.';

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

test('fireconOrdersPhase', () => {
	const getState = () => [
		{ id: 'one', orders: { firecons: { 1: { targetId: 'bob' } } } },
		{ id: 'two' },
	];

	const {
		api: { dispatch },
	} = mockMiddleware(_fireconOrdersPhaseEffect, {
		action: dux.actions.fireconOrdersPhase(),
		api: {
			getState,
		},
	});

	expect(dispatch).toHaveBeenCalledTimes(1);

	expect(dispatch).toHaveBeenCalledWith(
		expect.objectContaining(
			dux.actions.bogeyFireconsOrders('one', {
				1: {
					targetId: 'bob',
				},
			}),
		),
	);
});
