const beamDamage = (shield = 0) => (dice) => {
	const table = {
		4: shield ? 0 : 1,
		5: 1,
		6: shield >= 2 ? 1 : 2,
	};

	return table[dice] ?? 0;
};

/**
 * @return {number} damage
 */
export function calculateDamage(shield_level = 0, dice = []) {
	// all is beams right now

	const die_to_damage = beamDamage(shield_level);

	return dice.map(die_to_damage).reduce((a, b) => a + b, 0);
}
