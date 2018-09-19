import React from 'react';
import {
  storiesOf,
} from '@storybook/react';
import {
  Form,
  InputNumber,
  Checkbox,
  Button,
} from 'antd';

import {
  browserWindowInstanceEvents,
  webContentsInstanceEvents,
} from 'shared/constants';
import Component from 'renderer-components/Component';
import WindowsManager from '..';


const events = {
  window: browserWindowInstanceEvents,
  webContents: webContentsInstanceEvents,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generateEvents = (
  eventsQty,
  {
    initialIndex = 0,
    date,
  } = { initialIndex: 0 },
) => Array(eventsQty).fill().map((i, index) => {
  const type = getRandomElement([
    'window',
    'webContents',
  ]);
  const name = getRandomElement(events[type]);
  return ({
    id: (initialIndex + index) + 1,
    dateString: (
      (date || new Date(
        new Date().getTime() + index * 60000,
      )).toLocaleDateString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    ),
    color: type === 'window' ? 'blue' : 'green',
    type,
    name,
  });
});

const generateWindows = (
  windowsQty,
  eventsQty,
) => Array(windowsQty).fill().map((i, index) => ({
  id: (index + 1).toString(),
  eventLogs: generateEvents(eventsQty),
}));

let timeout;

storiesOf('WindowsManager', module)
  .add('Manage windows and events', () => (
    <Component
      componentWillUnmount={() => {
        clearTimeout(timeout);
      }}
      initialState={{
        windows: generateWindows(1, 1),
        windowsQty: 1,
        eventsQty: 1,
        activeWindowId: '1',
        liveEvents: false,
      }}
      handlers={{
        loop: ({
          getState,
          setState,
          handlers,
        }) => () => {
          timeout = setTimeout(() => {
            const state = getState();
            setState({
              windows: state.windows.map(w => ({
                ...w,
                eventLogs: [
                  ...generateEvents(1, {
                    date: new Date(),
                    initialIndex: w.eventLogs.length,
                  }),
                  ...w.eventLogs,
                ],
              })),
            });
            handlers.loop();
          }, getRandomInt(200, 2000));
        },
        handleLiveEvents: ({
          setState,
          handlers,
        }) => (ev) => {
          const liveEvents = ev.target.checked;
          if (liveEvents) {
            handlers.loop();
          } else {
            clearTimeout(timeout);
          }
          setState({
            liveEvents,
          });
        },
        generateData: ({
          state,
          setState,
        }) => () => {
          setState({
            windows: generateWindows(
              state.windowsQty,
              state.eventsQty,
            ),
          });
        },
      }}
    >
      {(props, {
        state,
        setState,
        handlers,
      }) => (
        <div>
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <Form layout="inline">
              <Form.Item label="Windows qty">
                <InputNumber
                  min={1}
                  value={state.windowsQty}
                  onChange={(windowsQty) => {
                    setState({
                      windowsQty,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="Events qty">
                <InputNumber
                  min={0}
                  value={state.eventsQty}
                  onChange={(eventsQty) => {
                    setState({
                      eventsQty,
                    });
                  }}
                />
              </Form.Item>
              <Button
                style={{
                  marginTop: 4,
                }}
                onClick={handlers.generateData}
              >
                Generate data
              </Button>
              <Checkbox
                checked={state.liveEvents}
                onChange={handlers.handleLiveEvents}
                style={{
                  marginLeft: 10,
                }}
              >
                Live events
              </Checkbox>
            </Form>
          </div>
          <div
            style={{
              margin: 20,
            }}
          >
            <WindowsManager
              windows={state.windows}
              activeWindowId={state.activeWindowId}
              onWindowAdd={() => {
                const windows = generateWindows(state.windows.length + 1, 1);
                setState({
                  windows,
                });
              }}
              onWindowChange={(activeWindowId) => {
                setState({
                  activeWindowId,
                });
              }}
              onWindowRemove={(windowId) => {
                const windows = state.windows.filter(win => win.id !== windowId);
                setState({
                  windows,
                  activeWindowId: windows.length ? windows[0].id : null,
                });
              }}
              onWindowMethodCall={(methodName) => {
                console.log(methodName);
                return true.toString();
              }}
              onWebContentsMethodCall={(methodName) => {
                console.log(methodName);
                return true.toString();
              }}
            />
          </div>
        </div>
      )}
    </Component>
  ));
