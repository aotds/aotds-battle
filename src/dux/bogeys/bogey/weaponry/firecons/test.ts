import dux from '.';

test('bogeyFireconsOrders', () => {
	let state = dux.inflate(2);

	state = dux.reducer(
		state,
		dux.actions.bogeyFireconsOrders('xxx', {
			2: { targetId: 'siduri' },
		}) as any,
	);

	expect(state).toMatchObject({
		1: { id: 1 },
		2: { id: 2, targetId: 'siduri' },
	});
});
