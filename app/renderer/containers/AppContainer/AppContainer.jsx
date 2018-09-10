import React from 'react';

import Connect from 'renderer-components/Connect';
import TimerContainer from 'renderer-containers/TimerContainer';

import {
  timersActions,
} from 'renderer-actions';

const AppContainer = () => (
  <Connect
    mapStateToProps={state => ({
      timersIds: state.timers.ids,
    })}
  >
    {({
      timersIds,
      dispatch,
    }) => (
      <div>
        {timersIds.map(timerId => (
          <TimerContainer
            key={timerId}
            timerId={timerId}
          />
        ))}
        <button
          type="button"
          onClick={() => {
            dispatch(timersActions.addTimer());
          }}
        >
          Add timer
        </button>
      </div>
    )}
  </Connect>
);

export default AppContainer;
