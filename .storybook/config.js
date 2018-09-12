/* eslint-disable global-require */
import '@babel/polyfill';

import React from 'react';
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import {
  Provider,
} from 'react-redux';

import {
  configure,
  addDecorator,
} from '@storybook/react';

import rootReducer from 'renderer-reducers';


function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('renderer-reducers', () => {
      // eslint-disable-next-line
      store.replaceReducer(require('renderer-reducers').default);
    });
  }

  return store;
}
const store = configureStore();

function loadStories() {
  require('renderer-components/Timer/stories');
  require('renderer-components/WindowsManager/stories');
}

addDecorator(render => (
  <Provider store={store}>
    {render()}
  </Provider>
));

configure(loadStories, module);
