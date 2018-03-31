import fp from 'lodash/fp';
import u from 'updeep';

export
function actions_reducer( redactions, initial_state = {} ) {
    return function( state = initial_state, action ) {
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

