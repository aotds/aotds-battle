import { action, Updux } from 'updux';
import u from 'updeep';
import { add } from 'lodash/fp';

const addActionId = (api) => (next) => (action) => {
	if (action.meta?.noLog) return next(action);

	// we don't want an infinite loop, do we?
	if (action.type === 'incActionId') return next(action);

	const id = api.getState.nextActionId();
	api.dispatch.incActionId();

	return next(u.updateIn('meta.actionId', id, action));
};

export const subactionFor = (dux: any) => (action, mw) => {
	dux.addEffect(action, (api) => (next) => (action) => {
		if (action.meta?.noLog) return next(action);
		if (!action.meta?.actionId) return next(action);

		const parentActionId = action.meta?.actionId;

		const localApi = dux.augmentMiddlewareApi({
			...api,
			dispatch: (action) =>
				api.dispatch(u({ meta: { parentActionId } }, action)),
		});

		next(action);

		mw(localApi)(next)(api);
	});
};

export const dux = new Updux({
	initial: {
		nextActionId: 1,
	},
	selectors: {
		nextActionId: (state) => state.nextActionId,
		parentActionId: (state) => state.stack[0],
	},
	actions: {
		incActionId: action(
			'incActionId',
			undefined,
			u.updateIn('meta.noLog', true),
		),
		setActionId: action(
			'setActionId',
			(id: number) => id,
			u.updateIn('meta.noLog', true),
		),
	},
	mutations: {
		incActionId: () => u.updateIn('nextActionId', add(1)),
		setActionId: (id) => u.updateIn('nextActionId', id),
	},
});

export const middlewareWrapper = (middlewares, dux) => [
	dux.effectToMiddleware(addActionId),
	...middlewares,
];
