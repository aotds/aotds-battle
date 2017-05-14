export default function LogReducer(state=[], action ) {

    switch (action.type ) {
        case '@@redux/INIT': return state;

        default: return [ ...state, action ];
    }
}
