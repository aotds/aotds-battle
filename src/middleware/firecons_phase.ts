import { mw_subactions_for } from "./subactions";
import { Middleware } from "redux";
import { get_bogeys } from "../store/selectors";
import _ from 'lodash';
import { BogeyState } from "../store/bogeys/bogey/types";
import { FireconState } from "../store/bogeys/bogey/weaponry/firecon/types";
import { bogey_firecon_orders } from "../actions/bogey";
import { firecons_order_phase } from "../store/actions/phases";
import { FireconOrdersState } from "../store/bogeys/bogey/orders/types";

export const bogey_firecon : Middleware = ({getState,dispatch}) => () => () => {

    let ships = get_bogeys( getState() );

    ships.forEach( ship => {
        _.get( ship, 'orders.firecons', [] ).forEach( ( orders: FireconOrdersState, firecon_id: number ) => {
            dispatch( bogey_firecon_orders( ship.id, firecon_id, orders ) );
        });
    });

};

const mw_bogey_firecon_orders = mw_subactions_for( firecons_order_phase, bogey_firecon );
export default mw_bogey_firecon_orders;
