import path from 'path';
import {
  remote,
} from 'electron';
import {
  put,
  take,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import {
  eventChannel,
} from 'redux-saga';
import {
  actionTypes,
  uiActions,
} from 'renderer-actions';

const {
  autoUpdater,
  CancellationToken,
} = remote.require('electron-updater');

autoUpdater.autoDownload = false;

if (process.env.NODE_ENV === 'development') {
  autoUpdater.updateConfigPath = path.join(process.cwd(), 'dev-app-update.yml');
  autoUpdater.allowDowngrade = true;
}

function createUpdaterChannel({ updater, event }) {
  return eventChannel((emitter) => {
    updater.on(event, emitter);

    return () => {
      updater.removeListener(event, emitter);
    };
  });
}

function* onUpdateAvailable({ channel }) {
  const update = yield take(channel);
  yield put(uiActions.setUiState('hasUpdate', update));
  channel.close();
}

function* onUpdateNotAvailable({ channel }) {
  const info = yield take(channel);
  console.log('update-not-available', info);
  channel.close();
}

function* onUpdateDownloaded({ channel }) {
  const info = yield take(channel);
  console.log('update-downloaded', info);
  if (process.env.NODE_ENV === 'production') {
    remote.dialog.showMessageBox({
      type: 'info',
      title: 'Install Updates',
      message: 'Do you want update now?',
      buttons: ['Sure', 'No'],
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        const isSilent = true;
        const isForceRunAfter = true;
        autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
      }
    });
  }

  channel.close();
}

function* onDownloadProgress({ channel }) {
  while (true) {
    const progress = yield take(channel);
    yield put(uiActions.setUiState('downloadUpdateProgress', progress));
    console.log('download-progress', progress);
    if (progress.percent === 100) {
      channel.close();
    }
  }
}

export function* checkUpdates() {
  const updateAvailable = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-available',
  });

  yield fork(onUpdateAvailable, {
    channel: updateAvailable,
  });

  const updateNotAvailable = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-not-available',
  });

  yield fork(onUpdateNotAvailable, {
    channel: updateNotAvailable,
  });

  try {
    autoUpdater.checkForUpdates();
  } catch (e) {
    console.log(e);
  }
}

export function* downloadUpdate() {
  const downloadProgress = createUpdaterChannel({
    updater: autoUpdater,
    event: 'download-progress',
  });

  yield fork(onDownloadProgress, {
    channel: downloadProgress,
  });

  const updateDownloaded = createUpdaterChannel({
    updater: autoUpdater,
    event: 'update-downloaded',
  });

  yield fork(onUpdateDownloaded, {
    channel: updateDownloaded,
  });

  try {
    const cancellationToken = new CancellationToken();
    yield autoUpdater.downloadUpdate(cancellationToken);
  } catch (e) {
    console.log(e);
  }
}

export function* updaterFlow() {
  yield takeEvery(actionTypes.CHECK_UPDATES_REQUEST, checkUpdates);
  yield takeEvery(actionTypes.DOWNLOAD_UPDATE_REQUEST, downloadUpdate);
}
