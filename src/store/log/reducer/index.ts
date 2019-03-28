import _ from 'lodash';
import u from 'updeep';
import { LogState, LogAction } from './types';

const to_ignore = [ '@@redux/INIT', '@@INIT' ];

export function log_reducer(
    state: LogState = [],
    action: LogAction
): LogState {

    // can't be caught by the middleware
    if( to_ignore.includes( action.type ) ) return state;

    if( _.get( action, 'meta.no_log' ) ) return state;

    const level = _.get(action, 'meta.subaction_level' );

    if(!level) return [ ...state, _.omit( action, ['meta','subaction_level'] ) ];

    return u({
        [state.length-1]: u({
            subactions: ( subs: LogState ) =>
                log_reducer( subs, u.updateIn('meta.subaction_level', ( x: number ) => x -1, action ) )
        })
    }, state) as LogState;

}

export default log_reducer;
