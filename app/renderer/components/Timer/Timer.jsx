import React from 'react';
import moment from 'moment';

type Props = {
  timerId: number,
  time: number,
  isStarted: boolean,
  startTimer: () => void,
  pauseTimer: () => void,
  stopTimer: () => void,
  removeTimer: () => void,
};

function addLeadingZero(s: number): string {
  return s < 10 ? `0${s}` : `${s}`;
}

function getTimeString(time: number): string {
  const timeMoment = moment.duration(time * 1000);
  return [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');
}

const Timer = ({
  timerId,
  time,
  isStarted,
  startTimer,
  pauseTimer,
  stopTimer,
  removeTimer,
}: Props) => (
  <div>
    <span>
      timerId:
      {timerId}
    </span>
    <span>
      time:
      {getTimeString(time)}
    </span>
    <button
      type="button"
      disabled={isStarted}
      onClick={() => {
        startTimer();
      }}
    >
      startTimer
    </button>
    <button
      type="button"
      disabled={!isStarted}
      onClick={() => {
        pauseTimer();
      }}
    >
      pauseTimer
    </button>
    <button
      type="button"
      disabled={!isStarted}
      onClick={() => {
        stopTimer();
      }}
    >
      stopTimer
    </button>
    <button
      type="button"
      disabled={isStarted}
      onClick={() => {
        removeTimer();
      }}
    >
      removeTimer
    </button>
  </div>
);

export default Timer;
