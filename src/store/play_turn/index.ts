import Updux from 'updux';

import {
    play_turn,
    movement_phase,
    firecons_order_phase,
    weapons_order_phase,
    weapons_firing_phase,
    clear_orders,
} from './actions';

const dux = new Updux();

dux.addEffect(
    play_turn,
    subactions(({ dispatch }) => next => action => {
        [movement_phase, firecons_order_phase, weapons_order_phase, weapons_firing_phase, clear_orders].forEach(
            action => dispatch(action()),
        );
    }),
);
