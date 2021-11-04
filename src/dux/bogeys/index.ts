import u from 'updeep';
import { matches, get } from 'lodash/fp';

import { dux as game } from '../game';
import bogey from './bogey';
import { subactionFor } from '../actionId';
import { plotMovement } from './bogey/rules/plotMovement';
import { BattleDux } from '../../BattleDux';
import { fireWeapon } from './rules/fireWeapon';

export const dux = new BattleDux({
	initial: {},
	subduxes: { '*': bogey },
	actions: {
		initGame: game.actions.initGame,
		fireconOrdersPhase: () => {},
		weaponOrdersPhase: () => {},
		fireFirecon: (bogeyId: string, fireconId: number) => ({
			bogeyId,
			fireconId,
		}),
		fireWeapon: (bogeyId: string, weaponId: number, targetId: string) => ({
			bogeyId,
			weaponId,
			targetId,
		}),
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

export const _weaponfiringPhaseEffect = dux.addSubEffect(
	'weaponFiringPhase',
	({ dispatch, getState }) => () => {
		getState.bogeys().forEach((bogey) => {
			Object.values(bogey?.weaponry?.firecons ?? {})
				.filter(({ targetId }: any) => targetId)
				.forEach(({ id }: any) => dispatch.fireFirecon(bogey.id, id));
		});
	},
);

export const _fireFireconEffect = dux.addSubEffect(
	'fireFirecon',
	({ getState, dispatch }) => ({ payload: { bogeyId, fireconId } }) => {
		const bogey = getState.bogey(bogeyId);
		if (!bogey) return;

		const firecon = bogey.weaponry.firecons[fireconId];
		const { targetId } = firecon;

		const fireWeapon = (weaponId) =>
			dispatch.fireWeapon(bogeyId, weaponId, targetId);

		Object.values(bogey.weaponry.weapons)
			.filter(matches({ fireconId }) as any)
			.map(get('id'))
			.forEach(fireWeapon);
	},
);

dux.addSubEffect(
	'fireWeapon',
	({ getState, dispatch, selectors, actions }) => ({
		payload: { bogeyId, targetId, weaponId },
	}) => {
		const attacker = getState.bogey(bogeyId);
		const target = getState.bogey(targetId);

		if (!attacker || !target) return;

		const weapon = attacker.weaponry.weapons[weaponId];

		if (!weapon) return;

		const outcome = fireWeapon(
			attacker.navigation,
			target.navigation,
			weapon,
		);

		dispatch.fireWeaponOutcome(targetId, outcome);
	},
);

/* TODO



bogeys_dux.addSubEffect(
    bogeys_dux.actions.weapon_fire_outcome,
    ({ getState, dispatch, selectors }) => ({ payload }) => {
        if (payload.aborted) return;

        const { bogey_id } = payload;

        const bogey = selectors.getBogey(getState())(bogey_id);
        if (!bogey) return;

        [
            {
                damage: calculateDamage(bogey, payload.outcome.damage_dice),
            },
            {
                damage: calculateDamage(bogey, payload.outcome.penetrating_damage_dice),
                penetrating: true,
            },
        ]
            .filter(({ damage }) => damage > 0)
            .map(damage => ({ ...damage, bogey_id }))
            .map(bogeys_dux.actions.bogey_damage)
            .forEach(dispatch);
    },
);
*/
