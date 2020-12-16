import fp from 'lodash/fp';

export const getActivePlayers = state => {
    return fp.uniq(state.map(({ player_id }) => player_id).filter(i => i));
};

export const getBogeysWaitingOrders = state => {
    return state.filter(({ orders }) => !orders?.done).map(({ id }) => id);
};

export function readyForNextTurn(state) {
    // any bogey waiting for orders? can't play turn
    if (getBogeysWaitingOrders(state).length > 0) return false;

    // don't play a turn if there's only 1 player left
    if (getActivePlayers(state).length <= 1) return false;

    return true;
}

export const getBogey = state => id => fp.find({ id }, state);
