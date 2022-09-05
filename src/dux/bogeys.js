import u from 'updeep';

import { BDux } from '../BDux';
import { matches } from '../utils';

export const bogeysDux = new BDux({
	initial: [],
	actions: {
		addBogeys: (bogeys) => bogeys,
		addBogey: (bogey) => bogey,
	},
});

bogeysDux.addSubactions('addBogeys', ({ dispatch }) => (action) => {
	action.payload.forEach(dispatch.addBogey);
});

bogeysDux.setMutation('addBogey', (bogey) => (state) => {
	let id = bogey.name.toLowerCase();

	// ensure the id is unique
	while (state.find(matches({ id }))) {
		id = /-\d+$/.test(id)
			? id.replace(/\d+$/, (n) => 1 + parseInt(n))
			: id + '-1';
	}

	return [...state, u({ id }, bogey)];
});

export default bogeysDux;
