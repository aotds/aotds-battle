import { put } from 'redux-saga/effects';

import { execute_firecon_orders } from '../weapons';
import { subactions } from './utils';
import { actions } from '~/actions';

function* inner_play_turn() {
    yield* [
        'movement_phase',
        'execute_firecon_orders',
        'assign_weapons_to_firecons',
        'execute_firecon_orders',
        'fire_weapons',
        'clear_orders',
    ].map( a => actions[a]() ).map( a => put(a) );
}

export function* play_turn(action) {

    if( !action.force ) {
        let not_done = yield( select( players, { not_done: true } ) );
        if(!not_done.length) return;

        let active = yield( select( players, { active: true } ) );
        if(active.length <= 1) return;
    }

    yield* subactions(action, inner_play_turn );

}
