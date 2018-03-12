import actions from '../actions';

const unwanted_actions = [
    '@@redux/INIT'
];

export default function log_reducer(state=[],action) {
    if ( unwanted_actions.some( a => action.type == a ) ) return state;

    return state.concat( action );
}
