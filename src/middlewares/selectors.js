import _ from 'lodash';

const debug = require('debug')('aotds:mw:selector');

export const get_object_by_id = ( store, id ) => _.find( store.objects, { id } );

export function players_not_done( state ) {
    let players = _.get( state, 'game.players', [] );

    const with_player = col => _.filter( col, 'player_id' );
    const not_ready   = col => _.reject( col, [ 'orders.done', true ] );

    let obj_not_ready = not_ready( with_player( state.objects ) );

    let players_not_ready = _.map( obj_not_ready, 'player_id' );
    const is_not_ready = p => _.includes(players_not_ready,p.id)
    const active_players = players => _.reject( players, { status: 'inactive' } );

    players_not_ready = _.filter( 
        active_players(state.game.players),
        is_not_ready 
    );

    return _.map( players_not_ready, 'id' );
}

