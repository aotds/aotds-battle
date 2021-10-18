import { Updux } from 'updux';
import u from 'updeep';

export const dux = new Updux({
	initial: {
		name: '',
		round: 0,
	},
	actions: {
		initGame: (name, bogeys) => ({ name, bogeys }),
	},
	mutations: {
		initGame: ({ name }) => u({ name }),
	},
});
