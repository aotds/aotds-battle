import Updux from 'updux';
import u from 'updeep';
import fp from 'lodash/fp';

import * as actions from './actions';
import { play_turn } from '../bogeys/actions';

const game_dux = new Updux({
    actions: {
        ...actions,
        play_turn,
    },
    initial: { name: '', turn: 0 },
});

game_dux.addMutation(actions.init_game, ({ game: { name } }) => u({ name }));

game_dux.addMutation(play_turn, () => u({ turn: fp.add(1) }));

export default game_dux.asDux;
