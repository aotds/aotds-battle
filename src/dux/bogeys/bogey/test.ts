import dux from '.';
import weaponry from './weaponry';

test('inflate', () => {
	const bogey = dux.inflate({
		drive: 4,
		weaponry: {
			firecons: 2,
			shields: [1, 1],
			weapons: [{}, {}],
		},
	});

	expect(bogey).toHaveProperty(
		'drive',
		expect.objectContaining({
			current: 4,
			rating: 4,
			damageLevel: 0,
		}),
	);

	expect(bogey).toHaveProperty('weaponry.firecons.2', {
		id: 2,
	});

	expect(bogey).toHaveProperty('weaponry.shields.2', {
		id: 2,
		level: 1,
		damaged: false,
	});

	expect(bogey).toHaveProperty('weaponry.weapons.2', {
		id: 2,
	});
});

test('clearOrders', () => {
	const state = dux.inflate({
		orders: {
			potato: true,
		},
		weaponry: {
			firecons: [{ targetId: 'enkidu' }],
		},
	});

	const reduced = dux.reducer(state, dux.actions.clearOrders());

	expect(reduced).not.toHaveProperty('weaponry.firecons.1.targetId');
	expect(reduced).not.toHaveProperty('orders.potato');
});
