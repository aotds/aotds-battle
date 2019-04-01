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

    const [ direct_parent, ...rest ] = _.get(action, 'meta.parent_actions',[] );

    if(!direct_parent) return [ ...state, _.omit( action, ['meta.parent_actions'] ) ];

    return u.map(
        u.if( (entry: any) => _.get( entry, 'meta.action_id', null ) === direct_parent,
             { subactions: (log_entries: LogState) => log_reducer(log_entries, u.updateIn('meta.parent_actions',rest)(action) ) }
            )
    )( state );

}

export default log_reducer;
