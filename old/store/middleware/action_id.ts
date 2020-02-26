import _ from 'lodash';
import u from 'updeep';

import { Middleware } from 'redux';

function max_id(log:any[]): number {
    const entry = _.last(log);
    if(!entry) return 0;

    if(!entry.subactions) return entry.meta.action_id;

    return max_id(entry.subactions);
}

export function action_id_mw_gen(): Middleware {
    let next_id: number = 0;

    return ({getState}) => next => action => {
        if(!next_id) {
            next_id = 1 + max_id( _.get( getState(), 'log', [] ) );
        }
        next(u.updateIn('meta.action_id',next_id++, action));
    };
}
