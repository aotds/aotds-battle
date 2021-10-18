import { Updux } from 'updux';
import u from 'updeep';
import { add } from 'lodash/fp';

export default new Updux({
	initial: 1,
	actions: {
		incActionId: null,
	},
	mutations: {
		incActionId: () => add(1),
	},
	effects: {
		'*': ({ dispatch, getState, actions }) => (next) => (action) => {
			// we don't want an infinite loop, do we?
			if (action.type === 'incActionId') return next(action);

			const id = getState();
			dispatch(u.updateIn('meta.noLog', true, actions.incActionId()));

			return next(u.updateIn('meta.actionId', id, action));
		},
	},
});
