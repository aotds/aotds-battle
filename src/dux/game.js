import { BDux } from '../BDux';
import u from 'updeep';

export const gameDux = new BDux({
	initial: {
		name: '',
		turn: 0,
	},
	actions: {
		initGame: (name, players) => ({ name, players }),
	},
	mutations: {
		initGame: (payload) => u(payload),
	},
});
