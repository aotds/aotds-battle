import u from 'updeep';
import fp from 'lodash/fp';

import Updux from '../../../BattleUpdux';
import orders from './orders';

const bogey_dux = new Updux({
    initial: {},
    subduxes: {
        orders,
    },
});

bogey_dux.addMutation(
    bogey_dux.actions.set_orders,
    ({ bogey_id: id }, action) => u.if(u.is('id', id), u({ orders: orders.upreducer(action) })),
    true,
);

export default bogey_dux.asDux;
