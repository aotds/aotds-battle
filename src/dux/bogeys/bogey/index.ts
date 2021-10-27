import u from 'updeep';
import { defaults } from 'lodash/fp';

import { BattleDux } from '../../../BattleDux';
import drive from './drive';
import weaponry from './weaponry';
import navigation from './navigation';

export const dux = new BattleDux({
	initial: {
		name: '',
		orders: null,
	},
	actions: {
		setOrders: (bogeyId, orders) => ({ bogeyId, orders }),
	},
	subduxes: { drive, weaponry, navigation },
});

export default dux;

dux.setMutation('setOrders', ({ orders }) => u({ orders: u.constant(orders) }));

dux.setInflator((shorthand) => dux.subInflate(defaults(shorthand, { id: shorthand.name }))

);
