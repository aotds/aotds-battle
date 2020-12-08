import { action, payload } from 'ts-action';
import { Orders } from './types';

export const set_orders = action(
    'set_orders',
    payload<{
        bogey_id: string;
        orders: Orders;
        done?: boolean | string;
    }>(),
);
