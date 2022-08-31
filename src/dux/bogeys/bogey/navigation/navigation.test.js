import { test, expect } from 'vitest';

import { dux } from './index.js';

test('basic', async () => {
	const store = dux.createStore();
	const movement = {
		coords: [1, 1],
		heading: 2,
		velocity: 3,
	};
	store.dispatch.bogeyMovementResolution('enkidu', movement);

	expect(store.getState()).toEqual(movement);
});
