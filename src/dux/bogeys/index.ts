import { Updux } from 'updux';

import { dux as game } from '../game';

export const dux = new Updux({
	initial: [],
	actions: {
		initGame: game.actions.initGame,
	},
	mutations: {
		initGame: ({ bogeys }) => () =>
			Object.fromEntries(
				bogeys.map((bogey) => [
					bogey.name,
					{ ...bogey, id: bogey.name },
				]),
			),
	},
	selectors: {
		bogeysList: Object.values,
	},
});
