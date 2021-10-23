import dux from '.';

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
