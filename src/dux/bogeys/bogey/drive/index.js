import { Updux } from 'updux';
import fp from 'lodash/fp.js';
import u from 'updeep';

// type DriveState = {
//     rating: number;
//     current: number;
//     damage_level?: 0 | 1 | 2;
// };

export const dux = new Updux({
	initial: {
		rating: 0,
		current: 0,
	},
	actions: {
		internalDamageDrive: null,
	},
	mutations: {
		internalDamageDrive: () => (state) => {
			const damageLevel = Math.min(state.damageLevel + 1, 2);

			const current = Math.round(
				state.rating - (damageLevel * state.rating) / 2,
			);

			return u({ damageLevel, current }, state);
		},
	},
});

//type DriveShorthand = number | DriveState;

export function inflate(shorthand = 0) {
	if (typeof shorthand === 'number')
		return {
			current: shorthand,
			rating: shorthand,
			damageLevel: 0,
		};

	return fp.defaults({ damage_level: 0 }, shorthand);
}
