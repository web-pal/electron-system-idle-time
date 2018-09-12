import React from 'react';
import {
  storiesOf,
} from '@storybook/react';

import Timer from '..';

storiesOf('Timer', module)
  .add('test timer', () => (
    <Timer />
  ));
