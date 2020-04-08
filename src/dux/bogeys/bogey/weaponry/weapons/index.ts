import Updux from 'updux';

import u from 'updeep';
import fp from 'lodash/fp';
import { action } from 'ts-action';

export type Arc = "F" | "FP" | "FS" | "A" | "AS" | "AP";

type BeamWeapon = {
    weapon_type: "beam",
    weapon_class: number,
};

export type Weapon = BeamWeapon;

export type WeaponMount = { arcs: Arc[] }

export type WeaponMounted = Weapon & WeaponMount;

export type WeaponState = {
    id: number;
    firecon_id?: number|null
} & WeaponMounted;

type WeaponOrders = {
    weapon_id: number,
    firecon_id?: number|null
}

const getWeapon = state => id => fp.find({id})(state);

const bogey_weapon_orders = action('bogey_weapon_orders', (bogey_id: string, orders: WeaponOrders) => ({
    payload: {
        bogey_id,
        weapon_id: orders.weapon_id,
        orders: {
            firecon_id: orders.firecon_id,
        },
    },
}));

const weaponsDux = new Updux({
    initial: [] as WeaponState[],
    actions: { bogey_weapon_orders },
    selectors: { getWeapon }
});

weaponsDux.addMutation(
    bogey_weapon_orders, ({weapon_id: id,orders:{firecon_id}}) =>
    u.map( u.if(fp.matches({id}), u({firecon_id}) )) as any
)

export default weaponsDux.asDux;

type WeaponShorthand = BeamWeapon;

export function inflateWeapons(shorthand: WeaponShorthand[] = []): WeaponState[] {
    let id = 1;
    return shorthand.map( s => ({...s, id: id++}) );
}
