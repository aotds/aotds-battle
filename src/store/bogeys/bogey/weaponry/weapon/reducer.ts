// @format
import u from 'updeep';
import Redactor from '../../../../../reducer/redactor';
import { internal_damage, bogey_execute_weapon_order } from '../../actions';

export type WeaponState = {
    id: number;
    firecon_id?: number;
    damaged?: boolean;
};

const redactor = new Redactor({} as WeaponState);
export const weapon_reducer = redactor.asReducer;

redactor.addRedaction(bogey_execute_weapon_order, ({ payload: { orders: { firecon_id } } }) =>
    u.if(firecon_id !== null, { firecon_id }, u.omit(['firecon_id'])),
);

redactor.addRedaction(internal_damage, ({ payload: { hit, system } }) =>
    u.if((w: WeaponState) => hit && system.type === 'weapon' && system.id === w.id, {
        damaged: true,
    }),
);
