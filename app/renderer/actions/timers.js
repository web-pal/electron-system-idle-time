// @flow
import type {
  Scope,
  Scopes,
  TimersAction,
} from '../types';

import {
  actionTypes,
} from '.';


export const startTimerRequest = (timerId): TimersAction => ({
  type: actionTypes.START_TIMER_REQUEST,
  timerId,
});

export const stopTimerRequest = (timerId): TimersAction => ({
  type: actionTypes.STOP_TIMER_REQUEST,
  timerId,
});

export const pauseTimerRequest = (timerId): TimersAction => ({
  type: actionTypes.PAUSE_TIMER_REQUEST,
  timerId,
});

export const removeTimer = (timerId): TimersAction => ({
  type: actionTypes.REMOVE_TIMER,
  payload: {
    timerId,
  },
});

export const addTimer = (): TimersAction => ({
  type: actionTypes.ADD_TIMER,
});

export const addTimerAnother = (scope: Scope): TimersAction => ({
  type: actionTypes.ADD_TIMER,
  scope,
});

export const setTimersState = ({
  values,
  timerId,
  scope,
  meta = {
    deepMergeKeys: [],
  },
}): TimersAction => ({
  type: actionTypes.SET_TIMERS_STATE,
  payload: {
    values,
    timerId,
  },
  meta,
  scope,
});

export const setIdleTime = (
  payload: number | null,
  scope: Scopes,
): TimersAction => ({
  type: actionTypes.SET_IDLE_TIME,
  payload,
  scope,
});
