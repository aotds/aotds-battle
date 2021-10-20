import { Updux } from 'updux';

import { dux as game } from './game';
import { dux as bogeys } from './bogeys';
import { dux as log } from './log';

export const dux = new Updux({
	actions: {},
	subduxes: {
		game,
		bogeys,
		log,
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
