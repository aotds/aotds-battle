import _ from 'lodash';
import u from 'updeep';
import { LogState, LogAction } from './types';

function add_subaction( log: LogState = [], action: LogAction, parents: number[] = []) {
    const [ id, ...rest ] = parents;

    if( log.length === 0 ) return [ action ];

    if(!id) return [ ...log, action ];

    return u.map(
        u.if( (log:LogAction) => log.meta && ( log.meta.action_id === id ),
             u( { subactions: (subs:LogState) => add_subaction( subs, action, rest )
        }
            )
            )
    )(log)
}

export function log_reducer(
    state: LogState = [],
    action: LogAction
): LogState {

    // can't be caught by the middleware
    if( /@@/.test( action.type ) ) return state;

    if( _.get( action, 'meta.no_log' ) ) return state;

    if( !action.meta || !action.meta.parent_ids ) return [ ...state, action ];

    return add_subaction(
        state, _.omit( action, 'meta.parent_ids' ) as LogAction,
            action.meta.parent_ids as number[]
    );

}

export default log_reducer;
