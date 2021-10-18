import { Updux } from 'updux';
import u from 'updeep';

export const dux = new Updux({
	initial: {
		name: '',
		id: '',
		orders: null,
	},
	actions: {
		setOrders: (bogeyId, orders) => ({ bogeyId, orders }),
	},
});

dux.setMutation('setOrders', ({ orders }) => u({ orders: u.constant(orders) }));
