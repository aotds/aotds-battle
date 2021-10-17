import Updux, { actionCreator } from 'updux';

import game from './game';
import bogeys from './bogeys';
import log from './log';
import { Action } from 'redux';

import u from 'updeep';
import {
	movement_phase,
	firecons_order_phase,
	weapons_order_phase,
	weapons_firing_phase,
	clear_orders,
	init_game,
} from './actions/phases';
import subactions from './subactions';

const updux = new Updux({
	actions: {
		movement_phase,
		firecons_order_phase,
		weapons_order_phase,
		weapons_firing_phase,
		clear_orders,
		init_game,
	},
	subduxes: { game, bogeys, log },
});

const addTimestamp = u.updateIn('meta.timestamp', new Date().toISOString());

updux.addEffect('*', () => (next) => (action) => next(addTimestamp(action)));

export default updux;
