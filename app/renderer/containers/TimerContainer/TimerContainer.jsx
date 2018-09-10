import React from 'react';

import Connect from 'renderer-components/Connect';
import Timer from 'renderer-components/Timer';

import {
  timersActions,
} from 'renderer-actions';
import {
  timersSelectors,
} from 'renderer-selectors';

const TimerContainer = ({ timerId }) => (
  <Connect
    mapStateToProps={() => state => ({
      time: timersSelectors.getTimersState(
        timerId,
        'time',
      )(state),
      isStarted: timersSelectors.getTimersState(
        timerId,
        'isStarted',
      )(state),
    })}
  >
    {({
      time,
      isStarted,
      dispatch,
    }) => (
      <Timer
        timerId={timerId}
        isStarted={isStarted}
        time={time}
        startTimer={() => {
          dispatch(timersActions.startTimerRequest(timerId));
        }}
        stopTimer={() => {
          dispatch(timersActions.stopTimerRequest(timerId));
        }}
        pauseTimer={() => {
          dispatch(timersActions.pauseTimerRequest(timerId));
        }}
        removeTimer={() => {
          dispatch(timersActions.removeTimer(timerId));
        }}
      />
    )}
  </Connect>
);

export default TimerContainer;
