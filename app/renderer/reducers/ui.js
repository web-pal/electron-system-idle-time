// @flow
import {
  actionTypes,
} from '../actions';

import type {
  Action,
  UiState,
} from '../types';


const initialState: UiState = {};

const mergeUiValues = (
  values,
  deepMergeKeys,
  state,
) => (
  Object.keys(values).reduce((s, v) => ({
    ...s,
    [v]: deepMergeKeys.includes(v) ? {
      ...state[v],
      ...values[v],
    } : values[v],
  }), {})
);

const ui = (
  state: UiState = initialState,
  action: Action,
) => {
  switch (action.type) {
    case actionTypes.SET_UI_STATE: {
      const {
        key,
        values,
      } = action.payload;
      const { deepMergeKeys } = action.meta;
      return {
        ...state,
        ...(
          key
            ? ({
              [key]: {
                ...state[key],
                ...mergeUiValues(
                  values,
                  deepMergeKeys,
                  state[key],
                ),
              },
            })
            : (
              mergeUiValues(
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
};

export default ui;
