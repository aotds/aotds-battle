import fp from 'lodash/fp';
import u from 'updeep';
import { LogState, LogAction } from '../store/log/reducer/types';

function scrub_timestamps(log: LogState) {
    return u.map(
        {
            meta: u.omit(['timestamp']),
            subactions: u.if(u.identity, scrub_timestamps),
        },
        log,
    );
}

export const without_ts = u({ log: scrub_timestamps });
