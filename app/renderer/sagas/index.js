import {
  all,
  fork,
} from 'redux-saga/effects';

import {
  timerFlow,
  idleFlow,
} from './timers';
import {
  takeAddWindowRequest,
} from './windowsManager';

export default function* rootSaga() {
  yield all([
    // timers
    fork(timerFlow),
    fork(idleFlow),

    // windowsManager
    fork(takeAddWindowRequest),
  ]);
}
