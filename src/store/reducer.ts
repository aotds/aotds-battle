import { combineReducers } from 'redux';

import game from './game/reducer';
import bogeys from './bogeys/reducer';

export const battle_reducer = combineReducers({
    game, bogeys
});

export default battle_reducer;
