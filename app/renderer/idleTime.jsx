// @flow
import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';

import IdlePopupContainer from 'renderer-containers/IdlePopupContainer';

render(
  <Provider store={window.electronSystemIdleTimeStore}>
    <IdlePopupContainer />
  </Provider>,
  document.getElementById('root'),
);
