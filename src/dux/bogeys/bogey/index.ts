import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

import Updux from '../../../BattleUpdux';
import orders from './orders';
import navigation from './navigation';
import weaponry, { inflate as inflate_weaponry } from './weaponry';
import * as actions from './actions';

const bogey_dux = new Updux({
    initial: {},
    actions: {
        ...actions,
    },
    subduxes: {
        orders,
        navigation,
        weaponry,
    },
});

bogey_dux.addMutation(
    bogey_dux.actions.bogey_movement_res,
    ({ bogey_id: id }, action) => u.if(fp.matches({ id }), u({ navigation: navigation.upreducer(action) })),
    true,
);

bogey_dux.addMutation(
    bogey_dux.actions.set_orders,
    ({ bogey_id: id }, action) => u.if(fp.matches({ id }), u({ orders: orders.upreducer(action) })),
    true,
);

bogey_dux.addMutation(bogey_dux.actions.firecon_orders_phase, () => bogey => {
    const orders = bogey?.orders?.firecons ?? [];

    orders.forEach(({ firecon_id: id, target_id }) => {
        bogey = u.updateIn('weaponry.firecons', u.map(u.if(fp.matches({ id }), u({ target_id }))), bogey);
    });

    return bogey;
});

bogey_dux.addMutation(bogey_dux.actions.weapon_orders_phase, () => bogey => {
    const orders = bogey?.orders?.weapons ?? [];

    orders.forEach(({ weapon_id: id, firecon_id }) => {
        bogey = u.updateIn('weaponry.weapons', u.map(u.if(fp.matches({ id }), u({ firecon_id }))), bogey);
    });

    return bogey;
});

export default bogey_dux.asDux;

export const inflate = u({
    weaponry: inflate_weaponry,
});
