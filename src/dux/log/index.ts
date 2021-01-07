import Updux from 'updux';
import fp from 'lodash/fp';
import u from '@yanick/updeep';

function addSubaction(log: any[] = [], action: any, parents: string[] = []) {
    const [id, ...rest] = parents;

    if (!id) return [...log, action];

    if (log.length === 0) return [action];

    return u.map(
        u.if(
            (log: any) => log.meta?.action_id === id,
            u({ subactions: (subs: any[] | undefined) => addSubaction(subs, action, rest) }),
        ),
        log,
    );
}

type LogEntry = {
    type: string,
    meta: {
        parent_actions: number[],
        action_id: number;
    }
};

type HierarchicalLogEntry = LogEntry & {
    subactions: HierarchicalLogEntry[]
}


export function hierarchical_log(log: LogEntry[]) {

    const hier : HierarchicalLogEntry[] = [];

    for (const entry of log) {
        const parents = entry!.meta.parent_actions || [];
        let local_log = hier;
        for (const id of parents) {
            local_log = local_log.find(entry => entry.meta!.action_id === id)!.subactions;
        }

        local_log.push({ ...entry, subactions: [] });
    }

    return hier;
}

const logDux = new Updux({
    initial: [],
    mutations: {
        '*': (_payload: unknown, action: { type: string; meta?: { no_log?: boolean } }) => log => {
            // can't be caught by the middleware
            if (/@@/.test(action.type)) return log;

            if (action.meta?.no_log) return log;

            return [...log, action];
        },
    },
});

export default logDux.asDux;
