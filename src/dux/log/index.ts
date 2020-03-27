import { dux } from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';

type Action = {
    type: string;
    meta: {
        timestamp: string;
        action_id?: number;
        parent_actions?: number[];
        no_log?: boolean;
    };
};

type LogAction = {
    meta: {
        action_id: number;
    };
    subactions?: LogAction[];
};

type LogState = LogAction[];

function addSubaction(log: LogState = [], action: LogAction, parents: number[] = []) {
    const [id, ...rest] = parents;

    if (!id) return [...log, action];

    if (log.length === 0) return [action];

    return u.map(
        u.if(
            (log: LogAction) => log.meta?.action_id === id,
            u({ subactions: (subs: LogState) => addSubaction(subs, action, rest) }),
        ),
        log,
    );
}

const logDux = dux({
    initial: [] as LogState,
    mutations: {
        '*': (payload, action: Action) => log => {
            // can't be caught by the middleware
            if (/@@/.test(action.type)) return log;

            if (action.meta?.no_log) return log;

            if (!action.meta?.action_id) return log;

            return addSubaction(log, fp.omit('meta.parent_actions', action) as LogAction, action.meta?.parent_actions);
        },
    },
});

export default logDux;
