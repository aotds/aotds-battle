import { Updux } from 'updux';

import { dux as game } from './game';
import { dux as bogeys } from './bogeys';
import { dux as log } from './log';
import { subactionFor, middlewareWrapper, dux as actionId } from './actionId';

export const dux = new Updux({
	actions: {
		movementPhase: () => {},
		fireconOrdersPhase: () => {},
		weaponFiringPhase: () => {},
		weaponOrdersPhase: () => {},
		clearOrders: () => {},
	},
	subduxes: {
		actionId,
		game,
		bogeys,
		log,
	},
	middlewareWrapper,
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
