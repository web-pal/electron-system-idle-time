import {
  call,
  take,
  fork,
  select,
  put,
} from 'redux-saga/effects';
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

export function* handleTimerTick(timerChannel) {
  console.log('handleTimerTick is forked');
  try {
    while (true) {
      yield take(timerChannel);
      const timers = yield select(timersSelectors.getTimersState());
      yield put(timersActions.setTimersState(
        {
          map: Object.keys(timers.map).reduce(
            (acc, timerId) => {
              const timer = timers.map[timerId];
              return ({
                ...acc,
                [timerId]: {
                  ...timer,
                  time: (
                    timer.isStarted
                      ? timer.time + 1
                      : timer.time
                  ),
                },
              });
            },
            {},
          ),
        },
      ));
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
    yield put(timersActions.setTimersState(
      {
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
    ));

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
