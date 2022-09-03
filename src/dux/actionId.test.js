import { test, expect, vi } from 'vitest';
import u from 'updeep';
import { Updux, action } from 'updux';

import {
	withSubactions,
	addActionIdEffect,
	dux as nextActionId,
	middlewareWrapper,
} from './actionId.js';
import { dux as log } from './log.js';
import { BDux } from '../BDux.js';

test('incActionId', () => {
	expect(nextActionId.actions.incActionId()).toMatchObject({
		type: 'incActionId',
		meta: {
			noLog: true,
		},
	});
});

test('nextActionId middleware', () => {
	const next = vi.fn();
	const dispatch = vi.fn();
	const getState = () => 6;
	getState.getNextActionId = () => 6;
	addActionIdEffect({
		getState,
		dispatch,
	})(next)({ type: 'noop' });

	expect(next).toHaveBeenCalledWith(
		expect.objectContaining({ meta: { actionId: 6 } }),
	);
});

test('action ids', () => {
	const snitch = vi.fn((x) => x);
	const myDux = new Updux({
		initial: { seen: [] },
		subduxes: { nextActionId },
		mutations: {
			'*': (_payload, action) =>
				u({
					seen: (state) => [...state, action],
				}),
		},
	});
	myDux.addEffect('*', addActionIdEffect);

	const store = myDux.createStore();

	store.dispatch({ type: 'noop' });

	expect(store.getState().seen.map((e) => e.meta?.actionId)).toContain(1);

	store.dispatch({ type: 'noop' });

	expect(store.getState().seen.map((e) => e.meta?.actionId)).toContain(2);

	expect(store.getState.getNextActionId()).toEqual(3);
});

test('with the log dux', () => {
	const myDux = new BDux({
		subduxes: {
			log,
			nextActionId,
		},
		actions: {
			doThis: null,
			doThat: null,
			doSomethingElse: null,
		},
	});

	myDux.addEffect('*', addActionIdEffect);

	myDux.addSubactions('doThis', ({ dispatch }) => () => dispatch.doThat());

	const store = myDux.createStore();
	store.dispatch.doThis();
	store.dispatch.doSomethingElse();

	const grouped = store.getState.groupedLog();

	expect(grouped[0].subactions[0].type).toEqual('doThat');
});
