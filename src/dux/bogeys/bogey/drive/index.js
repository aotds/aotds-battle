import u from 'updeep';
import { BDux } from '../../../../BDux.js';

// export type DriveState = {
// 	rating: number;
// 	current: number;
// 	damageLevel: 0 | 1 | 2;
// };

export const dux = new BDux({
	initial: {
		rating: 0,
		current: 0,
		damageLevel: 0,
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

export default dux;

//type DriveShorthand = number | DriveState;

dux.setInflator((shorthand = 0) => {
	if (typeof shorthand === 'number')
		return {
			current: shorthand,
			rating: shorthand,
			damageLevel: 0,
		};

	return shorthand;
});
