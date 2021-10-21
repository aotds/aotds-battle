import * as dux from '.';

test('inflate', () => {
	const bogey = dux.inflate({
		drive: 4,
	});

	expect(bogey).toHaveProperty(
		'drive',
		expect.objectContaining({
			current: 4,
			rating: 4,
			damageLevel: 0,
		}),
	);
});
