import Updux from 'updux';
import { LogState, LogAction } from './reducer/types';
import fp from 'lodash/fp';
import u from 'updeep';

const ignore_types = [ 'TRY_PLAY_TURN' ];

const updux = new Updux({
    initial: [],
    mutations: {
        '*': (p, action) => state => {
            // can't be caught by the middleware
            if (/@@/.test(action.type)) return state;

            if (fp.get('meta.no_log',action)) return state;

            if( ignore_types.indexOf( action.type ) > -1 ) return state;

            if (!action.meta || !action.meta.parent_ids) return [...state, action];

            return add_subaction(
                state,
                fp.omit('meta.parent_ids',action) as LogAction,
                action.meta.parent_ids as number[],
            );
        },
    },
});

function add_subaction(log: LogState = [], action: LogAction, parents: number[] = []) {
    const [id, ...rest] = parents;

    if (log.length === 0) return [action];

    if (!id) return [...log, action];

    return u.map(
        u.if(
            (log: LogAction) => log.meta && log.meta.action_id === id,
            u({ subactions: (subs: LogState) => add_subaction(subs, action, rest) }),
        ),
    )(log);
}

export default updux;
