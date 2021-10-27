import u from 'updeep';

import { dux as game } from '../game';
import bogey from './bogey';
import { subactionFor } from '../actionId';
import { plotMovement } from './bogey/rules/plotMovement';
import { BattleDux } from '../../BattleDux';

export const dux = new BattleDux({
	initial: {},
	subduxes: { '*': bogey },
	actions: {
		initGame: game.actions.initGame,
		fireconOrdersPhase: () => {},
		weaponOrdersPhase: () => {},
	},
	mutations: {
		initGame: ({ bogeys }) => () =>
			Object.fromEntries(bogeys.map((b) => [b.name, bogey.inflate(b)])),
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

export default dux;

const subEffect = subactionFor(dux);

dux.addSubEffect('movementPhase', ({ getState, dispatch }) => () => {
	getState.bogeys().forEach((bogey) => {
		const movement = plotMovement(bogey);
		dispatch.bogeyMovementResolution(bogey.id, movement);
	});
});

export const _fireconOrdersPhaseEffect = dux.addSubEffect(
	'fireconOrdersPhase',
	({ getState, dispatch }) => () => {
		const bogeys = getState.bogeys();

		bogeys.forEach(({ id, orders }) => {
			if (orders?.firecons) {
				dispatch.bogeyFireconsOrders(id, orders?.firecons);
			}
		});
	},
);

dux.addSubEffect('weaponOrdersPhase', ({ getState, dispatch }) => () => {
	const bogeys = getState.bogeys();

	bogeys.forEach(({ id, orders }) => {
		if (orders?.weapons) {
			dispatch.bogeyWeaponsOrders(id, orders?.weapons);
		}
	});
});
