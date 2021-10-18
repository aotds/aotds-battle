import { Updux } from 'updux';

import { dux as game } from './game';
import { dux as bogeys } from './bogeys';

export const dux = new Updux({
	actions: {
		playTurn: (force = true) => force,
	},
	subduxes: {
		game,
		bogeys,
	},
});

export const playTurnEffect = dux.addEffect(
	'playTurn',
	(api) => (next) => (action) => {
		if (action.payload || api.getState.allBogeysHaveOrders()) {
			next(action);
		}
	},
);
