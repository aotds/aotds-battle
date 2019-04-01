import _ from 'lodash';
import fp from 'lodash/fp';

import { BattleState } from "../types";

export function get_active_players(state: BattleState): string[] {
    return _(state.game.players).reject( 'inactive' ).map( 'id' ).value();
};

export function get_players_not_done( state: BattleState ): string[] {
    let active_players = get_active_players(state);

    // all bogeys not done
    let players_not_done = fp.flow([
        fp.get('bogeys'),
        fp.reject('orders.done'),
        fp.map('player_id'),
        fp.uniq
    ])(state)

    return _.intersection( players_not_done, active_players );
}
