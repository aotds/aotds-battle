// @format

import _ from 'lodash';
import u from 'updeep';

import { Middleware } from 'redux';

export const timestamp: Middleware = () => next => action =>
    next(u.updateIn('meta.timestamp', new Date().toISOString(), action));
