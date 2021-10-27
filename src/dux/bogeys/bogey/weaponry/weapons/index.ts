import u from 'updeep';
import { BattleDux } from '../../../../../BattleDux';
import { Updux } from 'updux';

export const dux = new BattleDux({
	actions: {
		bogeyWeaponsOrders: (bogeyId: string, orders) => ({ bogeyId, orders }),
	},
	subduxes: {},
});

export default dux;

dux.setMutation('bogeyWeaponsOrders', ({ orders }) => u(orders));

dux.setInflator((shorthand) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand.map((obj = {}, id) => [id + 1, { ...obj, id: id + 1 }]),
	);
});
