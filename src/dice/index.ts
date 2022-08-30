import  random  from 'lodash/random.js';

const rollDie = (n: number) => random(1, n);

export function rollDice(
	nbr_dice: number,
	options: { reroll?: number[]; nbr_faces?: number; note?: unknown } = {},
): number[] {
	if (nbr_dice === 0) return [];

	const reroll_on = options.reroll ?? [];
	const nbr_faces = options.nbr_faces ?? 6;

	const roll: number[] = Array.from({ length: nbr_dice }, () =>
		rollDie(nbr_faces),
	);

	const rerolls = roll.filter((d) => (reroll_on as any).includes(d));

	if (rerolls.length === 0) return roll;

	return ([roll, rollDice(rerolls.length, options)] as any).flat();
}
