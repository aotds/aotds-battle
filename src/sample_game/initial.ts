export default {
	game: {
		name: 'gemini',
		players: ['yanick', 'yenzie'],
	},
	bogeys: [
		{
			name: 'enkidu',
			drive: 6,
			navigation: {
				coords: [0, 0],
			},
			weaponry: {
				firecons: 1,
				shields: [1, 2],
				weapons: [
					{
						weaponType: 'beam',
						weaponClass: 2,
						arcs: ['F'],
					},
					{ arcs: ['FS'], weaponType: 'beam', weaponClass: 1 },
					{ arcs: ['FP'], weaponType: 'beam', weaponClass: 1 },
				],
			},
			structure: {
				hull: 4,
				armor: 4,
			},
			playerId: 'yanick',
		},
		{
			name: 'siduri',
			drive: { rating: 6, current: 6 },
			navigation: {
				coords: [10, 10],
				heading: 6,
			},
			playerId: 'yenzie',
			weaponry: { shields: [1, 2] },
			structure: {
				hull: 4,
				shields: [1, 2],
				armor: 4,
			},
		},
	],
};
