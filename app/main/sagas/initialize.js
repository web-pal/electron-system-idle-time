import {
  BrowserWindow,
} from 'electron';

import {
  take,
  call,
  fork,
} from 'redux-saga/effects';

import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  browserWindowInstanceEvents,
  webContentsInstanceEvents,
} from 'shared/constants';

import MenuBuilder from '../menu';


function* forkInitialRendererProcess() {
  try {
    const url = (
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${__dirname}/index.html`
    );
    const win = yield call(
      windowsManagerSagas.forkNewWindow,
      {
        url,
        showOnReady: true,
        scopes: ['mainRenderer'],
        BrowserWindow,
        options: {
          show: false,
          width: 1024,
          height: 728,
        },
      },
    );

    const menuBuilder = new MenuBuilder(win);
    menuBuilder.buildMenu();

    const eventsChannel = windowsManagerSagas.createWindowChannel({
      win,
      events: browserWindowInstanceEvents,
      webContentsEvents: webContentsInstanceEvents,
    });
    yield fork(windowsManagerSagas.onEventLogger, {
      windowId: win.id,
      channel: eventsChannel,
      scope: 'all',
    });
  } catch (err) {
    console.log(err);
  }
}

export function* initialize() {
  yield take('INITIAL');
  yield fork(forkInitialRendererProcess);
}
