import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';

import { types } from '../actions';

const assertAction = {
    set( object, prop, value ) {

        if( prop !== '*' && ! _.includes(types,prop) )
            throw new Error( `${prop} is not a known action` );

        return Reflect.set(...arguments);
    }
};

export const redactor = () => new Proxy({}, assertAction);

export
function actions_reducer( redactions, initial_state = {} ) {
    return function( state = initial_state, action ) {
        if(!_.get(action,'type')) {
            throw new Error( `action has no type? ${JSON.stringify(action,null,2)}, state: ${JSON.stringify(state,null,2)}` );
        }

        let red = redactions[action.type] || redactions['*'];
        return red ? red(action)(state) : state;
    }
}

const debug = require('debug')('aotds:debug');

export
function combine_reducers( reducers ) {
    // first let's get the recursivity out of the way
    reducers = fp.mapValues( red => {
        return fp.isObjectLike(red) ? combine_reducers(red) : red
    }
    )(reducers);

    return (state,action) => {
        let r = fp.mapValues( function(red) { return s => {
            return red(s,action) } } )(reducers);
        return u(r)(state);
    }
}

export
function pipe_reducers( reducers ) {

    return reducers.reduceRight(
        ( accum, reducer ) => (state,action) => {
            return accum( reducer(state,action), action )
        }
    );

}

export const init_reducer = (original_state) => 
    ( state ) => fp.isNil(state) ? original_state : state;

// condition signature: action => state => boolean
// condition can be a boolean too
export const mapping_reducer = reducer => cond => action => u.map( u.if( 
    (typeof cond === 'function' ? cond(action) : cond ),  
    state => reducer(state,action)
) )


