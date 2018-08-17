import _ from 'lodash';
import u from 'updeep';

import actions, { INC_ACTION_ID } from '../actions';

const unwanted_actions = [
    '@@redux/INIT',
    INC_ACTION_ID
];

const _log_reduce = function( action, parents, state ) {
    let id = _.head(parents);

    if( !id ) {
        return [ ...state, action ];
    };

    return u.map(
        u.if( u.is( 'meta.id', id ), 
            u({ 
                meta: { 
                    child_actions: 
                        s => _log_reduce(action,_.tail(parents),s||[])
                }
            })
        )
    )(state);

} |> _.curry; 

const add_tree_branch = ( (parent_id,action,root) => {

    if( _.get(root, 'meta.id') === parent_id ) {
        return u.updateIn(
            'meta.child_actions', s => s ? [...s,action] : [action]
        )(root);
    }

    let i = root.meta.child_actions.length - 1;

    return u.updateIn(
        `meta.child_actions.${i}`, add_tree_branch(parent_id,action)
    )(root);

} ) |> _.curry;

export function tree_log(log) {
    let tree = [];

    log.forEach( l => {
        const parent_id = _.get(l,'meta.parent_action_id');

        if( !parent_id  ) {
            tree = u( t => [...t,l] )(tree);
        }
        else {
            tree = u.updateIn( tree.length-1, add_tree_branch(parent_id,l) )(tree)
        }
    })

    return tree;
}

export default function log_reducer(state=[],action) {
    if ( _.includes( unwanted_actions, action.type ) ) return state;

    const parent_id = _.get(action,'meta.parent_action_id');

    if( !parent_id  ) return [ ...state, action ];

    return u.updateIn( state.length-1, add_tree_branch(parent_id, action ) )(state)
}
