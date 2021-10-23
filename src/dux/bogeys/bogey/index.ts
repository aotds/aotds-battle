import u from 'updeep';
import drive from './drive';
import weaponry from './weaponry';
import { BattleDux } from '../../../BattleDux';

export const dux = new BattleDux({
	initial: {
		name: '',
		id: '',
		orders: null,
	},
	actions: {
		setOrders: (bogeyId, orders) => ({ bogeyId, orders }),
	},
	subduxes: { drive, weaponry },
});

dux.setMutation('setOrders', ({ orders }) => u({ orders: u.constant(orders) }));

export default dux;
