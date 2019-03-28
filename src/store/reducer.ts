import { combineReducers } from 'redux';

import game from './game/reducer';
import bogeys from './bogeys/reducer';
import log from './log/reducer';

export const battle_reducer = combineReducers({
    game, bogeys, log
});

export default battle_reducer;
