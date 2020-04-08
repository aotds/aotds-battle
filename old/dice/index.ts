import * as fp from 'lodash/fp';

let rigged_dice: number[] | null = null;

export function rig_dice(dice: number[] | null): void {
    rigged_dice = dice;
}

export function roll_die(nbr_faces = 6): number {
    if (rigged_dice) {
        if (rigged_dice.length === 0) throw new Error('ran out of rigged dice');

        return rigged_dice.shift() as number;
    }
    return fp.random(1, nbr_faces);
}

/**
 * roll the dice
 * @param nbr_dice How many dice to roll
 * @param options.reroll Array of values for which we reroll
 * @return dice values
 */
export default function roll_dice(
    nbr_dice: number,
    options: { reroll?: number[]; nbr_faces?: number; note?: string } = {},
): number[] {
    if (nbr_dice === 0) return [];

    const reroll_on = fp.pathOr([], 'reroll', options) as number[];
    const nbr_faces = fp.getOr(6, 'nbr_faces', options) as number;

    const roll: number[] = Array.from({ length: nbr_dice }).map(() => roll_die(nbr_faces));

    return [...roll, ...roll_dice(roll.filter(d => reroll_on.indexOf(d) > -1).length, options)];
}
