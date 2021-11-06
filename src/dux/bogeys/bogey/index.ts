import u from 'updeep';
import { defaults } from 'lodash/fp';

import { BattleDux } from '../../../BattleDux';
import drive from './drive';
import weaponry from './weaponry';
import navigation from './navigation';
import structure from './structure';

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

dux.setInflator((shorthand) =>
	dux.subInflate(defaults(shorthand, { id: shorthand.name })),
);
