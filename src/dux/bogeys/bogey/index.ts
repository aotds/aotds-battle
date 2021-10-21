import { Updux } from 'updux';
import u from 'updeep';
import * as drive from './drive';

export const dux = new Updux({
	initial: {
		name: '',
		id: '',
		orders: null,
	},
	actions: {
		setOrders: (bogeyId, orders) => ({ bogeyId, orders }),
	},
    subduxes: { drive: drive.dux },
});

dux.setMutation('setOrders', ({ orders }) => u({ orders: u.constant(orders) }));

export function inflate(shorthand) {
    return u({drive: drive.inflate},shorthand)
}
