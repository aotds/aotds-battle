import { mockMiddleware } from '../../utils/mockMiddleware';
import dux, {
	_fireconOrdersPhaseEffect,
	_fireFireconEffect,
	_weaponfiringPhaseEffect,
} from '.';

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

test('weaponFiringPhase', () => {
	const getState = () => [
		{
			id: 'one',
			weaponry: { firecons: { 1: { id: 1, targetId: 'bob' } } },
		},
		{ id: 'two' },
	];

	const {
		api: { dispatch },
	} = mockMiddleware(_weaponfiringPhaseEffect, {
		action: dux.actions.fireconOrdersPhase(),
		api: {
			getState,
		},
	});

	expect(dispatch).toBeCalledTimes(1);

	expect(dispatch).toBeCalledWith(
		expect.objectContaining(dux.actions.fireFirecon('one', 1)),
	);
});
test('fireFirecon', () => {
	const getState = () => ({
		one: {
			id: 'one',
			weaponry: {
				firecons: { 1: { id: 1, targetId: 'bob' } },
				weapons: {
					1: { id: 1, fireconId: 1 },
					2: { id: 2 },
				},
			},
		},
		two: { id: 'two' },
	});

	const {
		api: { dispatch },
	} = mockMiddleware(_fireFireconEffect, {
		action: dux.actions.fireFirecon('one', 1),
		api: {
			getState,
		},
	});

	expect(dispatch).toBeCalledTimes(1);

	expect(dispatch).toBeCalledWith(
		expect.objectContaining(dux.actions.fireWeapon('one', 1, 'bob')),
	);
});
