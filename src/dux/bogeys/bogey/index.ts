import u from '@yanick/updeep';
import _ from 'lodash';
import fp from 'lodash/fp';
import { DuxState } from 'updux';
import Updux from '../../../BattleUpdux';
import * as actions from './actions';
import * as drive from './drive';
import navigation from './navigation';
import orders from './orders';
import structure, { inflate as inflate_structure } from './structure';
import weaponry, { inflate as inflate_weaponry } from './weaponry';

const bogey_dux = new Updux({
    initial: {} as Record<string, never>,
    actions: {
        ...actions,
    },
    subduxes: {
        structure,
        orders,
        navigation,
        weaponry,
        drive,
    },
    selectors: {
        getWeapon: bogey => id => _.find(_.get(bogey, 'weaponry.weapons', []), { id }),
        getShieldLevel: bogey => {
            return Math.max(...bogey.weaponry.shields.filter(shield => !shield.damaged).map(({ level }) => level)) ?? 0;
        },
    },
});

export type BogeyState = DuxState<typeof bogey_dux>;

bogey_dux.addMutation(
    bogey_dux.actions.bogey_movement_res,
    (({ bogey_id: id }, action) => u.if(fp.matches({ id }), u({ navigation: navigation.upreducer(action) }))) as any,
    true,
);

bogey_dux.addMutation(
    bogey_dux.actions.set_orders,
    ({ bogey_id: id }, action) => u.if(fp.matches({ id }), u({ orders: orders.upreducer(action) })) as any,
    true,
);

bogey_dux.addMutation(bogey_dux.actions.firecon_orders_phase, (() => (bogey: BogeyState) => {
    const orders = bogey?.orders?.firecons ?? [];

    orders.forEach(({ firecon_id: id, target_id }) => {
        bogey = u.updateIn('weaponry.firecons', u.map(u.if(fp.matches({ id }), u({ target_id }))), bogey);
    });

    return bogey;
}) as any);

bogey_dux.addMutation(bogey_dux.actions.weapon_orders_phase, (() => (bogey: BogeyState) => {
    const orders = bogey?.orders?.weapons ?? [];

    orders.forEach(({ weapon_id: id, firecon_id }) => {
        bogey = u.updateIn('weaponry.weapons', u.map(u.if(fp.matches({ id }), u({ firecon_id }))), bogey);
    });

    return bogey as BogeyState;
}) as any);

export default bogey_dux.asDux;

export const inflate: any = u({
    weaponry: inflate_weaponry,
    structure: inflate_structure,
    drive: drive.inflate,
});
