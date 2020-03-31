import Updux from 'updux';
import { action, empty } from 'ts-action';
import u from 'updeep';
import playPhases from '../../../playPhases';
import { FireconOrders } from '../weaponry/firecons';

const {
    actions: { clear_orders },
} = playPhases;

export type Orders = Partial<{
    navigation: {
        thrust?: number;
        turn?: number;
        bank?: number;
    };
    firecons: Array<FireconOrders>;
    weapons: Array<{
        weapon_id: number;
        firecon_id: number;
    }>;
}>;

const set_orders = action('set_orders', (bogey_id: string, orders: Orders) => ({
    payload: {
        bogey_id,
        orders,
        done: true,
    },
}));

type OrdersState = Orders & {
    done?: boolean | string;
};

const dux = new Updux({
    initial: {} as OrdersState,
    actions: { set_orders },
});

dux.addMutation(set_orders, ({ orders, done = true }) => () => {
    console.log(orders);
    return { done, ...orders };
});

dux.addMutation(clear_orders, () => () => ({}));

dux.addEffect(set_orders, () => next => action => {
    next(u.updateIn('payload.done', new Date().toISOString(), action));
});

export default dux.asDux;
