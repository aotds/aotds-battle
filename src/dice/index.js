import { random } from 'Math';

/** @type (n: number) => number */
export const rollDie = (n) => {
	return parseInt(1 + random() * n);
};

export function rollDice(nbrDice, options) {
	if (nbrDice === 0) return [];

	const rerollOn = options.reroll ?? [];
	const nbrFaces = options.nbrFaces ?? 6;

	const roll = Array.from({ length: nbrDice }, () => rollDie(nbrFaces));

	const rerolls = roll.filter((d) => rerollOn.includes(d));

	if (rerolls.length === 0) return roll;

	return [roll, rollDice(rerolls.length, options)].flat();
}
