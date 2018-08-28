import u from 'updeep';
import { combineReducers } from 'redux'

import game from './game';
import log_reducer from './log';
import bogeys from './bogeys';

const reducer = combineReducers({
    game,
    bogeys,
    log: log_reducer
});

export default reducer;
