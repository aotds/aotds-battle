import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { inc_action_id, INC_ACTION_ID,
    PUSH_ACTION_STACK,
    POP_ACTION_STACK,
    push_action_stack,
    pop_action_stack 
} from '~/actions';

export
const add_timestamp = ( (store,next,action) =>
    next(u.updateIn('meta.timestamp', (new Date()).toISOString(), action))
) |> _.curry;


export 
const add_action_id = () => {
    let _id;

    const next_id = (getState) => {
        if( !_id ) {
            _id = ( getState() |> fp.get('log') |> fp.map( 'meta.id' ) 
                |> fp.filter(_.identity) |> fp.max ) || 0;
        }

        return ++_id;
    };
    
    return function ({getState, dispatch}, next, action ) {
        if( action.type === INC_ACTION_ID ) return next(action);

        return next(
            u.updateIn( 'meta.id', next_id(getState) )(action)
        );
    } |> _.curry;
};


export const add_parent_action = () => {

    let stack = [];

    return function({getState},next,action){

        if( action.type === PUSH_ACTION_STACK ) {
            stack.unshift( action.action_id );
            return;
        }

        if( action.type === POP_ACTION_STACK ) {
            stack.shift();
            return;
        }

        const add_parent_id = u.if(stack.length,
            u.updateIn('meta.parent_action_id',stack[0])
        );


        return next( add_parent_id(action) );

    } |> _.curry 
};

export function subactions(dispatch,action,inner) {
    let parent_id = _.get(action,'meta.id');

    if( !parent_id) return inner();

    dispatch( push_action_stack(parent_id) );
    inner();
    dispatch( pop_action_stack() );
}
