import { action, payload, empty } from 'ts-action';

export const play_turn = action('play_turn', empty());
export const movement_phase = action('movement_phase', empty());
export const firecons_order_phase = action('firecons_order_phase', empty());
export const weapons_order_phase = action('weapons_order_phase', empty());
export const weapons_firing_phase = action('weapons_firing_phase', empty());
export const clear_orders = action('clear_orders', empty());
