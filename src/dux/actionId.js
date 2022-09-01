import { action, Updux } from 'updux';
import u from 'updeep';

export const dux = new Updux({
	initial: 1,
	selectors: {
		getNextActionId: (state) => state,
	},
	actions: {
		incActionId: action(
			'incActionId',
			() => null,
			u.updateIn('meta.noLog', true),
		),
		setActionId: action(
			'setActionId',
			(id) => id,
			u.updateIn('meta.noLog', true),
		),
	},
	mutations: {
		incActionId: () => (x) => x + 1,
		setActionId: (id) => () => id,
	},
});

export const addActionIdEffect = (api) => (next) => (action) => {
	if (action.meta?.noLog) return next(action);

	// we don't want an infinite loop, do we?
	if (action.type === 'incActionId') return next(action);

	const actionId = api.getState.getNextActionId();
	api.dispatch(dux.actions.incActionId());

	return next(u({ meta: { actionId } }, action));
};
//dux.addEffect( '*', addActionId );

export const middlewareWrapper = (middlewares) => [addActionId, ...middlewares];
