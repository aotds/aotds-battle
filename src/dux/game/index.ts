import { Updux } from 'updux';
import u from 'updeep';

export const dux = new Updux({
	initial: {
		name: '',
		turn: 0,
	},
	actions: {
		initGame: null,
	},
	mutations: {
		initGame: ({ game }) => u(game),
	},
});
