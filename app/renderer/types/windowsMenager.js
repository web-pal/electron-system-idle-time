// @flow
import {
  actionTypes,
} from '../actions';

// Add new actions using |
export type WindowsManagerAction =
  {|
    type: typeof actionTypes.ADD_WINDOW_REQUEST,
    payload: {|
      url: string,
      showOnReady: boolean,
    |},
  |};

export type WindowsManagerState = any;
