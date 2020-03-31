import Updux, { DuxState } from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import { action } from 'ts-action';

type FireconState = {
    id: number;
    target_id?: string | null;
};

export type FireconOrders = {
    firecon_id: number;
    target_id: string | null;
};

const bogey_firecon_orders = action('bogey_firecon_orders', (bogey_id: string, orders: FireconOrders) => ({
    payload: {
        bogey_id,
        firecon_id: orders.firecon_id,
        orders: {
            target_id: orders.target_id,
        },
    },
}));

const getFirecon = state => id => fp.find({id}, state);

const dux = new Updux({
    initial: [] as FireconState[],
    selectors: {
        getFirecon,
    },
    actions: {
        bogey_firecon_orders,
    },
});

dux.addMutation(
    bogey_firecon_orders,
    ({ firecon_id: id, orders: { target_id } }) => {
        return u.map(u.if(fp.matches({ id }), u({ target_id }))) as any
    }
);

const fireconsDux = dux.asDux;
export default fireconsDux;

type FireconsState = DuxState<typeof fireconsDux>;

type FireconsShorthand = FireconsState | number;

export function inflateFirecons(shorthand: FireconsShorthand): FireconsState {
    if (typeof shorthand === 'object') return shorthand;

    return _.range(1, shorthand + 1).map(id => ({ id }));
}
