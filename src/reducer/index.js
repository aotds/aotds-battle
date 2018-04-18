import u from 'updeep';
import { combineReducers } from 'redux'

import game from './game';
import objects, { inflate as inflate_objects } from './objects';
import log_reducer from './log';

export const inflate = u({
    objects: inflate_objects
});

const reducer = combineReducers({
  game,
  objects,
  log: log_reducer
});

export default reducer;
