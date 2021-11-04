import _ from 'lodash';

const beamDamage = (shield = 0) => (dice: number) => {
	const table = {
		4: shield ? 0 : 1,
		5: 1,
		6: shield >= 2 ? 1 : 2,
	};

	return table[dice] ?? 0;
};

export function calculateDamage(
	shield_level: number,
	dice: number[] = [],
): number {
	// all is beams right now
	const die_to_damage = beamDamage(shield_level);

	return _.sum(dice.map(die_to_damage));
}
