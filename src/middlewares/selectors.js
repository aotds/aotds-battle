import _ from 'lodash';
import fp from 'lodash/fp';

const debug = require('debug')('aotds:mw:selector');

export const get_object_by_id = ( store, id ) => _.find( store.objects, { id } );

export function active_players(state) {
    return fp.reject( { status: 'inactive' } )( state.game.players );
};

export function players_not_done( state ) {
    let players = _.get( state, 'game.players', [] );

    const with_player = fp.filter('player_id' );
    const not_ready   = fp.reject( [ 'orders.done', true ] );

    let obj_not_ready = not_ready( with_player( state.objects ) );

    let players_not_ready = fp.map('player_id')(obj_not_ready);

    const player_not_ready = fp.filter( p =>_.includes(players_not_ready,p.id));

    return fp.map('id')(
        player_not_ready( active_players(state) )
    );

}

