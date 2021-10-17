// @format

import u from 'updeep';
import _ from 'lodash';
import { Action } from 'redux';

export const combineUpReducers = (updates: any) => (action: Action) => {
	if (_.isFunction(updates)) {
		return updates(action);
	}

	if (_.isObject(updates)) {
		return u(u.map((i: any) => combineUpReducers(i)(action))(updates));
	}
};
