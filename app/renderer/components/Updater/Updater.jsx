import React from 'react';
import {
  Button,
  Progress,
} from 'antd';

import {
  version,
} from '../../../package.json';

type Props = {
  noUpdates: boolean,
  latesVersion: string,
  downloadPercent: number,
  downloadedUpdate: boolean,
  checkUpdates: () => void,
  downloadUpdate: () => void,
};

const Updater = ({
  noUpdates,
  latesVersion,
  downloadPercent,
  downloadedUpdate,
  downloadUpdate,
  checkUpdates,
}: Props) => {
  const ready = (
    latesVersion
    && !downloadedUpdate
    && !downloadPercent
  );
  const loading = (
    latesVersion
    && !downloadedUpdate
    && downloadPercent > 0
  );
  return (
    <div>
      <div>
        Current version: {version}
      </div>
      <Button
        type="button"
        disabled={loading}
        onClick={() => (
          latesVersion
            ? downloadUpdate()
            : checkUpdates()
        )}
      >
        {(!latesVersion) && 'Check updates'}
        {ready && 'Download'}
        {loading && 'Loading...'}
        {downloadedUpdate && 'Install'}
      </Button>

      {noUpdates && (
      <div>No update available</div>
      )}

      {latesVersion && (
      <div>Latest version: {latesVersion}</div>
      )}

      {downloadPercent && (
      <div style={{ width: 200, marginTop: 15 }}>
        <Progress
          percent={Math.floor(downloadPercent)}
          size="small"
        />
      </div>
      )}
    </div>
  );
};

export default Updater;
