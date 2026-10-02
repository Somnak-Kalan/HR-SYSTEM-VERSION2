/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Form, Input, Button, Row, Col, DatePicker } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useCallback } from 'react';

import { useAppLoginStore } from '../../../stores/appLogin.store';

const ChangePassword = (props) => {
  const { open, setOpen, form, propData, access_token, success, warning, onRefresh } = props;

  const btn_loading = useAppLoginStore((s) => s.btn_loading);
  const changePassword = useAppLoginStore((s) => s.changePassword);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      dateActive: propData?.createdAt ? dayjs(propData.createdAt) : null,
      staffCode: propData?.staffCode?.toUpperCase() || '',
      username: propData?.username || '',
      employeeName: propData?.employeeName || '',
      employeeNameLatin: propData?.employeeNameLatin || '',
      passwordMask: '*********',
      password: null,
      confirm_password: null,
    });
  }, [open, propData, form]);

  const onFinish = useCallback(async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
      const id = propData?.id || propData?._id;

      if (!id) {
        warning('No user selected');
        return;
      }

      const doc = {
        id,
        // staffCode: propData?.staffCode,
        formData: {
          password: values?.password,
        },
      };

      const ok = await changePassword({
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
  }, [form, propData, changePassword, access_token, success, warning, closeModal, onRefresh]);

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      width="50vw"
      destroyOnHidden
      footer={
        <Button
          onClick={onFinish}
          loading={btn_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Save Change
        </Button>
      }
      closable={false}>
      <Card
        title="Change Password User"
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
        <Form form={form} name="app_login_change_password" labelAlign="top" autoComplete="off">
          <Row gutter={[8, 8]}>
            <Col xs={24} xl={12}>
              <Form.Item label="Date Active" name="dateActive" className="m-0 p-0" labelCol={{ span: 24 }}>
                <DatePicker disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item label="Staff Code" name="staffCode" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="staff code" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item label="Username" name="username" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="username" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item label="Employee Name" name="employeeName" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="employee name" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item
                label="Employee Name Latin"
                name="employeeNameLatin"
                className="m-0 p-0"
                labelCol={{ span: 24 }}>
                <Input readOnly disabled placeholder="employee name latin" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item label="Current Password" name="passwordMask" className="m-0 p-0" labelCol={{ span: 24 }}>
                <Input.Password readOnly disabled visibilityToggle={false} placeholder="*********" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item
                label="New Password"
                name="password"
                className="m-0 p-0"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: 'field require' },
                  {
                    min: 5,
                    message: 'Password must be at least 5 characters long',
                  },
                ]}>
                <Input.Password placeholder="new password" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                className="m-0 p-0"
                labelCol={{ span: 24 }}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'field require' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}>
                <Input.Password placeholder="confirm password" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default ChangePassword;
