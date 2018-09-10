export const getTimersState = (timerId, key) => state => do {
  if (!key && !timerId) {
    state.timers;
  } else if (timerId && !key) {
    state.timers.map[timerId];
  } else if (timerId && key) {
    state.timers.map[timerId][key];
  }
};
