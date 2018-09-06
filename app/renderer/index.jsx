import '@babel/polyfill';
import React from 'react';
import {
  render as reactRender,
} from 'react-dom';
import {
  hot,
} from 'react-hot-loader';

import App from './App';

const rootEl = window.document.getElementById('root');

const render = Component => (
  reactRender(
    <Component />,
    rootEl,
  )
);

render(hot(module)(App));
