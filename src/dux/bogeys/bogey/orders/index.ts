import Updux from 'updux';
import { OrdersState } from './types';
import * as actions from './actions';

const orders_dux = new Updux({
    initial: {} as OrdersState,
    actions,
});

orders_dux.addMutation(actions.set_orders, ({ orders, done = true }) => () => {
    return { done, ...orders };
});

orders_dux.addMutation(actions.clear_orders, () => () => ({}));

export default orders_dux.asDux;
