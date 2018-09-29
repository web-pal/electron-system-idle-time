import React, {
  Component,
} from 'react';
import {
  Input,
  Button,
  Checkbox,
  Form,
} from 'antd';

type Props = {
  onClose: () => void,
  onSubmit: () => void,
  form: any;
};

class AddWindow extends Component<Props> {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onSubmit, onClose } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
        onClose();
      }
    });
  }

  render() {
    const {
      onClose,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Url">
          {getFieldDecorator('url', {
            rules: [{ required: true, message: 'please enter url' }],
            initialValue: 'https://www.google.com',
          })(
            <Input
              style={{ width: '100%' }}
              placeholder="please enter url"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('showOnReady', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Show on ready ?</Checkbox>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('includePreload', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Include the preload ?</Checkbox>,
          )}
        </Form.Item>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={onClose}
          >
          Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
          >
          Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(AddWindow);
