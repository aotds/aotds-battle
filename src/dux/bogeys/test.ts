import { mockMiddleware } from '../../utils/mockMiddleware';
import dux, {
	_fireconOrdersPhaseEffect,
	_fireFireconEffect,
	_fireWeaponEffect,
	_fireWeaponOutcome,
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

test('fireWeaponOutcome', () => {
	const result = mockMiddleware(_fireWeaponEffect, {
		action: dux.actions.fireWeapon('enkidu', 1, 'siduri'),
		api: {
			getState: () =>
				dux.inflate([
					{
						name: 'enkidu',
						navigation: {
							coords: [0, 0],
							heading: 3,
						},
						weaponry: {
							weapons: [
								{
									weaponClass: 2,
									weaponType: 'beam',
									arcs: ['F'],
								},
							],
						},
					},
					{
						name: 'siduri',
						navigation: {
							heading: 9,
							coords: [5, 0],
						},
					},
				]),
		},
	});

	const dispatch = result.api.dispatch;
	expect(dispatch).toHaveBeenCalledTimes(1);

	const arg = dispatch.mock.calls[0][0];

	expect(arg).toMatchObject({
		type: 'fireWeaponOutcome',
		payload: {
			bogeyId: 'siduri',
			outcome: {
				distance: 5,
				bearing: 0,
			},
		},
	});

	expect(arg.payload.outcome.damageDice.length).toBeGreaterThanOrEqual(2);
	expect(
		arg.payload.outcome.penetratingDamageDice.length,
	).toBeGreaterThanOrEqual(0);
});

test('_fireWeaponEffect', () => {
	const result = mockMiddleware(_fireWeaponOutcome, {
		action: dux.actions.fireWeaponOutcome('siduri', {
			damageDice: [6, 6],
			penetratingDamageDice: [3, 4, 5],
		} as any),
		api: {
			getState: () => dux.inflate([{ name: 'siduri' }]),
		},
	});

	const dispatch = result.api.dispatch;
	expect(dispatch).toHaveBeenCalledTimes(2);

	expect(dispatch).toHaveBeenCalledWith(
		expect.objectContaining(dux.actions.bogeyDamage('siduri', 4)),
	);

	expect(dispatch).toHaveBeenCalledWith(
		expect.objectContaining(dux.actions.bogeyDamage('siduri', 2, true)),
	);
});
