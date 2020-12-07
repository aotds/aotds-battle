import Updux from 'updux';
import u from 'updeep';

import * as actions from './actions';

const game_dux = new Updux({
    actions,
    initial: { name: '', turn: 0 },
});

game_dux.addMutation(actions.init_game, ({ game: { name } }) =>
    u({ name })
);

export default game_dux.asDux;
