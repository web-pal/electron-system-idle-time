// @flow
import {
  combineReducers,
} from 'redux';

import {
  windowsManager,
} from 'shared/reducers';
import ui from './ui';
import timers from './timers';

const rootReducer = combineReducers({
  ui,
  timers,
  windowsManager,
});

export default rootReducer;
