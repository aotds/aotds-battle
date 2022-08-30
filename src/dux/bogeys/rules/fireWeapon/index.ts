import { relativeCoords } from './relativeCoords.js';
import { inArcs } from './inArcs.js';
import { WeaponMounted } from '../../bogey/weaponry/weapons/index.js';
import { rollDice } from '~/dice/index.js';

type AbortReasons =
	| 'no firing arc'
	| 'aft weapon while thrusting'
	| 'out of range';

type Aborted = {
	aborted: AbortReasons;
};

export type FireWeaponOutcome = {
	bearing: number;
	distance: number;
	damageDice: number[];
	penetratingDamageDice: number[];
} & Partial<Aborted>;

type NavigationState = Record<string, unknown>;

const abortGen = (distance: number, bearing: number) => (
	aborted: AbortReasons,
): FireWeaponOutcome => ({
	distance,
	bearing,
	aborted,
	damageDice: [],
	penetratingDamageDice: [],
});

type Attacker = {
	navigation: NavigationState;
	drive: {
		thrustUsed: number;
	};
};

export function fireWeapon(
	attacker: Attacker,
	target: NavigationState,
	weapon: WeaponMounted,
): FireWeaponOutcome {
	// right now it's all beam weapons
	const { distance, bearing } = relativeCoords(attacker, target);

	const abort = abortGen(distance, bearing);

	const hit = (damageDice: number[], penetratingDamageDice: number[]) => ({
		distance,
		bearing,
		damageDice,
		penetratingDamageDice,
	});

	if (inArcs(['A'], bearing) && attacker.drive.thrustUsed) {
		// aft weapons can't be used when thrusting
		return abort('aft weapon while thrusting');
	}

	if (!inArcs(weapon.arcs, bearing)) {
		return abort('no firing arc');
	}

	const nbr_dice = weapon.weaponClass - (Math as any).trunc(distance / 12);

	if (nbr_dice <= 0) return abort('out of range');

	let damageDice = rollDice(nbr_dice, { note: 'fire_weapon' });

	const nbr_penetrating_dice = damageDice.filter((d) => d === 6).length;

	let penetratingDamageDice = rollDice(nbr_penetrating_dice, {
		reroll: [6],
		note: 'fire_weapon penetrating damage',
	});

	// if the target gets it in Aft, all damages are penetrating
	if (inArcs(['A'], relativeCoords(target, attacker).bearing)) {
		penetratingDamageDice = damageDice.concat(...penetratingDamageDice);
		damageDice = [];
	}

	return hit(damageDice, penetratingDamageDice);
}
