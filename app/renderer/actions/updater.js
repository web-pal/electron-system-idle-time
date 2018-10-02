// @flow
import {
  actionTypes,
} from '.';

export const checkUpdates = () => ({
  type: actionTypes.CHECK_UPDATES_REQUEST,
});

export const downloadUpdate = (payload: any) => ({
  type: actionTypes.DOWNLOAD_UPDATE_REQUEST,
  payload,
});
