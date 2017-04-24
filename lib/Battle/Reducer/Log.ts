export default function LogReducer(state=[], action ) {
    return [ ...state, action ];
}
