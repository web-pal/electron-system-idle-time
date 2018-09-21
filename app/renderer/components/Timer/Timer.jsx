import React from 'react';
import {
  Button,
  Divider,
} from 'antd';

import {
  stj,
} from 'renderer-utils';

type Props = {
  timerId: number,
  time: number,
  isStarted: boolean,
  startTimer: () => void,
  pauseTimer: () => void,
  stopTimer: () => void,
  removeTimer: () => void,
};

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
    <Divider type="vertical" />
    <span>
      time:
      {stj(time)}
    </span>
    <Divider type="vertical" />
    <Button.Group size="small">
      <Button
        type="button"
        disabled={isStarted}
        onClick={() => {
          startTimer();
        }}
      >
      startTimer
      </Button>
      <Button
        type="button"
        disabled={!isStarted}
        onClick={() => {
          pauseTimer();
        }}
      >
      pauseTimer
      </Button>
      <Button
        type="button"
        disabled={!isStarted}
        onClick={() => {
          stopTimer();
        }}
      >
      stopTimer
      </Button>
      <Button
        type="button"
        disabled={isStarted}
        onClick={() => {
          removeTimer();
        }}
      >
      removeTimer
      </Button>
    </Button.Group>
  </div>
);

export default Timer;
