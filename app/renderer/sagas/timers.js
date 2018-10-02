import path from 'path';
import {
  call,
  take,
  takeEvery,
  fork,
  select,
  put,
  spawn,
} from 'redux-saga/effects';
import {
  remote,
} from 'electron';
import {
  eventChannel,
} from 'redux-saga';
import NanoTimer from 'nanotimer';

import {
  actionTypes,
  timersActions,
} from 'renderer-actions';
import {
  timersSelectors,
  windowsManagerSelectors,
} from 'renderer-selectors';

import {
  windowsManagerSagas,
} from 'shared/sagas';

import {
  getPreload,
} from 'renderer-utils';


const system = remote.require('desktop-idle');

function createNanoTimerChannel() {
  console.log('Open timer channel');
  const timer = new NanoTimer();
  let secs = 0;
  return eventChannel((emitter) => {
    timer.setInterval(() => {
      secs += 1;
      emitter(secs);
    }, '', '1s');
    return () => {
      console.log('Close timer channel');
      timer.clearInterval();
    };
  });
}

function* onDomReadyPopup({
  channel,
  win,
}) {
  while (true) {
    yield take(channel);
    const values = yield select(timersSelectors.getTimersState());
    yield put(timersActions.setTimersState({
      values,
      scope: win.id,
    }));
    win.show();
  }
}

function* runIdlePopup() {
  const url = (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/idleTime.html'
      : `file://${__dirname}/idleTime.html`
  );
  const win = yield call(
    windowsManagerSagas.forkNewWindow,
    {
      url,
      scopes: ['idleRenderer'],
      BrowserWindow: remote.BrowserWindow,
      options: {
        width: 460,
        height: 130,
        frame: false,
        show: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
          devTools: process.env.NODE_ENV === 'development',
          preload: getPreload(),
        },
      },
    },
  );

  const domReadyChannel = windowsManagerSagas.createWindowChannel({
    win,
    webContentsEvents: [
      'did-finish-load',
    ],
  });
  yield fork(onDomReadyPopup, {
    channel: domReadyChannel,
    win,
  });
}

export function* handleTimerTick(timerChannel) {
  console.log('handleTimerTick is forked');
  try {
    while (true) {
      yield take(timerChannel);
      const timers = yield select(timersSelectors.getTimersState());
      const idleTime = system.getIdleTime();
      const isActive = idleTime <= 60;

      if (idleTime >= 30 && !timers.idleTime) {
        yield put(timersActions.setIdleTime(30));
        yield spawn(runIdlePopup);
      }

      if (timers.idleTime) {
        yield put(timersActions.setIdleTime(
          timers.idleTime + 1,
          'allRenderer',
        ));
      }

      yield put(timersActions.setTimersState({
        values: {
          map: Object.keys(timers.map).reduce(
            (acc, timerId) => {
              let timer = timers.map[timerId];
              if (timer.isStarted) {
                const time = timer.time + 1;
                timer = {
                  ...timer,
                  time,
                };
                if (time % 60 === 0) {
                  timer.activity[time] = isActive;
                }
              }
              return ({
                ...acc,
                [timerId]: {
                  ...timer,
                },
              });
            },
            {},
          ),
        },
        scope: 'allRenderer',
      }));
    }
  } finally {
    console.log('handleTimerTick is terminated');
  }
}

export function* timerFlow() {
  let channel;
  while (true) {
    const {
      type,
      timerId,
    } = yield take([
      actionTypes.START_TIMER_REQUEST,
      actionTypes.STOP_TIMER_REQUEST,
      actionTypes.PAUSE_TIMER_REQUEST,
    ]);
    const isStarted = type === actionTypes.START_TIMER_REQUEST;
    const isPause = type === actionTypes.PAUSE_TIMER_REQUEST;
    yield put(timersActions.setTimersState({
      values: {
        isStarted,
        ...(
          (isPause || isStarted)
            ? {}
            : {
              time: 0,
            }
        ),
      },
      timerId,
    }));

    if (isStarted && !channel) {
      channel = yield call(createNanoTimerChannel);
      yield fork(handleTimerTick, channel);
    }

    if (!isStarted && channel) {
      const timers = yield select(timersSelectors.getTimersState());
      const noStartedTimers = timers.ids.reduce(
        (acc, tId) => (
          acc
          && !timers.map[tId].isStarted
        ),
        true,
      );
      if (noStartedTimers) {
        /* handleTimerTick will be terminated immediately after the channel close */
        channel.close();
        channel = null;
      }
    }
  }
}

function* closeIdlePopup() {
  const ids = yield select(
    windowsManagerSelectors.getAllWindowsByScope('idleRenderer'),
  );
  if (ids.length) {
    const window = windowsManagerSelectors.getWindowById(ids[0]);
    window.close();
  }
  yield put(timersActions.setIdleTime(
    null,
    'allRenderer',
  ));
}

function* dismissTimer({ timerId }) {
  yield put(timersActions.setIdleResolved(
    timerId,
    'idleRenderer',
  ));
  const timers = yield select(timersSelectors.getTimersState());
  const timer = timers.map[timerId];
  const time = timer.time - timers.idleTime;
  yield put(timersActions.setTimersState({
    values: {
      time,
      isStarted: true,
      activity: (Object.keys(timer.activity)
        .reduce(
          (res, a) => (
            a <= time
              ? [{ [a]: timer.activity[a] }, ...res]
              : res
          ),
          [],
        )
      ),
    },
    timerId,
  }));
}

export function* idleFlow() {
  yield takeEvery(actionTypes.DISMISS_TIMER_REQUEST, dismissTimer);
  yield takeEvery(actionTypes.CLOSE_IDLE_POPUP_REQUEST, closeIdlePopup);
}
