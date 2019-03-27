import { takeEvery, put } from 'redux-saga/effects'

import { clear_orders, movement_phase, firecons_order_phase, weapons_order_phase, weapons_firing_phase, play_turn } from "../actions/phases";

export function *play_steps() {
    yield* [
        movement_phase(),
        firecons_order_phase(),
        weapons_order_phase(),
        weapons_firing_phase(),
        clear_orders(),
    ].map( action => put(action) )
}

export default function*() {
    yield takeEvery( play_turn.type, play_steps );
}
