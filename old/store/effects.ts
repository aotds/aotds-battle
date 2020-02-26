import {
    play_turn,
    movement_phase,
    firecons_order_phase,
    weapons_order_phase,
    weapons_firing_phase,
    clear_orders,
} from './actions/phases';
import Updux from 'updux';
import subactions from './subactions';
import { bogey_movement } from '../actions/bogey';
import { plot_movement } from '../rules/movement';

export default function addEffect(updux: Updux) {
    updux.addEffect(
        play_turn,
        subactions(({ dispatch }) => next => () => {
            [
                movement_phase,
                firecons_order_phase,
                weapons_order_phase,
                weapons_firing_phase,
                clear_orders,
            ].forEach(action => dispatch(action()));
        }),
    );

    updux.addEffect(
        movement_phase,
        subactions(({ getState, dispatch }) => next => () => {
            Object.keys(getState().bogeys).forEach(id =>
                dispatch(bogey_movement(id, plot_movement(getState().bogeys[id]))),
            );
        }),
    );
}
