import { ajv } from '~/schemas';

export default ({getState}) => next => action => {
    let result = next(action);

    let valid = ajv.validate({
        '$ref': 'http://aotds.babyl.ca/battle/game'
    }, getState() );

    if ( valid ) return;

    throw new Error( `action ${JSON.stringify(action,null,2)} caused state to become invalid: ${JSON.stringify(ajv.errors,null,2)}` );
};
