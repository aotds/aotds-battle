import { BattleDux } from '../../../../../BattleDux.js';
import { Updux } from 'updux';

type ShieldState = {
	id: number;
	level: 1 | 2;
	damaged: boolean;
};

type ShieldsState = Record<string, ShieldState>;

export const dux = new BattleDux({
	initial: {} as ShieldsState,
	selectors: {
		effectiveShieldLevel: (shields: ShieldsState) => {
			return Math.max(
				0,
				...Object.values(shields)
					.filter(({ damaged }) => !damaged)
					.map(({ level }) => level),
			);
		},
	},
});

export default dux;

dux.setInflator((shorthand = {}) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand.map((level, id) => [
			id + 1,
			typeof level === 'number'
				? { id: id + 1, level, damaged: false }
				: level,
		]),
	);
});
