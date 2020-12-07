import { dux } from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';

function addSubaction(log :any[] = [], action: any, parents : string[] = [] ) {
    const [id, ...rest] = parents;

    if (!id) return [...log, action];

    if (log.length === 0) return [action];

    return u.map(
        u.if( (log:any) => log.meta?.action_id === id, u({ subactions: (subs: any[] | undefined) => addSubaction(subs, action, rest) })), log
    );
}

const logDux = dux({
    initial: [],
    mutations: {
        '*': (_payload: any, action: {type: string; meta: {no_log: any; action_id: any; parent_actions: string[] | undefined;};}) => log => {
            // can't be caught by the middleware
            if (/@@/.test(action.type)) return log;

            if (action.meta?.no_log) return log;

            if (!action.meta?.action_id) return log;

            return addSubaction(log, fp.omit('meta.parent_actions', action), action.meta?.parent_actions);
        },
    },
});

export default logDux;
