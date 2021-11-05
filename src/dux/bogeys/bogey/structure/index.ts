import { BattleDux } from '~/BattleDux';
import { ceil } from 'lodash/fp';

import hull from './hull';
import armor from './armor';

export const dux = new BattleDux({
	initial: {},
	subduxes: { hull, armor },
	actions: {
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
});

export default dux;

dux.setImmerMutation(
	'bogeyDamage',
	(draft, { damage = 0, penetrating = false }) => {
		if (!penetrating && draft.armor?.current) {
			const armor_damage = Math.min(
				ceil(damage / 2),
				draft.armor?.current,
			);
			damage -= armor_damage;

			draft.armor.current -= armor_damage;
		}

		draft.hull.current -= damage;
	},
);
