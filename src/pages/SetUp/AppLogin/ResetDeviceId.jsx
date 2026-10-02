import { Card, Modal, Form, Input, Button, Row, Col } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useCallback } from 'react';
import { useAppLoginStore } from '../../../stores/appLogin.store';

const ResetDeviceId = (props) => {
  const { open, setOpen, form, propData, access_token, success, warning, onRefresh } = props;

  const btn_loading = useAppLoginStore((s) => s.btn_loading);
  const resetDeviceId = useAppLoginStore((s) => s.resetDeviceId);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      staffCode: propData?.staffCode?.toUpperCase() || '',
      username: propData?.username || '',
      deviceId: propData?.deviceId || '',
    });
  }, [open, propData, form]);

  const onFinish = useCallback(async () => {
    try {
      const id = propData?.id || propData?._id;

      if (!id) {
        warning('No user selected');
        return;
      }

      const ok = await resetDeviceId({
        access_token,
        id,
      });

      if (ok) {
        success('Reset device ID success');
        form.resetFields();
        closeModal();
        onRefresh?.();
      } else {
        warning('Reset device ID failed');
      }
    } catch (e) {
      console.log(e);
      warning('Reset device ID failed');
    }
  }, [propData, resetDeviceId, access_token, success, warning, form, closeModal, onRefresh]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      destroyOnHidden
      footer={
        <Button
          onClick={onFinish}
          loading={btn_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Reset
        </Button>
      }
      closable={false}>
      <Card
        title="Reset Device ID"
        extra={
          <CloseCircleOutlined
            onClick={closeModal}
            className="cursor-pointer"
            style={{
              fontSize: 20,
              color: 'red',
            }}
          />
        }>
        <Form form={form} name="app_login_reset_device" labelAlign="top" autoComplete="off">
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item label="Staff Code" name="staffCode" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="staff code" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Username" name="username" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="username" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Device ID" name="deviceId" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="device id" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default ResetDeviceId;
