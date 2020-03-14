import fp from 'lodash/fp';
import u from 'updeep';

export default mw => api => next => action => {
    const parent_actions = [...fp.getOr([], 'meta.parent_actions', action), fp.get('meta.action_id', action)];
    next(action);
    const dispatch = action => api.dispatch(u.updateIn('meta', { parent_actions }, action));
    return mw({ ...api, dispatch })(action);
};

