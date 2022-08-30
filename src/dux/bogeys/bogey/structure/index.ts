import { BattleDux } from '~/BattleDux.js';
import  ceil  from 'lodash/fp/ceil.js';

import hull from './hull/index.js';
import armor from './armor/index.js';

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
