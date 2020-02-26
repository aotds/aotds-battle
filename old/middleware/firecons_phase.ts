import { Middleware } from 'redux';
import { oc } from 'ts-optchain';
import _ from 'lodash';

import { BogeyState } from '../store/bogeys/bogey/types';
import { FireconOrdersState } from '../store/bogeys/bogey/orders/types';
import { FireconState } from '../store/bogeys/bogey/weaponry/firecon/types';
import { bogey_firecon_orders } from '../actions/bogey';
import { firecons_order_phase } from '../store/actions/phases';
import { get_bogeys } from '../store/selectors';
import { mw_subactions_for } from './subactions';

export const bogey_firecon: Middleware = ({ getState, dispatch }) => () => () => {
    let ships = get_bogeys(getState());

    for (const ship of ships) {
        const firecons = Object.entries(oc(ship).orders.firecons({}));
        for( const [ firecon_id, orders ] of firecons ) {
            dispatch(bogey_firecon_orders(ship.id, +firecon_id, orders))
        }
    }
};

const mw_bogey_firecon_orders = mw_subactions_for(firecons_order_phase, bogey_firecon);
export default mw_bogey_firecon_orders;
