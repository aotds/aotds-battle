// @flow

export
function actionsHandler(actions : any ,default_state :any ={} ) {
    return function( state : any = default_state, action : any ) {
        const reducer = actions[ action.type ] || actions[ '*' ];

        return reducer ?  reducer(state,action) : state; 
    };
}
