import fp from 'lodash/fp.js';

import { dux } from '../dux';

export const dice = [[6, 5], [3], [1], [1], [90]];

export const actions = [
	dux.actions.setOrders('enkidu', {
		firecons: { 1: { targetId: 'siduri' } },
		weapons: {
			1: { fireconId: 1 },
			2: { fireconId: 1 },
			3: { fireconId: 1 },
		},
	}),
	dux.actions.playTurn(),
];

export const tests = (state) => {
	const { enkidu, siduri } = state.bogeys;

	Object.values(enkidu.weaponry.weapons).forEach((weapon) => {
		expect(weapon).toHaveProperty('fireconId', 1);
	});

	expect(
		fp.find(
			{
				type: 'fireWeaponOutcome',
				payload: {
					outcome: {
						bearing: 0.8899999999999999,
					},
				},
			},
			state.log,
		),
	).toBeFalsy();

	expect(
		fp.find(
			{
				type: 'fireWeaponOutcome',
				payload: {
					outcome: {
						damageDice: [6, 5],
						penetratingDamageDice: [3],
					},
				},
			},
			state.log,
		),
	).toBeTruthy();

	// siduri got hit
	expect(siduri).toHaveProperty('structure.hull.current', 3);

	// not enkidu
	expect(enkidu).toHaveProperty('structure.hull.current', 4);
};
