import React from 'react';
import {
  Button,
} from 'antd';

import Connect from 'renderer-components/Connect';
import TimerContainer from 'renderer-containers/TimerContainer';
import WindowsManagerContainer from 'renderer-containers/WindowsManagerContainer';

import {
  timersActions,
} from 'renderer-actions';


const AppContainer = () => (
  <div style={{ margin: 20 }}>
    <Connect
      mapStateToProps={state => ({
        timersIds: state.timers.ids,
      })}
    >
      {({
        timersIds,
        dispatch,
      }) => (
        <div style={{ marginBottom: 15 }}>
          {timersIds.map(timerId => (
            <TimerContainer
              key={timerId}
              timerId={timerId}
            />
          ))}
          <Button
            type="button"
            onClick={() => {
              dispatch(timersActions.addTimer());
            }}
          >
          Add timer
          </Button>
        </div>
      )}
    </Connect>
    <WindowsManagerContainer />
  </div>
);

export default AppContainer;
