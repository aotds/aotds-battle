import { createAction, createActions } from 'redux-actions';

import Actioner from '../actioner';

import { validate, actions } from './schema';

let actioner = new Actioner();

actioner.add( 'foo' );

let actions = actioner.actions(store);

actions.FOO;
actions.foo({ 'this': 1 });
actions.dispatch_foo( );

actioner.add( 'move_stuff', 



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
