import { inflate_bogey } from './inflate';

test('inflate_bogey', () => {
	expect(
		inflate_bogey({
			id: 'enkidu',
			structure: {
				hull: 8,
				shields: [1, 2],
				armor: 5,
			},
			drive: 7,
			weaponry: {
				weapons: [{}, {}],
				firecons: 2,
			},
		} as any),
	).toMatchObject({
		id: 'enkidu',
		structure: {
			hull: { rating: 8, current: 8 },
			shields: [
				{ id: 0, level: 1 },
				{ id: 1, level: 2 },
			],
			armor: { rating: 5, current: 5 },
		},
		drive: { rating: 7, current: 7 },
		weaponry: {
			weapons: [{ id: 0 }, { id: 1 }],
			firecons: [{ id: 0 }, { id: 1 }],
		},
	});
});
