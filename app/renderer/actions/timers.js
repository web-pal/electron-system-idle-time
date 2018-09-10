// @flow
import type {
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

export const setTimersState = (
  values: any,
  timerId: string | number,
  meta = {
    deepMergeKeys: [],
  },
): TimersAction => ({
  type: actionTypes.SET_TIMERS_STATE,
  payload: {
    values,
    timerId,
  },
  meta,
});
