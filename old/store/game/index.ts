import Updux from 'updux';

import fp from 'lodash/fp';
import u from 'updeep';
import { init_game } from '../actions/phases';
import { GameState } from './types';

const updux = new Updux({
	initial: {
		name: '',
		players: [],
		turn: 0,
	},
});

const play_turn = updux.addAction('play_turn', null);

updux.addMutation(init_game, ({ game }) =>
	u(fp.pick(['name', 'players'], game)),
);

updux.addMutation(play_turn, () => u({ turn: (x: number) => x + 1 }));

export default updux;
