import path from 'path';
import {
  remote,
} from 'electron';
import {
  put,
  take,
  takeEvery,
  call,
  select,
  spawn,
} from 'redux-saga/effects';

import {
  windowsManagerSagas,
} from 'shared/sagas';

import {
  browserWindowInstanceEvents,
  webContentsInstanceEvents,
} from 'shared/constants';
import {
  actionTypes,
  uiActions,
} from 'renderer-actions';
import {
  uiSelectors,
} from 'renderer-selectors';


export function* onClose({
  channel,
  windowId,
}) {
  yield take(channel);
  channel.close();
  const activeWindowId = yield select(uiSelectors.getUiState('activeWindowId'));
  if (windowId === Number(activeWindowId)) {
    yield put(uiActions.setUiState('activeWindowId', '1'));
  }
}

function* addWIndow({ payload }) {
  try {
    const { showOnReady, includePreload } = payload;
    const url = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/idleTime.html'
        : `file://${__dirname}/dist/idleTime.html`
    );
    const win = yield call(
      windowsManagerSagas.forkNewWindow,
      {
        url,
        showOnReady,
        BrowserWindow: remote.BrowserWindow,
        options: {
          show: false,
          width: 1024,
          height: 728,
          webPreferences: (includePreload
            ? {
              preload: path.join(
                process.cwd(),
                'app/dist/preload.prod.js',
              ),
            }
            : {}),
        },
      },
    );

    const closeWindowChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: [
        'close',
      ],
    });

    yield spawn(onClose, {
      channel: closeWindowChannel,
      windowId: win.id,
    });

    const eventsChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: browserWindowInstanceEvents,
      webContentsEvents: webContentsInstanceEvents,
    });
    yield spawn(windowsManagerSagas.onEventLogger, {
      windowId: win.id,
      channel: eventsChannel,
      scope: 'all',
    });
  } catch (err) {
    console.log(err);
  }
}

export function* takeAddWindowRequest() {
  yield takeEvery(actionTypes.ADD_WINDOW_REQUEST, addWIndow);
}
