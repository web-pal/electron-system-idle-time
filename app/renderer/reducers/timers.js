// @flow
import {
  actionTypes,
} from '../actions';

import type {
  Action,
  TimerState,
} from '../types';


const firstTimerId = 1;
const initialTimerState = {
  time: 0,
  activity: {},
  isStarted: false,
};
const initialState: TimerState = {
  ids: [firstTimerId],
  map: {
    [firstTimerId]: initialTimerState,
  },
};

const mergeTimerValues = (
  values,
  deepMergeKeys,
  state,
) => (
  Object.keys(values).reduce((s, v) => ({
    ...s,
    [v]: (
      deepMergeKeys.includes(v)
        ? {
          ...state[v],
          ...values[v],
        }
        : values[v]),
  }), {})
);

export default function timersReducer(
  state: TimerState = initialState,
  action: Action,
) {
  switch (action.type) {
    case actionTypes.ADD_TIMER: {
      const timerId = parseInt((
        state.ids.length
          ? state.ids.slice(-1)
          : 0
      ), 10) + 1;
      return {
        ...state,
        ids: [
          ...state.ids,
          timerId,
        ],
        map: {
          ...state.map,
          [timerId]: initialTimerState,
        },
      };
    }
    case actionTypes.REMOVE_TIMER: {
      const {
        [action.payload.timerId]: removedTimer,
        ...map
      } = state.map;
      return {
        ...state,
        ids: state.ids.filter(
          id => id !== action.payload.timerId,
        ),
        map,
      };
    }
    case actionTypes.SET_TIMERS_STATE: {
      const {
        timerId,
        values,
      } = action.payload;
      const { deepMergeKeys } = action.meta;
      return {
        ...state,
        ...(
          timerId
            ? ({
              map: {
                ...state.map,
                [timerId]: {
                  ...state.map[timerId],
                  ...mergeTimerValues(
                    values,
                    deepMergeKeys,
                    state.map[timerId] || initialTimerState,
                  ),
                },
              },
            })
            : (
              mergeTimerValues(
                values,
                deepMergeKeys,
                state,
              )
            )
        ),
      };
    }
    case actionTypes.__CLEAR_ALL_REDUCERS__:
      return initialState;
    default:
      return state;
  }
}
