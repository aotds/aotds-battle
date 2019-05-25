import movement_phase from './movement_phase';
import weapons from './weapons';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
      movement_phase(),
      weapons(),
  ])
}
