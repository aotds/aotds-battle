// @format

import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { mw_for } from '../middleware/utils';
import { Middleware } from 'redux';
import { Action, ActionCreator } from '../reducer/types';

export function mw_subactions_for(parent_action: ActionCreator, subactions_mw: Middleware) {
    return mw_for(parent_action, api => next => action => {
        next(action);

        let parents = action.meta.parent_ids || [];
        parents = [...parents, action.meta.id];

        const dispatch = (action: Action) => api.dispatch(u.updateIn('meta.parent_ids', parents, action));

        return subactions_mw({ ...api, dispatch })(next)(action);
    });
}
