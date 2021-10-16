import { Updux } from 'updux';
import { OrdersState, Orders } from './types';

export const dux = new Updux({
    initial: {} as OrdersState,
    actions: {
        clearOrders: null,
        setOrders: (bogeyId, orders) => ({ bogeyId, orders })
    },
});

dux.setMutation('setOrders', ({ orders}) => () => {
    return orders;
});

dux.setMutation('clear_orders', () => () => ({}));
