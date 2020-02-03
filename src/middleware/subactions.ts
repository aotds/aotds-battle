// @format

import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { mw_for } from '../middleware/utils';
import { Middleware, Dispatch } from 'redux';
import { Action, ActionCreator } from '../reducer/types';

export function mw_subactions_for(parent_action: ActionCreator, subactions_mw: Middleware) {
    return mw_for(parent_action, api => next => action => {
        next(action);

        return subactions_mw({ ...api, dispatch: subaction_dispatch(action, api.dispatch) as any })(next)(action);
    });
}
