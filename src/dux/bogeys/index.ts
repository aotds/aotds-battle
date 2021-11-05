import u from 'updeep';
import { matches, get } from 'lodash/fp';

import { dux as game } from '../game';
import bogeyDux from './bogey';
import { subactionFor } from '../actionId';
import { plotMovement } from './bogey/rules/plotMovement';
import { BattleDux } from '../../BattleDux';
import { fireWeapon, FireWeaponOutcome } from './rules/fireWeapon';
import { calculateDamage } from './rules/calculateDamage';

export const dux = new BattleDux({
	initial: {},
	subduxes: { '*': bogeyDux },
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
		fireWeaponOutcome: (bogeyId: string, outcome: FireWeaponOutcome) => ({
			bogeyId,
			outcome,
		}),
		bogeyDamage: (
			bogeyId: string,
			damage: number,
			penetrating = false,
		) => ({
			bogeyId,
			damage,
			penetrating,
		}),
	},
	mutations: {
		initGame: ({ bogeys }) => () =>
			Object.fromEntries(
				bogeys.map((b) => [b.name, bogeyDux.inflate(b)]),
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
			u.if((x) => !!x, bogeyDux.upreducer(action)),
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

export const _fireWeaponEffect = dux.addSubEffect(
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

dux.setInflator((shorthand) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand
			.map((b) => bogeyDux.inflate(b))
			.map((bogey) => [bogey.id, bogey]),
	);
});

export const _fireWeaponOutcome = dux.addSubEffect(
	'fireWeaponOutcome',
	({ getState, dispatch }) => ({ payload }) => {
		if (payload.aborted) return;

		const { bogeyId } = payload;

		const bogey = getState.bogey(bogeyId);
		if (!bogey) return;

		[
			{
				damage: calculateDamage(
					bogeyDux.selectors.effectiveShieldLevel(bogey),
					payload.outcome.damageDice,
				),
			},
			{
				damage: calculateDamage(
					bogeyDux.selectors.effectiveShieldLevel(bogey),
					payload.outcome.penetratingDamageDice,
				),
				penetrating: true,
			},
		]
			.filter(({ damage }) => damage > 0)
			.map(({ damage, penetrating }) =>
				dispatch.bogeyDamage(bogeyId, damage, penetrating),
			);
	},
);
