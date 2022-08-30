import { Updux } from 'updux';

import { dux as game } from './game/index.js';
import { dux as bogeys } from './bogeys/index.js';
import { dux as log } from './log/index.js';
import { subactionFor, middlewareWrapper, dux as actionId } from './actionId/index.js';
import { BattleDux } from '~/BattleDux.js';

export const dux = new BattleDux({
	actions: {
		movementPhase: () => {},
		weaponFiringPhase: () => {},
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
