import { Updux } from 'updux';
import u from 'updeep';
import { add } from 'lodash/fp';

export const dux = new Updux({
	initial: {
		name: '',
		turn: 0,
	},
	actions: {
		initGame: null,
		playTurn: (force = true) => force,
	},
	mutations: {
		initGame: ({ game }) => u(game),
		playTurn: () => u.updateIn('turn', add(1)),
	},
});
