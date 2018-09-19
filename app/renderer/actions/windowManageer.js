// @flow
import type {
  WindowsManagerAction,
} from '../types';
import {
  actionTypes,
} from '.';

export const addWindow = (payload: {|
  url: string,
  showOnReady: boolean,
|}): WindowsManagerAction => ({
  type: actionTypes.ADD_WINDOW_REQUEST,
  payload,
});
