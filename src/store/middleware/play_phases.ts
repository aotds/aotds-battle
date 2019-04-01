import { clear_orders, movement_phase, firecons_order_phase, weapons_order_phase, weapons_firing_phase, play_turn, try_play_turn } from "../actions/phases";
import { Middleware } from 'redux';
import { mw_for, mw_compose } from "../../middleware/utils";
import { get_players_not_done, get_active_players } from "../selectors/index";

export const play_steps :Middleware = ({dispatch}) => (next) => () => {
    [
        movement_phase(),
        firecons_order_phase(),
        weapons_order_phase(),
        weapons_firing_phase(),
        clear_orders(),
    ].forEach( action => dispatch(action) )
}

export const mw_try_play_turn :Middleware = ({getState,dispatch}) => (next) => (action) => {
    if(!action.payload.force) {
        let state = getState();

        // any player not done? can't play turn
        let not_done = get_players_not_done(state);

        if(not_done.length) return;

        // don't play a turn if there's only 1 player left
        let active = get_active_players(state);

        if(active.length <= 1) return;
    }

    next(action);

    dispatch(play_turn());
}

export default mw_compose([
    mw_for( play_turn, play_steps ),
    mw_for( try_play_turn, mw_try_play_turn ),
]);
