import path from 'path';
import {
  call,
  take,
  fork,
  select,
  put,
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
} from 'renderer-selectors';

import {
  windowsManagerSagas,
} from 'shared/sagas';


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

const system = remote.require('desktop-idle');

function* onDomReadyPopup({
  channel,
  win,
}) {
  while (true) {
    yield take(channel);
    console.log('domReadyChannel');
    const values = yield select(timersSelectors.getTimersState());
    yield put(timersActions.setTimersState({
      values,
      scope: win.id,
    }));
  }
}

function* runIdlePopup() {
  const url = (
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/idleTime.html'
      : `file://${__dirname}/dist/idleTime.html`
  );
  const win = yield call(
    windowsManagerSagas.forkNewWindow,
    {
      url,
      showOnReady: true,
      scopes: ['idleRenderer'],
      BrowserWindow: remote.BrowserWindow,
      options: {
        width: 460,
        height: 130,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
          devTools: process.env.NODE_ENV === 'development',
          preload: path.join(
            process.cwd(),
            'app/dist/preload.prod.js',
          ),
        },
      },
    },
  );

  const domReadyChannel = windowsManagerSagas.createWindowChannel({
    win,
    webContentsEvents: [
      'dom-ready',
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

      if (idleTime >= 3 && !timers.idleTime) {
        yield put(timersActions.setIdleTime(3));
        yield fork(runIdlePopup);
      }

      if (timers.idleTime) {
        yield put(timersActions.setIdleTime(
          timers.idleTime + 1,
          'allRenderer',
        ));
      }

      yield put(timersActions.setTimersState({
        values: {
          // ids: timers.ids,
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
