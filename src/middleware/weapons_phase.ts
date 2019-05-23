import { subactions_mw_for } from "./subactions";
import { Middleware } from "redux";
import { get_bogeys } from "../store/selectors";
import _ from 'lodash';
import { BogeyState } from "../store/bogeys/bogey/types";
import { bogey_weapon_orders } from "../actions/bogey";
import { weapons_order_phase } from "../store/actions/phases";
import { WeaponOrdersState } from "../store/bogeys/bogey/orders/types";

export const bogey_weapon : Middleware = ({getState,dispatch}) => () => () => {

    let ships = get_bogeys( getState() );

    ships.forEach( ship => {
        _.get( ship, 'orders.weapons', [] ).forEach( ( orders: WeaponOrdersState, weapon_id: number ) => {
            dispatch( bogey_weapon_orders( ship.id, weapon_id, orders ) );
        });
    });

};

const mw_bogey_weapon_orders = subactions_mw_for( weapons_order_phase, bogey_weapon );
export default mw_bogey_weapon_orders;
