import dux from '.';

test('inflate', () => {
	expect(dux.inflate(4)).toMatchObject({
		rating: 4,
		current: 4,
		damageLevel: 0,
	});
});

test('internalDamageDrive', () => {
	const store = dux.createStore(dux.inflate(5));

	expect(store.getState()).toEqual({
		rating: 5,
		current: 5,
		damageLevel: 0,
	});

	store.dispatch.internalDamageDrive();

	expect(store.getState()).toMatchObject({
		current: 3,
		damageLevel: 1,
	});

	store.dispatch.internalDamageDrive();

	expect(store.getState()).toMatchObject({
		current: 0,
		damageLevel: 2,
	});

	store.dispatch.internalDamageDrive();

	expect(store.getState()).toMatchObject({
		current: 0,
		damageLevel: 2,
	});
});
