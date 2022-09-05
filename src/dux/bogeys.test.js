import { test, expect } from 'vitest';
import { bogeysDux } from './bogeys';

test('addBogeys', () => {
	const store = bogeysDux.createStore();

	const name = 'Enkidu';

	store.dispatch.addBogeys([{ name }, { name }, { name }]);

	expect(store.getState()).toEqual([
		{ name, id: 'enkidu' },
		{ name, id: 'enkidu-1' },
		{ name, id: 'enkidu-2' },
	]);
});
