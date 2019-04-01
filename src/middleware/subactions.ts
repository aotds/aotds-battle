// @format

import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { mw_for } from '../middleware/utils';
import { Middleware } from 'redux';
import { Action, ActionCreator } from '../reducer/types';

export function subactions_mw_for(parent_action: ActionCreator, subactions_mw: Middleware) {
    return mw_for(parent_action, api => next => action => {
        next(action);

        const parent_actions = _.flatten([_.get(action, 'meta.parent_actions', []), _.get(action, 'meta.action_id')]);

        let dispatch = fp.flow([u.updateIn('meta.parent_actions', parent_actions), api.dispatch]);

        return subactions_mw({ ...api, dispatch })(next)(action);
    });
}
