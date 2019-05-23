import _ from 'lodash';
import u from 'updeep';
import { LogState, LogAction } from './types';

export function log_reducer(
    state: LogState = [],
    action: LogAction
): LogState {

    // can't be caught by the middleware
    if( /@@/.test( action.type ) ) return state;

    if( _.get( action, 'meta.no_log' ) ) return state;

    return [ ...state, action ];
}

export default log_reducer;
