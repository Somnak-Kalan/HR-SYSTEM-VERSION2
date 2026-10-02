import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Modal } from 'antd';
import { useState } from 'react';
const Create = (props) => {
  const { onData } = props;
  const [state, setState] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setState(true);
  };

  const handleOk = (e) => {
    setState(false);
  };

  const handleCancel = (e) => {
    setState(false);
  };
  const on_close_modal = () => {
    setState(false);
  };
  const onFinish = async (values) => {
    await onData(values);
    await setState(false);
    await form.resetFields();
  };
  const onFinishFailed = (errorInfo) => {};

  return (
    <>
      <div>
        <Button type="primary" className="cursor-pointer" onClick={showModal}>
          <UserAddOutlined />
          Create
        </Button>
      </div>
      {/* end button */}
      <Modal
        visible={state}
        okText="create"
        onCancelText="Cancel"
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
        width={500}
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        closable={false}>
        <Card
          title="Create Company"
          extra={
            <CloseCircleOutlined
              onClick={() => on_close_modal()}
              className="cursor-pointer"
              style={{ fontSize: '20px', color: 'red' }}
            />
          }>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 5,
            }}
            labelAlign="left"
            wrapperCol={{
              span: 16,
            }}
            style={{
              width: 400,
            }}
            // set default of form
            // initialValues={{ key:value }}
            // end set default of form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="flex justify-center pt-4 ">
            <div>
              {/* ------------------------------ */}
              {/* ------your code here---------- */}
              {/* ------------------------------ */}

              <Flex justify={'right'}>
                <Form.Item className="">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Flex>
              {/* ------------------------------ */}
              {/* ------end your code here---------- */}
              {/* ------------------------------ */}
            </div>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default Create;
