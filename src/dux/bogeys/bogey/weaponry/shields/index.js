import { BattleDux } from '../../../../../BattleDux.js';

// type ShieldState = {
// 	id: number;
// 	level: 1 | 2;
// 	damaged: boolean;
// };

// type ShieldsState = Record<string, ShieldState>;

const schema = {
	type: 'array',
	items: {
		type: 'object',
		properties: {
			id: 'number',
			damaged: 'boolean',
			level: 'number', // 1 or 2
		},
	},
};

export const shieldsDux = new BattleDux({
	initial: [],
	schema,
	selectors: {
		effectiveShieldLevel: (shields) => {
			return Math.max(
				0,
				...shields
					.filter(({ damaged }) => !damaged)
					.map(({ level }) => level),
			);
		},
	},
});

export default shieldsDux;

shieldsDux.setInflator((shorthand = {}) => {
	return shorthand.map((level, id) =>
		typeof level === 'number'
			? { id: id + 1, level, damaged: false }
			: { id: id + 1, ...level },
	);
});
