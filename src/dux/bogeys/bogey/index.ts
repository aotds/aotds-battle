import u from 'updeep';
import  defaults  from 'lodash/fp/defaults.js';

import { BattleDux } from '../../../BattleDux.js';
import drive from './drive/index.js';
import weaponry from './weaponry/index.js';
import navigation from './navigation/index.js';
import structure from './structure/index.js';

type Orders = {
	navigation?: {
		thrust: number;
		bank: number;
		turn: number;
	};
	firecons?: Record<string, { targetId?: string | null }>;
	weapons?: Record<string, { fireconId?: number | null }>;
};

export const dux = new BattleDux({
	initial: {
		name: '',
		orders: {} as Orders,
	},
	actions: {
		setOrders: (bogeyId: string, orders: Orders) => ({ bogeyId, orders }),
	},
	subduxes: { drive, weaponry, navigation, structure },
});

dux.initial.drive;

export default dux;

dux.setImmerMutation('setOrders', (draft, { orders }, action) => {
	draft.orders = orders;
});

dux.setImmerMutation('clearOrders', (draft) => {
	draft.orders = {};
});

dux.setInflator((shorthand) =>
	dux.subInflate(defaults(shorthand, { id: shorthand.name })),
);
