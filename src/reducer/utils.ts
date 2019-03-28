// @format

import u from 'updeep';
import { Action } from 'redux';

export const combineUpReducers = (updates: {}) => (action: Action) => u(u.map((upr: any) => upr(action), updates));
