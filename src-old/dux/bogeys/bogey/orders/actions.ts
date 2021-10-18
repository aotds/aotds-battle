import { action, payload, empty } from 'ts-action';
import { Orders } from './types';

export const set_orders = action(
    'set_orders',
    payload<{
        bogey_id: string;
        orders: Orders;
        done?: boolean | string;
    }>(),
);

export const clear_orders = action('clear_orders', empty());
