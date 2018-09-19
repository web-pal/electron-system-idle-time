// @flow
import React, {
  Component,
} from 'react';
import {
  Row,
  Col,
  Tabs,
  Timeline,
  Drawer,
} from 'antd';

import {
  browserWindowInstanceMethods,
  webContentsInstanceMethods,
} from 'shared/constants';
import CallMethod from './CallMethod';
import AddWindow from './AddWindow';


type Props = {
  windows: Array<any>,
  activeWindowId: string,
  onWindowAdd: () => void,
  onWindowChange: () => void,
  onWindowRemove: () => void,
  onWindowMethodCall: () => any,
  onWebContentsMethodCall: () => any,
};

type State = {
  visibleForm: boolean,
};

class WindowsManager extends Component<Props, State> {
  state = {
    visibleForm: false,
  };

  showDrawer = () => {
    this.setState({
      visibleForm: true,
    });
  };

  onClose = () => {
    this.setState({
      visibleForm: false,
    });
  };

  render() {
    const {
      windows,
      activeWindowId,
      onWindowAdd,
      onWindowChange,
      onWindowRemove,
      onWindowMethodCall,
      onWebContentsMethodCall,
    } = this.props;
    return (
      <div>
        <Tabs
          activeKey={activeWindowId}
          tabPosition="left"
          type="editable-card"
          onEdit={(windowId, action) => {
            if (action === 'remove') {
              onWindowRemove(windowId);
            }
            if (action === 'add') {
              this.showDrawer();
            }
          }}
          onChange={(activeKey) => {
            onWindowChange(activeKey);
          }}
        >
          {windows.map(win => (
            <Tabs.TabPane
              closable
              tab={`Window ${win.id}`}
              key={win.id}
              style={{
                margin: '20px',
              }}
            >
              <Row gutter={8}>
                <Col span={12}>
                  <CallMethod
                    title="BrowserWindow instance methods"
                    methods={browserWindowInstanceMethods}
                    onMethodCall={args => onWindowMethodCall(args)}
                  />
                  <CallMethod
                    title="WebContents instance methods"
                    methods={webContentsInstanceMethods}
                    onMethodCall={args => onWebContentsMethodCall(args)}
                  />
                </Col>
                <Col span={12}>
                  <Timeline
                    mode="left"
                  >
                    {activeWindowId === String(win.id) && win.eventLogs.map((event, i) => (
                      <Timeline.Item
                        key={i.toString()}
                        color={(event.type === 'window') ? 'blue' : 'green'}
                      >
                        <p>
                          {event.name}
                        </p>
                        <p>
                          Event type: {event.type}
                        </p>
                        <p>
                          {event.dateString}
                        </p>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Col>
              </Row>
            </Tabs.TabPane>
          ))}
        </Tabs>
        <Drawer
          title="Add window"
          placement="left"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visibleForm}
        >
          <AddWindow
            onSubmit={onWindowAdd}
            onClose={this.onClose}
          />
        </Drawer>
      </div>
    );
  }
}

export default WindowsManager;
