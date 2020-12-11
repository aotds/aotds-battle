import u from 'updeep';
import fp from 'lodash/fp';

import Updux from '../../../BattleUpdux';
import orders from './orders';
import navigation from './navigation';
import * as actions from './actions';

const bogey_dux = new Updux({
    initial: {},
    actions: {
        ...actions,
    },
    subduxes: {
        orders,
        navigation,
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

export default bogey_dux.asDux;
