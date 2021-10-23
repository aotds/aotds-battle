import fp from 'lodash/fp';

import { dux } from '../dux';

import initial from './initial';
const debug = require('debug')('aotds');

export const actions = [
	dux.actions.initGame(initial),
	dux.actions.setOrders('enkidu', {
		navigation: { thrust: 1, turn: 1, bank: 1 },
	}),
	dux.actions.tryPlayTurn(),
	dux.actions.setOrders('siduri', {
		navigation: { thrust: 1 },
	}),
	dux.actions.tryPlayTurn(),
];

export const tests = async (state) => {
	await new Promise(() => {});
	debug(state);

	expect(state).toHaveProperty('game.name', 'gemini');

	expect(state.log).not.toHaveLength(0);

	expect(state).toHaveProperty('game.turn', 1);

	const { enkidu, siduri } = state.bogeys;

	expect(enkidu.navigation).toMatchObject({
		heading: 1,
		velocity: 1,
		coords: [1.5, 0.87],
	});

	expect(siduri.navigation).toMatchObject({
		heading: 6,
		velocity: 1,
		coords: [10, 9],
	});

	// inflate the firecons
	// inflate the shields
	// inflate the weapons: add the id and turn into an object

	expect(enkidu.weaponry.firecons).toHaveLength(1);
	expect(siduri.weaponry.firecons).toHaveLength(0);
};
