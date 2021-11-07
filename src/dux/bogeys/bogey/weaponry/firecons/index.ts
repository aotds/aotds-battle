import u from 'updeep';
import { BattleDux } from '../../../../../BattleDux';
import { Updux } from 'updux';

import { range } from 'lodash';

export const dux = new BattleDux({
	actions: {
		bogeyFireconsOrders: (bogeyId: string, orders) => ({ bogeyId, orders }),
		clearOrders: () => {},
	},
	subduxes: {},
});

export default dux;

dux.setMutation('bogeyFireconsOrders', ({ orders }) => u(orders));

dux.setImmerMutation('clearOrders', (draft) => {
	Object.values(draft).forEach((firecon) => delete firecon.targetId);
});

dux.setInflator((shorthand = 0) => {
	if (typeof shorthand === 'object') return shorthand;

	return Object.fromEntries(
		range(1, shorthand + 1).map((id) => [
			id,
			{
				id,
			},
		]),
	);
});
