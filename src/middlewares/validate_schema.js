import { ajv } from '~/schemas';

const debug = require('debug')('aotds:mw:validate');

import * as jsondiffpatch from 'jsondiffpatch';


export default ({getState}) => next => action => {
    let previous = getState();

    let result = next(action);

    let current = getState();
    let valid = ajv.validate({
        '$ref': 'http://aotds.babyl.ca/battle/game'
    }, current );

    if ( valid ) return;

    debug( 'action: %j', action );
    debug( ajv.errors );
    debug( jsondiffpatch.console.format( 
        jsondiffpatch.diff(previous, current)
    ) );

    throw new Error( `action ${action.type} caused state to become invalid` );
};
