import { Updux } from 'updux';
import fp from 'lodash/fp.js';
import u from 'updeep';

export function orderedLog(log) {
    let ordered = [...log];

    console.log(ordered);

    ordered.reverse();

    const subactions = {};

    ordered = ordered.map(
        entry => {
            if( subactions[entry.meta.actionId] ) {
                entry = u({ subactions: subactions[entry.meta.actionId] }, entry);
                delete subactions[entry.meta.actionId];
            }

            if( !entry.meta.parentActionId ) return entry;

            if( ! subactions[ entry.meta.parentActionId ] )
                subactions[ entry.meta.parentActionId ] = [];

            subactions[ entry.meta.parentActionId ].unshift(entry);

            return null
        }
    ).filter( x=>x );

    ordered.reverse();

    return ordered;
}

export default new Updux({
    initial: [],
    selectors: {
        orderedLog
    },
    mutations: {
        '+': (_payload, action) => log => {
            // can't be caught by the middleware
            if (/@@/.test(action.type)) return log;

            return [ ...log, action ];
        }
    }

});
