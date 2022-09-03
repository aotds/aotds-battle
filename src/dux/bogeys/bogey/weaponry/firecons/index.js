import u from 'updeep';
import R from 'remeda';
import { BDux } from '../../../../../BDux.js';
import { matches } from '../../../../../utils.js';

const schema = {
	$defs: {
		firecon: {
			type: 'object',
			properties: {
				id: { type: 'number' },
				targetId: { type: 'string' },
			},
		},
	},
	type: 'array',
	items: {
		$ref: '#/defs/firecon',
	},
	default: [],
};

export const dux = new BDux({
	initial: [],
	schema,
	actions: {
		bogeyFireconsOrders: (bogeyId, fireconId, orders) => ({
			bogeyId,
			fireconId,
			orders,
		}),
		clearOrders: null,
	},
});

export default dux;

dux.setMutation('bogeyFireconsOrders', ({ fireconId, orders }) =>
	u.map(u.if(matches({ id: fireconId }), orders)),
);

dux.setMutation('clearOrders', () => u.map({ targetId: u.omitted }));

dux.setInflator((shorthand = 0) => {
	if (typeof shorthand === 'object') return shorthand;

	return R.range(1, shorthand + 1).map((id) => ({ id }));
});
