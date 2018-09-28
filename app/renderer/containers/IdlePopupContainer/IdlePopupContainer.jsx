// @flow
import React, {
  Component,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  Button,
} from 'antd';

import {
  timersActions,
} from 'renderer-actions';
import {
  timersSelectors,
} from 'renderer-selectors';
import {
  stj,
} from 'renderer-utils';

import type {
  Dispatch,
} from '../../types';


type Props = {
  notResolvedTimers: Array<any>,
  idleTime: number,
  dispatch: Dispatch,
};


class IdlePopupContainer extends Component<Props> {
  componentWillReceiveProps(newProps) {
    if (
      newProps.notResolvedTimers.length === 0
      && this.props.notResolvedTimers.length
    ) {
      this.props.dispatch(timersActions.closeIdlePopup());
    }
  }

  render() {
    const {
      notResolvedTimers,
      idleTime,
      dispatch,
    } = this.props;
    return (
      <div style={{ margin: 20 }}>
        {notResolvedTimers.map(time => (
          <div key={time.id}>
            <span>
              Timer: {time.id}
            </span>
            <span>
              time: {stj(time.time)}
            </span>
            <Button.Group size="small">
              <Button
                onClick={() => {
                  dispatch(timersActions.dismissTimer(time.id));
                }}
              >
                Dismiss
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  dispatch(timersActions.setIdleResolved(time.id));
                }}
              >
                Keep
              </Button>
            </Button.Group>
          </div>
        ))}
        <h3>Idle Time: {idleTime && stj(idleTime)}</h3>
        {(notResolvedTimers.length > 1) && (
          <Button.Group>
            <Button
              onClick={() => {
                notResolvedTimers.map(t => dispatch(timersActions.dismissTimer(t.id)));
              }}
            >
              Dismiss All
            </Button>
            <Button
              type="primary"
              onClick={() => {
                notResolvedTimers.map(t => dispatch(timersActions.setIdleResolved(t.id)));
              }}
            >
              Keep All
            </Button>
          </Button.Group>
        )}
      </div>
    );
  }
}


const connector = connect(
  state => ({
    idleTime: timersSelectors.getIdleTime(state),
    notResolvedTimers: timersSelectors.getStartedNotIdleResolvedTimers(state),
  }),
  dispatch => ({ dispatch }),
);


export default connector(IdlePopupContainer);
