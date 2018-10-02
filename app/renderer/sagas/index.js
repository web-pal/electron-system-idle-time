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

import {
  updaterFlow,
} from './updater';

export default function* rootSaga() {
  yield all([
    // timers
    fork(timerFlow),
    fork(idleFlow),

    // windowsManager
    fork(takeAddWindowRequest),

    fork(updaterFlow),
  ]);
}
