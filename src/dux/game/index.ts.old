import Updux from 'updux';
import u from 'updeep';
import fp from 'lodash/fp';

import next_action_id from './actionId';
import playPhases from '../playPhases';
import { init_game } from '../bogeys/actions';

type GameState = {
    name: string;
    turn: number;
};

const initial: GameState = { name: '', turn: 0 };

const dux = new Updux({
    initial,
    subduxes: { next_action_id },
    actions: {
        ...playPhases.actions,
    },
});

dux.addMutation(playPhases.actions.play_turn, () => u({ turn: fp.add(1) }));

dux.addMutation(init_game, ({ game: { name } }) =>
    u({
        name,
        turn: u.constant(0),
    }),
);

export const gameDux = dux.asDux;
export default gameDux;
