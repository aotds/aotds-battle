import { Updux } from 'updux';

import { dux as game } from './game';
import { dux as bogeys } from './bogeys';
import { dux as log } from './log';
import { subactionFor } from './actionId';

export const dux = new Updux({
	actions: {},
	subduxes: {
		game,
		bogeys,
		log,
	},
});

export const playTurnEffect = dux.addEffect(
	'tryPlayTurn',
	(api) => (next) => (action) => {
		next(action);
		if (action.payload || api.getState.allBogeysHaveOrders()) {
			api.dispatch.playTurn();
		}
	},
);

const subEffect = subactionFor(dux);

subEffect('playTurn', (api) => () => () => {
	[
		'movementPhase',
		'fireconOrdersPhase',
		'weaponOrdersPhase',
		'weaponFiringPhase',
		'clearOrders',
	].forEach((step) => api.dispatch[step]());
});
