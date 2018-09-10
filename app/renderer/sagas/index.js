import {
  all,
  fork,
} from 'redux-saga/effects';

import {
  timerFlow,
} from './timers';

export default function* rootSaga() {
  yield all([
    fork(timerFlow),
  ]);
}
