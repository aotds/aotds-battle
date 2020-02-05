// @format

import { action } from '../../../actions';
import { D100, D6 } from '../../types/misc';
import { OrdersState, WeaponOrdersState } from './orders/types';

export const set_orders = action('SET_ORDERS', (bogey_id: string, orders: OrdersState) => ({ bogey_id, orders }));

type Damage = {
    bogey_id: string;
    weapon_type: string;
    dice?: D6[];
    is_penetrating: boolean;
    damage?: number;
};

export const damage = action(
    'DAMAGE',
    (bogey_id: string, weapon_type: string, diceOrDamage: number | D6[], is_penetrating: boolean = false) => {
        const payload = { bogey_id, weapon_type, is_penetrating } as Damage;
        if (typeof diceOrDamage === 'number') {
            payload.damage = diceOrDamage;
        } else {
            payload.dice = diceOrDamage as D6[];
        }
        return payload;
    },
);

export const bogey_execute_weapon_order = action(
    'BOGEY_EXECUTE_WEAPON_ORDER',
    (bogey_id: string, weapon_id: number, orders: WeaponOrdersState) => ({
        bogey_id,
        weapon_id,
        orders,
    }),
);
