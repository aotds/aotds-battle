import { createAction, createActions } from 'redux-actions';

import Actioner from '../actioner';

import { validate, actions } from './schema';

let actioner = new Actioner({ 
    validate: (action,schema) => action::validate( '/action/' + action.type.toLowerCase() ),
});

Object.keys( actions ).forEach( action => actioner.$add(action) );
// {
//     additionalProperties: false,
//     object: {
//         name: 'string',
//         objects: {
//             array: {}
//         },
//     },
// });

export default actioner;
