import { combineReducers } from 'redux'

import game from './game';
import objects from './objects';
import log_reducer from './log';

const reducer = combineReducers({
  game,
  objects,
  log: log_reducer
});

export default reducer;
