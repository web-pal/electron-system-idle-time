export const getTimersState = (timerId, key) => state => do {
  if (!key && !timerId) {
    state.timers;
  } else if (timerId && !key) {
    state.timers.map[timerId];
  } else if (timerId && key) {
    state.timers.map[timerId][key];
  }
};

export const getIdleTime = ({ timers }) => timers.idleTime;

export const getStartedTimers = (
  { timers: { ids, map, idleResolved } },
) => ids.reduce(
  (res, id) => (
    (map[id].isStarted && !idleResolved.includes(id))
      ? [{ id, ...map[id] }, ...res]
      : res
  ),
  [],
);
