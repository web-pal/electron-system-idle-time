import {
  all,
  fork,
} from 'redux-saga/effects';

import {
  timerFlow,
} from './timers';
import {
  takeAddWindowRequest,
} from './windowsManager';

export default function* rootSaga() {
  yield all([
    fork(timerFlow),
    fork(takeAddWindowRequest),
  ]);
}
