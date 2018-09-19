// @flow
import type {
  UiAction,
} from '../types';

import {
  actionTypes,
} from '.';

export const setUiState = (
  key: string,
  value: string | number,
): UiAction => ({
  type: actionTypes.SET_UI_STATE,
  payload: {
    key,
    value,
  },
});
