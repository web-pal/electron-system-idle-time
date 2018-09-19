import {
  remote,
} from 'electron';

export const getAllWindows = (
  { windowsManager: { allIds, byId } },
) => allIds.map(
  id => (
    {
      id,
      ...byId[id],
    }
  ),
);

export const getWindowById = id => remote.BrowserWindow
  .getAllWindows()
  .find(win => win.id === Number(id));
