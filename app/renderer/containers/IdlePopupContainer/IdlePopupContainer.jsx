// @flow
import React from 'react';
import {
  Button,
} from 'antd';

import Connect from 'renderer-components/Connect';

import {
  timersActions,
} from 'renderer-actions';
import {
  timersSelectors,
} from 'renderer-selectors';
import {
  stj,
} from 'renderer-utils';


const IdlePopupContainer = () => (
  <Connect
    mapStateToProps={() => state => ({
      state,
      idleTime: timersSelectors.getIdleTime(state),
      times: timersSelectors.getStartedTimes(state),
    })}
  >
    {({ state, times, idleTime, dispatch }) => (
      <div style={{ margin: 20 }}>
        {console.log(state, times)}
        {times.map(time => (
          <div key={time.id}>
            <span>
              Timer: {time.id}
            </span>
            <span>
              time: {stj(time.time)}
            </span>
          </div>
        ))}
        <h3>Idle Time: {idleTime && stj(idleTime)}</h3>
        <Button
          onClick={() => {
            dispatch(timersActions.addTimerAnother(1));
          }}
        >
            Dismiss
        </Button>
        <Button
          type="primary"
          onClick={() => {
            dispatch(timersActions.addTimerAnother(1));
          }}
        >
            Keep
        </Button>
      </div>
    )}
  </Connect>
);

export default IdlePopupContainer;
