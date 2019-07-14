import movement_phase from './movement_phase';
import weapons from './weapons';
import { all } from 'redux-saga/effects';

import { try_turn_saga } from './turn';

export default function* rootSaga() {
  yield all([
      try_turn_saga(),
      movement_phase(),
      weapons(),
  ])
}
