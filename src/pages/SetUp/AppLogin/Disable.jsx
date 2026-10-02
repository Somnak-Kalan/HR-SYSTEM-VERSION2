/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Form, Input, Button, Row, Col, Radio } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useCallback } from 'react';
import { useAppLoginStore } from '../../../stores/appLogin.store';

const DisableUser = (props) => {
  const { open, setOpen, form, propData, access_token, success, warning, onRefresh } = props;

  const btn_loading = useAppLoginStore((s) => s.btn_loading);
  const updateStatus = useAppLoginStore((s) => s.updateStatus);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    const currentStatus = String(propData?.status || 'active').toLowerCase();

    // if status is pending, auto provide active
    const status = currentStatus === 'inactive' ? 'inactive' : 'active';

    form.setFieldsValue({
      staffCode: propData?.staffCode?.toUpperCase() || '',
      username: propData?.username || '',
      employeeName: propData?.employeeName || '',
      status,
    });
  }, [open, propData, form]);

  const onFinish = useCallback(async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
      const id = propData?.employeeId || propData?.employeeId;

      if (!id) {
        warning('No user selected');
        return;
      }

      const doc = {
        id,
        // staffCode: propData?.staffCode,
        formData: {
          status: values?.status,
        },
      };

      const ok = await updateStatus({
        access_token,
        doc,
      });

      if (ok) {
        success('Update success');
        form.resetFields();
        closeModal();
        onRefresh?.();
      } else {
        warning('Update failed');
      }
    } catch (e) {
      console.log(e);
      warning('Update failed');
    }
  }, [form, propData, updateStatus, access_token, success, warning, closeModal, onRefresh]);

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
          Update
        </Button>
      }
      closable={false}>
      <Card
        title="Change Status"
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
        <Form form={form} name="app_login_disable_user" labelAlign="top" autoComplete="off">
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
              <Form.Item label="Employee Name" name="employeeName" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="employee name" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Status"
                name="status"
                className="m-0 p-0"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'field require' }]}>
                <Radio.Group>
                  <Radio value="active">Active</Radio>
                  <Radio value="inactive">Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default DisableUser;
