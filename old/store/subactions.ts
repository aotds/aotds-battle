import { Middleware, Dispatch, Action } from 'redux';
import fp from 'lodash/fp';
import u from 'updeep';

function subaction_dispatch(action: Action, dispatch: Dispatch): Dispatch {
	const parents = [
		...fp.getOr([], 'meta.parent_ids', action),
		fp.get('meta.action_id', action),
	];

	return (action) => dispatch(u.updateIn('meta.parent_ids', parents, action));
}

export default function subactions(mw: Middleware) {
	return (api) => (next) => (action) => {
		next(action);

		return mw({
			...api,
			dispatch: subaction_dispatch(action, api.dispatch) as any,
		})(next)(action);
	};
}
