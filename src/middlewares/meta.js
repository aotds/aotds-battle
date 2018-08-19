import u from 'updeep';
import _ from 'lodash';

import { inc_action_id, INC_ACTION_ID,
    push_action_stack,
    pop_action_stack 
} from '~/actions';

export
const add_timestamp = ( (store,next,action) =>
    next(u.updateIn('meta.timestamp', (new Date()).toISOString(), action))
) |> _.curry;


export 
const add_action_id = function({getState, dispatch},next,action) {

    if( action.type === INC_ACTION_ID ) return next(action);

    let id = _.get( getState(), 'game.next_action_id' );

    dispatch( inc_action_id() );

    return next(
        u.if( id, u.updateIn( 'meta.id', id ))(action)
    );
} |> _.curry;


export const add_parent_action = function({getState},next,action){
    let parent_action_id =_.get( getState(), 'game.action_stack.0' );

    return next( u.if(parent_action_id,
        u.updateIn('meta.parent_action_id',parent_action_id)
    )(action));

} |> _.curry;

export function subactions(dispatch,action,inner) {
    let parent_id = _.get(action,'meta.id');

    if( !parent_id) return inner();

    dispatch( push_action_stack(parent_id) );
    inner();
    dispatch( pop_action_stack() );
}
