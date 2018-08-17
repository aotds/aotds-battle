import _ from 'lodash';
import { push_action_stack, pop_action_stack } from '~/actions';

export const mw_for = ( function( target, inner ) {
    console.log("here");
    return _.curry( function(store,next,action) {
        let func = next;

        if( action.type === target ) {
            func = inner(store)(next);
        }

        return func(action);
    });
} ) |> _.curry;

export const subactions = ( (inner, store, next, action) => {
    
    next(action);

    let parent_id = _.get(action,'meta.id');

    if (parent_id) store.dispatch( push_action_stack(parent_id) );

    inner(store)(next)(action);

    if (parent_id) store.dispatch( pop_action_stack() );
} ) |> _.curry;

export const mw_compose = ( ( mws, store, next) => 
    mws.reduceRight( (next,mw) => mw(store)(next), next )
) |> _.curry;
