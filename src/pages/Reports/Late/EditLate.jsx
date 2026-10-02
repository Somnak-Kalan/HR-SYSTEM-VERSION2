import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Spin, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import dayjs from 'dayjs';

import { useLateTypeStore } from '../../../stores/lateType.store';

const getPermissionDate = (current) => {
  if (Array.isArray(current?.permission_date)) {
    return current.permission_date[0] || null;
  }

  if (current?.permission_date) {
    return {
      date: current.permission_date,
      day: current?.day,
    };
  }

  return null;
};

const EditLate = ({ open, setOpen, id, access_token, onSaved }) => {
  const [form] = Form.useForm();

  const current = useLateTypeStore((state) => state.current);

  const employeeInfo = useLateTypeStore((state) => state.employeeInfo);

  const currentLoading = useLateTypeStore((state) => state.currentLoading);

  const actionLoading = useLateTypeStore((state) => state.actionLoading);

  const fetchById = useLateTypeStore((state) => state.fetchById);

  const updateLate = useLateTypeStore((state) => state.updateLate);

  const clearCurrent = useLateTypeStore((state) => state.clearCurrent);

  const selectedDate = Form.useWatch('date', form);

  useEffect(() => {
    if (!open || !id) return;

    form.resetFields();

    fetchById(id, access_token).catch((error) => {
      message.warning(error?.message || 'Cannot get late request');
    });
  }, [open, id, access_token, fetchById, form]);

  useEffect(() => {
    if (!open || !current?._id) {
      return;
    }

    const permissionDate = getPermissionDate(current);

    form.setFieldsValue({
      id: current._id,

      employee: employeeInfo?.name || current?.name || current?.employeeId || '',

      company: employeeInfo?.company || '',

      department: employeeInfo?.department || '',

      position: employeeInfo?.position || current?.position || '',

      leader: employeeInfo?.leader || '',

      date: permissionDate?.date ? dayjs(permissionDate.date) : null,

      reason: current?.reason || '',
    });
  }, [open, current, employeeInfo, form]);

  const handleCancel = () => {
    form.resetFields();
    clearCurrent();
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      if (!current?._id) {
        throw new Error('Late request ID is missing');
      }

      const date = dayjs(values.date);

      await updateLate({
        access_token,
        id: current._id,
        permissionDate: [
          {
            date: date.format('YYYY-MM-DD'),
            day: date.format('dddd'),
          },
        ],
        reason: values.reason,
        status: current.status || 'approved',
      });

      message.success('Late request updated successfully');

      handleCancel();
      onSaved?.();
    } catch (error) {
      if (!error?.errorFields) {
        message.warning(error?.message || 'Cannot update late request');
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      width="70vw"
      closable={false}
      destroyOnHidden
      footer={
        <Button
          type="primary"
          loading={actionLoading}
          onClick={handleUpdate}
          style={{
            background: '#1677ff',
          }}>
          Update
        </Button>
      }>
      <Spin spinning={currentLoading}>
        <Card
          title="Update Late"
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              className="cursor-pointer"
              style={{
                fontSize: 20,
                color: 'red',
              }}
            />
          }>
          <Form form={form} autoComplete="off">
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <Row gutter={[12, 4]}>
              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Employee ID" labelCol={{ span: 24 }} name="employee">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Company" labelCol={{ span: 24 }} name="company">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Department" labelCol={{ span: 24 }} name="department">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Position" labelCol={{ span: 24 }} name="position">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Allow By" labelCol={{ span: 24 }} name="leader">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Date"
                  labelCol={{ span: 24 }}
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: 'Date is required',
                    },
                  ]}>
                  <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Select date" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Total Late" labelCol={{ span: 24 }}>
                  <div
                    style={{
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #d9d9d9',
                      borderRadius: 6,
                      paddingLeft: 11,
                    }}>
                    Total:
                    <strong
                      style={{
                        color: '#1677ff',
                        margin: '0 5px',
                      }}>
                      {selectedDate ? 1 : 0}
                    </strong>
                    day
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Reason"
                  labelCol={{ span: 24 }}
                  name="reason"
                  rules={[
                    {
                      required: true,
                      message: 'Reason is required',
                    },
                  ]}>
                  <TextArea rows={4} placeholder="Reason" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </Modal>
  );
};

export default EditLate;
