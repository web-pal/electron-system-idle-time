// @flow
import React from 'react';
import {
  Row,
  Col,
  Select,
  Button,
} from 'antd';

import type {
  Node,
} from 'react';

import Component from 'renderer-components/Component';


type Props = {
  title: string,
  methods: Array<any>,
  onMethodCall: () => any,
};

const CallMethod = ({
  title,
  methods,
  onMethodCall,
}: Props): Node => (
  <Component
    initialState={{
      methodsCallResults: {},
    }}
  >
    {(props, {
      state,
      setState,
    }) => {
      const methodResult = state.methodsCallResults[state.selectedMethod];
      return (
        <Row
          style={{
            minHeight: 150,
          }}
        >
          <Col
            style={{
              marginBottom: 10,
            }}
          >
            {title}
          </Col>
          <Col>
            <Select
              showSearch
              style={{
                width: 200,
              }}
              placeholder="Select a method"
              onChange={(selectedMethod) => {
                setState({
                  selectedMethod,
                });
              }}
            >
              {methods.map(method => (
                <Select.Option
                  key={method.name}
                  value={method.name}
                >
                  {method.name}
                </Select.Option>
              ))}
            </Select>
            <Button
              style={{
                marginLeft: 4,
              }}
              onClick={() => {
                if (state.selectedMethod) {
                  setState({
                    methodsCallResults: {
                      ...state.methodsCallResults,
                      [state.selectedMethod]: {
                        name: state.selectedMethod,
                        lastCall: new Date().toLocaleDateString(
                          'en-US',
                          {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          },
                        ),
                        returnResult: onMethodCall(state.selectedMethod),
                      },
                    },
                  });
                }
              }}
            >
              Call
            </Button>
          </Col>
          <Col>
            {
              methodResult
                && (
                  <div>
                    {methodResult.name}()
                  </div>
                )
            }
            {
              methodResult?.lastCall
                && (
                  <div>
                    Last call: {methodResult.lastCall}
                  </div>
                )
            }
            {
              methodResult?.returnResult
                && (
                  <div>
                    Return: {methodResult.returnResult}
                  </div>
                )
            }
          </Col>
        </Row>
      );
    }}
  </Component>
);

export default CallMethod;
