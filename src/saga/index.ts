import movement_phase from './movement_phase';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
      movement_phase()
  ])
}
