// @format

import { action, empty, payload } from 'ts-action';
import { D100, D6 } from '../../types/misc';
import { OrdersState, WeaponOrdersState } from './orders/types';

export const clear_orders = action('clear_orders', empty());
export const set_orders = action(
    'set_orders',
    payload<{ bogey_id: string; orders: OrdersState; done: boolean | string }>(),
);

type Damage = {
    bogey_id: string;
    weapon_type: string;
    dice?: D6[];
    is_penetrating: boolean;
    damage?: number;
};

export const damage = action('damage', payload<Damage>());

export const bogey_execute_weapon_order = action(
    'bogey_execute_weapon_order',
    payload<{ bogey_id: string; weapon_id: number; orders: WeaponOrdersState }>(),
);
