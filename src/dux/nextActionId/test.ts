import dux from '.';

test('action ids', () => {
	const store = dux.createStore();

	expect(store.dispatch({ type: 'noop' })).toMatchObject({
		meta: {
			actionId: 1,
		},
	});
	expect(store.dispatch({ type: 'noop' })).toMatchObject({
		meta: {
			actionId: 2,
		},
	});

	expect(store.getState()).toEqual(3);
});
