// @flow
import type {
  Store as ReduxStore,
  Dispatch as ReduxDispatch,
} from 'redux';


import type {
  UiAction,
  UiState,
} from './ui';

export * from './ui';
export * from './windowsMenager';

export type Action = UiAction

export type State = {|
  ui: UiState,
|};

export type Scope = number | string;
export type Scopes = Array<Scope>;

export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<Action>;
