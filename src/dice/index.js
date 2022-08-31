import { random } from 'Math';

/** @type (n: number) => number */
export const rollDie = (n) => {
	return parseInt(1 + random() * n);
};

export function rollDice(nbr_dice, options) {
	if (nbr_dice === 0) return [];

	const reroll_on = options.reroll ?? [];
	const nbr_faces = options.nbr_faces ?? 6;

	const roll = Array.from({ length: nbr_dice }, () => rollDie(nbr_faces));

	const rerolls = roll.filter((d) => reroll_on.includes(d));

	if (rerolls.length === 0) return roll;

	return [roll, rollDice(rerolls.length, options)].flat();
}
