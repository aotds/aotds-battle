import { mw_subactions_for } from './subactions';
import { Middleware } from 'redux';
import { get_bogeys } from '../store/selectors';
import _ from 'lodash';
import { BogeyState } from '../store/bogeys/bogey/types';
import { bogey_weapon_orders } from '../actions/bogey';
import { weapons_order_phase } from '../store/actions/phases';
import { WeaponOrdersState } from '../store/bogeys/bogey/orders/types';

export const bogey_weapon: Middleware = ({
	getState,
	dispatch,
}) => () => () => {
	let ships = get_bogeys(getState());

	for (const ship of ships) {
		const orders = ship.orders.weapons || {};
		Object.entries(orders).forEach(([weapon_id, orders]) => {
			dispatch(bogey_weapon_orders(ship.id, +weapon_id, orders));
		});
	}
};

const mw_bogey_weapon_orders = mw_subactions_for(
	weapons_order_phase,
	bogey_weapon,
);
export default mw_bogey_weapon_orders;
