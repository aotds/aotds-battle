// @format

import { action } from '.';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { FireconOrdersState, WeaponOrdersState } from '../store/bogeys/bogey/orders/types';
import { FireWeaponOutcome } from '../rules/types';
import u from 'updeep';
import _ from 'lodash';

export const bogey_movement = action('BOGEY_MOVEMENT', (id: string, navigation: NavigationState) => ({
    id,
    navigation,
}));

export const bogey_firecon_orders = action(
    'BOGEY_FIRECON_ORDERS',
    (bogey_id: string, firecon_id: number, orders: Pick< FireconOrdersState, 'target_id' >) => ({
        bogey_id,
        firecon_id,
        orders,
    }),
);

export const bogey_weapon_orders = action(
    'BOGEY_WEAPON_ORDERS',
    (bogey_id: string, weapon_id: number, orders: Pick< WeaponOrdersState, 'firecon_id' >) => ({
        bogey_id,
        weapon_id,
        orders,
    }),
);

export const fire_weapon_outcome = action(
    'FIRE_WEAPON_OUTCOME',
    (bogey_id: string, target_id: string, outcome: FireWeaponOutcome) => ({
        bogey_id,
        target_id,
        ...outcome,
    }),
);

export const damage = action('DAMAGE', (bogey_id: string, damage: number, is_penetrating: boolean = false) => ({
    bogey_id,
    damage,
    is_penetrating,
}));

type InternalSystem = 'drive' | 'firecon' | 'weapon' | 'shield';

export type InternalDamage = {
    system: { type: InternalSystem; id?: number };
    check?: {
        threshold: number;
        die: number;
    };
    hit: boolean;
};

export type InternalDamageShorthand =
    | {
          system: { type: InternalSystem; id?: number } | InternalSystem | [InternalSystem, number];
          check?: {
              threshold: number;
              die: number;
          };
          hit: boolean;
      }
    | InternalSystem
    | [InternalSystem, number];

export const internal_damage = action('INTERNAL_DAMAGE', (bogey_id: string, damage: InternalDamageShorthand) => {
    let d = damage;

    if (typeof d === 'string') {
        d = { system: d, hit: true };
    }

    if (_.isArray(d)) {
        d = { system: { type: d[0], id: d[1] }, hit: true };
    }

    let system = d.system;
    if (_.isString(system)) {
        d.system = { type: system };
    }

    if (_.isArray(system)) {
        d.system = { type: system[0], id: system[1] } as any;
    }

    return { bogey_id, ...(d as InternalDamage) };
});
