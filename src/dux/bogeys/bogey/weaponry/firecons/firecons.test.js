import { test, expect } from 'vitest';
import dux from './index.js';

test('bogeyFireconsOrders', () => {
	let state = dux.inflate(2);

	state = dux.reducer(
		state,
		dux.actions.bogeyFireconsOrders('enkidu', 2,
			{ targetId: 'siduri' },
		)
	);

    expect(state).toMatchObject([ { id: 1 },
        { id: 2, targetId: 'siduri' },
    ]);
});
