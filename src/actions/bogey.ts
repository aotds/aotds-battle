// @format

import { action } from '.';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { FireconOrdersState } from '../store/bogeys/bogey/orders/types';

export const bogey_movement = action('BOGEY_MOVEMENT', (id: string, navigation: NavigationState) => ({
    id,
    navigation,
}));

export const bogey_firecon_orders = action(
    'BOGEY_FIRECON_ORDERS',
    (bogey_id: string, firecon_id: number, orders: FireconOrdersState) => ({
        bogey_id,
        firecon_id,
        orders,
    }),
);
