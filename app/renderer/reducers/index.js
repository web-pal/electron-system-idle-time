// @flow
import {
  combineReducers,
} from 'redux';

import ui from './ui';
import timers from './timers';

const rootReducer = combineReducers({
  ui,
  timers,
});

export default rootReducer;
