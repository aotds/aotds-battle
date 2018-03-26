
export
function actions_reducer( redactions, initial_state = {} ) {
    return function( state = initial_state, action ) {
        let red = redactions[action.type] || redactions['*'];
        return red ? red(action)(state) : state;
    }
}
