import { action, payload, empty } from 'ts-action';

export const movement_phase = action('movement_phase', empty());
export const firecon_orders_phase = action('firecon_orders_phase', empty());
export const weapon_orders_phase = action('weapon_orders_phase', empty());
export const weapon_firing_phase = action('weapon_firing_phase', empty());
export const clear_orders = action('clear_orders', empty());
