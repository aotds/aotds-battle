import { test, expect } from 'vitest';

import { dux } from './log.js';

const store = dux.createStore();

store.dispatch({
	type: 'alpha',
	meta: {
		actionId: 1,
	},
});

store.dispatch({
	type: 'beta',
	meta: {
		actionId: 2,
		parentActionId: 1,
	},
});

store.dispatch({
	type: 'gamma',
	meta: {
		actionId: 3,
	},
});

test('log is okay', () => {
    expect(store.getState()).toHaveLength(3);

	expect(store.getState.groupedLog()).toMatchObject([
		{ type: 'alpha', subactions: [{ type: 'beta' }] },
		{ type: 'gamma' },
	]);
});
