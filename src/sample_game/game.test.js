import { test, describe, expect } from 'vitest';

import { battleDux } from '../dux/battle.js';

import * as Turn0 from './turn-0.js';
//import * as Turn1 from './turn-1.js';

const battle = battleDux.createStore();

describe.each([Turn0])('turn %#', async ({ actions = [], tests }) => {
	actions.forEach(battle.dispatch);

	const state = battle.getState();

	if (tests) describe('tests', () => tests(state, battle));

	test('snapshot', () => expect(state).toMatchSnapshot());
});
