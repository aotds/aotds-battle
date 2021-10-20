import { Updux, action } from 'updux';
import u from 'updeep';
import { add } from 'lodash/fp';

type InitGamePayload = {
	game: {
		name: string;
	};
	bogeys: { name: string }[];
};

export const dux = new Updux({
	initial: {
		name: '',
		turn: 0,
	},
	actions: {
		initGame: (x: InitGamePayload) => x,
		playTurn: () => {},
		tryPlayTurn: action(
			'tryPlayTurn',
			() => {},
			u({ meta: { noLog: true } }),
		),
	},
	mutations: {
		initGame: ({ game }) => u(game),
		playTurn: () => u.updateIn('turn', add(1)),
	},
});
