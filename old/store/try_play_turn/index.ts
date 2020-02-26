import Updux from 'updux';
import oc from 'ts-optchain';

import { try_play_turn } from './actions';

const dux = new Updux();

export function readyForNextTurn({ force, getPlayersNotDone, getActivePlayers }) {
    if (force) return true;

    // any player not done? can't play turn
    if (getPlayersNotDone().length > 0) return false;

    // don't play a turn if there's only 1 player left
    if (getActivePlayers().length < 2) return false;

    return true;
}

dux.addEffect(try_play_turn, ({ getState, dispatch }) => next => action => {
    if (
        !readyForNextTurn({
            force: action.payload.force,
            ...getState,
        } as any)
    )
        return;

    next(action);

    dispatch.play_turn();
});

export default dux;
