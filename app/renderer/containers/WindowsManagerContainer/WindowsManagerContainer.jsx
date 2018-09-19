import React from 'react';

import Connect from 'renderer-components/Connect';
import WindowsManager from 'renderer-components/WindowsManager';

import {
  uiActions,
  windowsManagerActions,
} from 'renderer-actions';
import {
  uiSelectors,
  windowsManagerSelectors,
} from 'renderer-selectors';

const WindowsManagerContainer = () => (
  <Connect
    mapStateToProps={state => ({
      windows: windowsManagerSelectors.getAllWindows(state),
      activeWindowId: uiSelectors.getUiState('activeWindowId')(state),
    })}
  >
    {({
      dispatch,
      windows,
      activeWindowId,
    }) => (
      <WindowsManager
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowChange={(windowId) => {
          dispatch(uiActions.setUiState('activeWindowId', windowId));
        }}
        onWindowAdd={(data) => {
          dispatch(windowsManagerActions.addWindow(data));
        }}
        onWindowRemove={(id) => {
          const window = windowsManagerSelectors.getWindowById(id);
          window.close();
        }}
        onWindowMethodCall={(methodName) => {
          const window = windowsManagerSelectors.getWindowById(activeWindowId);
          return window[methodName]();
        }}
        onWebContentsMethodCall={(methodName) => {
          const window = windowsManagerSelectors.getWindowById(activeWindowId);
          return window[methodName]();
        }}
      />
    )}
  </Connect>
);

export default WindowsManagerContainer;
