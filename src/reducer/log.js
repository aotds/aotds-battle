import actions from '../actions';

const unwanted_actions = [
    '@@redux/INIT'
];

export default function log_reducer(state=[],action) {
    if ( unwanted_actions.some( a => action.type == a ) ) return state;

    switch( action.type ) {
        case(actions.PLAY_TURN):
            return [action];

        default:
            return state.concat( action );
    }

}
