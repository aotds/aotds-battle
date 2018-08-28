import _ from 'lodash';
import fp from 'lodash/fp';

const debug = require('debug')('aotds:mw:selector');

export function select( func, ...args ) {
    return func(...args)
}

export const get_bogeys = () => _.flow([
    fp.getOr({})('bogeys'),
    fp.values,
]);

export const get_bogey = id => fp.flow([
    fp.getOr([],'bogeys'),
    fp.find({ id })
]);

export function get_active_players(state) {
    return fp.reject( { status: 'inactive' } )( state.game.players );
};

export function get_players_not_done( state ) {
    let active_players = get_active_players(state);

    // all bogeys not done 
    let players_not_done = state 
        |> fp.get('bogeys')
        |> fp.reject('orders.done')
        |> fp.map('player_id')
        |> fp.uniq;

    return active_players |> fp.filter( p => _.includes(players_not_done,p.id) );
}

