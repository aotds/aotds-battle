import { actions, PLAY_TURN } from '~/actions';

import { get_active_players, get_players_not_done } from './selectors';
import { mw_compose, mw_for, subactions } from './utils';


const can_play_turn = ({getState}) => next => action => {
    console.log("!",action);
    if( !action.force ) {
        let state = getState();
        let not_done = get_players_not_done(state);
        if(not_done.length) return;

        let active = get_active_players(state);

        if(active.length <= 1) return;
    }

    next(action);
};

const play_inner = ({dispatch}) => next => action => [
            'movement_phase',
            'execute_firecon_orders',
            'assign_weapons_to_firecons',
            'execute_firecon_orders',
            'fire_weapons',
            'clear_orders',
    ].map( a => dispatch( actions[a]() ) ); 

export default mw_for( PLAY_TURN,
   [ can_play_turn, subactions(play_inner) ] |> mw_compose 
);
