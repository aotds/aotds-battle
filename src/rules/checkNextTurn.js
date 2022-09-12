import R from 'remeda';

function checkTurn0(getState,dispatch) {
        const players = R.mapValues(
            getState().game.players, () => false
        );

        if( Object.keys(players).length === 0 ) return;

        getState().bogeys.forEach( ({player}) => {
            if( player ) players[player] = true;
        });

        if( Object.values(players).every( x => x ) )
            dispatch.playNextTurn();
}

export const checkNextTurn = ({getState,dispatch}) => next => action => {
    next(action);

    // if turn 0, we have players *and* ships for each of them
    if( getState().game.turn === 0 )
        return checkTurn0(getState,dispatch);

    // for next turns, all active bogeys have orders
    if( getState.activeBogeys().every(
        bogey => bogey.orders.length > 0
    ) ) dispatch.playNextTurn();
}
