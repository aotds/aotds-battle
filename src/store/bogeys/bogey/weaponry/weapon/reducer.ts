// @format
import u from 'updeep';
import Redactor from '../../../../../reducer/redactor';
import { internal_damage, bogey_execute_weapon_order } from '../../actions';
import { bogey_weapon_orders } from '../../../../../actions/bogey';

export type WeaponState = {
    id: number;
    firecon_id?: number;
    damaged?: boolean;
};

const redactor = new Redactor({} as WeaponState);
export const weapon_reducer = redactor.asReducer;
export const weapon_upreducer = redactor.asUpReducer;

redactor.addRedaction(bogey_weapon_orders, ({ payload: { orders: { firecon_id } } }) => u({ firecon_id }));

redactor.addRedaction(internal_damage, ({ payload: { hit, system } }) =>
    u.if((w: WeaponState) => hit && system.type === 'weapon' && system.id === w.id, {
        damaged: true,
    }),
);
