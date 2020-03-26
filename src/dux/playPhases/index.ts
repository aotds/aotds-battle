import Updux from 'updux';
import { action, empty } from 'ts-action';
import subactions from '../subactions';
import fp from 'lodash/fp';

const play_turn = action('play_turn', empty());

export const phases = [
    'movement_phase',
    'firecon_orders_phase',
    'weapon_orders_phase',
    'weapon_firing_phase',
    'clear_orders',
];

const movement_phase = action('movement_phase', empty());
const firecon_orders_phase = action('firecon_orders_phase', empty());
const weapon_orders_phase = action('weapon_orders_phase', empty());
const weapon_firing_phase = action('weapon_firing_phase', empty());
const clear_orders = action('clear_orders', empty());

const dux = new Updux({
    actions: {
        play_turn,
        movement_phase,
        firecon_orders_phase,
        weapon_orders_phase,
        weapon_firing_phase,
        clear_orders,
    },
});

dux.addEffect(
    play_turn,
    subactions(({ dispatch, actions }) => action => {
        phases.map(p => actions[p]()).forEach(dispatch);
    }),
);

export default dux.asDux;
