import { Updux } from 'updux';
import u from 'updeep';

import { dux as game } from '../game';
import { dux as bogey } from './bogey';
import { subactionFor } from '../actionId';
import { plotMovement } from './bogey/rules/plotMovement';

export const dux = new Updux({
	initial: {},
	subduxes: { '*': bogey },
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
		bogeys: Object.values,
		bogey: (bogeys) => (bogeyId: string) => bogeys[bogeyId],
		allBogeysHaveOrders: (bogeys) =>
			Object.values(bogeys).every((bogey: any) => bogey.orders),
	},
	upreducerWrapper: (upreducer) => (action: any) => {
		const bogeyId = action?.payload?.bogeyId;
		if (!bogeyId) return upreducer(action);

		return u.updateIn(
			bogeyId,
			u.if((x) => !!x, bogey.upreducer(action)),
		);
	},
});

const subEffect = subactionFor(dux);

subEffect('movementPhase', ({ getState, dispatch }) => () => () => {
	getState.bogeys().forEach((bogey) => {
		const movement = plotMovement(bogey);
		dispatch.bogeyMovementResolution(bogey.id, movement);
	});
});
