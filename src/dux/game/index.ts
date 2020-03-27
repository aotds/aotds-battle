import { dux } from 'updux';
import u from 'updeep';

import next_action_id from './actionId';
import playPhases from '../playPhases';

type GameState = {
    name: string;
    turn: number;
};

const initial: GameState = { name: '', turn: 0 };

export default dux({
    initial,
    subduxes: { next_action_id },
    mutations: [[playPhases.actions.play_turn, () => u({ turn: t => t + 1 })]],
});
