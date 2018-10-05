import React from 'react';

import Connect from 'renderer-components/Connect';
import Updater from 'renderer-components/Updater';

import {
  updaterActions,
} from 'renderer-actions';
import {
  uiSelectors,
} from 'renderer-selectors';

const UpdaterContainer = () => (
  <Connect
    mapStateToProps={state => ({
      hasUpdate: uiSelectors.getUiState('hasUpdate')(state),
      progress: uiSelectors.getUiState('downloadUpdateProgress')(state),
      downloadedUpdate: uiSelectors.getUiState('downloadedUpdate')(state),
    })}
  >
    {(
      {
        dispatch,
        hasUpdate,
        progress,
        downloadedUpdate,
      },
    ) => (
      <div style={{ marginTop: 15 }}>
        <Updater
          noUpdates={hasUpdate === false}
          latesVersion={hasUpdate ? hasUpdate.releaseName : null}
          downloadPercent={progress ? Math.floor(progress.percent) : null}
          downloadedUpdate={downloadedUpdate}
          checkUpdates={() => {
            dispatch(updaterActions.checkUpdates());
          }}
          downloadUpdate={() => {
            dispatch(updaterActions.downloadUpdate());
          }}
        />
      </div>
    )}
  </Connect>
);

export default UpdaterContainer;
