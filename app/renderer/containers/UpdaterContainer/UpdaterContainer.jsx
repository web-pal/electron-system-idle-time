import React from 'react';
import {
  Button,
  Progress,
} from 'antd';

import Connect from 'renderer-components/Connect';

import {
  updaterActions,
} from 'renderer-actions';
import {
  uiSelectors,
} from 'renderer-selectors';

import {
  version,
} from '../../../package.json';


const UpdaterContainer = () => (
  <Connect
    mapStateToProps={state => ({
      hasUpdate: uiSelectors.getUiState('hasUpdate')(state),
      progress: uiSelectors.getUiState('downloadUpdateProgress')(state),
    })}
  >
    {({ dispatch, hasUpdate, progress }) => (
      <div style={{ marginTop: 15 }}>
        <div>
          Current version: {version}
        </div>
        <Button
          type="button"
          onClick={() => {
            dispatch(hasUpdate
              ? updaterActions.downloadUpdate(hasUpdate)
              : updaterActions.checkUpdates());
          }}
        >
          {hasUpdate ? 'Download' : 'Check updates'}
        </Button>
        {hasUpdate && (
          <div>Version {hasUpdate.releaseName}: {hasUpdate.releaseDate}</div>
        )}
        {progress && (
          <div style={{ width: 200, marginTop: 15 }}>
            <Progress
              percent={Math.floor(progress.percent)}
              size="small"
            />
          </div>
        )}
      </div>
    )}
  </Connect>
);

export default UpdaterContainer;
