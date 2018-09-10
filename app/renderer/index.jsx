import '@babel/polyfill';
import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import {
  Provider,
} from 'react-redux';
import {
  hot,
} from 'react-hot-loader';

import AppContainer from 'renderer-containers/AppContainer';
import store from './store';

const rootEl = window.document.getElementById('root');

const render = Component => (
  reactRender(
    <Provider store={store}>
      <Component />
    </Provider>,
    rootEl,
  )
);

render(hot(module)(AppContainer));
