import {
	clear_orders,
	movement_phase,
	firecons_order_phase,
	weapons_order_phase,
	weapons_firing_phase,
	play_turn,
	try_play_turn,
} from '../actions/phases';
import { Middleware } from 'redux';
import { mw_for, mw_compose } from '../../middleware/utils';
import { get_players_not_done, get_active_players } from '../selectors/index';
import { mw_subactions_for } from '../../middleware/subactions';

export const play_steps: Middleware = ({ dispatch }) => (next) => () => {
	[
		movement_phase(),
		firecons_order_phase(),
		weapons_order_phase(),
		weapons_firing_phase(),
		clear_orders(),
	].forEach((action) => dispatch(action));
};

export default mw_compose([
	mw_subactions_for(play_turn, play_steps),
	mw_for(try_play_turn, try_play_turn_mw),
]);
