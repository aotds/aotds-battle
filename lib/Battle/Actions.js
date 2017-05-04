import { createAction, createActions } from 'redux-actions';

import Actioner from 'actioner';

let actions = new Actioner({ 
    schema_id: 'http://aotds.babyl.ca/battle/actions',
    validate: true 
});

actions._add( 'init_game', {
    additionalProperties: false,
    object: {
        name: 'string',
        objects: {
            array: {}
        },
    },
});

export default actions;
