import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

import { useLateTypeStore } from '../../../stores/lateType.store';

const AddLate = ({ open, setOpen, access_token, onSaved }) => {
  const [form] = Form.useForm();
  const searchTimer = useRef(null);

  const employeeInfo = useLateTypeStore((state) => state.employeeInfo);

  const employeeInfoLoading = useLateTypeStore((state) => state.employeeInfoLoading);

  const employeeOptions = useLateTypeStore((state) => state.employeeOptions);

  const employeeOptionsLoading = useLateTypeStore((state) => state.employeeOptionsLoading);

  const actionLoading = useLateTypeStore((state) => state.actionLoading);

  const fetchEmployeeOptions = useLateTypeStore((state) => state.fetchEmployeeOptions);

  const fetchEmployeeInfo = useLateTypeStore((state) => state.fetchEmployeeInfo);

  const clearEmployeeContext = useLateTypeStore((state) => state.clearEmployeeContext);

  const createLate = useLateTypeStore((state) => state.createLate);

  const selectedDate = Form.useWatch('date', form);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    clearEmployeeContext();

    return () => {
      clearTimeout(searchTimer.current);
    };
  }, [open, form, clearEmployeeContext]);

  const clearEmployeeFields = () => {
    form.setFieldsValue({
      company: '',
      department: '',
      position: '',
      leader: '',
      date: null,
    });
  };

  const handleEmployeeSearch = (value) => {
    clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      fetchEmployeeOptions(value, access_token);
    }, 250);
  };

  const handleEmployeeChange = async (employeeId) => {
    clearEmployeeFields();

    if (!employeeId) {
      clearEmployeeContext();
      return;
    }

    try {
      const info = await fetchEmployeeInfo(employeeId, access_token);

      form.setFieldsValue({
        company: info?.company || '',
        department: info?.department || '',
        position: info?.position || '',
        leader: info?.leader || '',
      });
    } catch (error) {
      message.warning(error?.message || 'Employee not found');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearEmployeeContext();
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const date = dayjs(values.date);

      await createLate({
        access_token,
        employeeId: values.employeeId,
        permissionDate: [
          {
            date: date.format('YYYY-MM-DD'),
            day: date.format('dddd'),
          },
        ],
        reason: values.reason,
        status: 'approved',
      });

      message.success('Late request created successfully');

      handleCancel();
      onSaved?.();
    } catch (error) {
      if (!error?.errorFields) {
        message.warning(error?.message || 'Cannot create late request');
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
          onClick={handleSave}
          style={{
            background: '#1677ff',
          }}>
          Save
        </Button>
      }>
      <Spin spinning={employeeInfoLoading}>
        <Card
          title="Add Late"
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
            <Row gutter={[12, 4]}>
              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Employee ID"
                  labelCol={{ span: 24 }}
                  name="employeeId"
                  rules={[
                    {
                      required: true,
                      message: 'Employee ID is required',
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    filterOption={false}
                    loading={employeeOptionsLoading}
                    placeholder="Search employee ID"
                    onSearch={handleEmployeeSearch}
                    onChange={handleEmployeeChange}
                    options={employeeOptions.map((item) => ({
                      value: item?.value || item?._id,
                      label: item?.label || item?.name,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Company" labelCol={{ span: 24 }} name="company">
                  <Input disabled placeholder="Company" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Department" labelCol={{ span: 24 }} name="department">
                  <Input disabled placeholder="Department" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Position" labelCol={{ span: 24 }} name="position">
                  <Input disabled placeholder="Position" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item label="Allow By" labelCol={{ span: 24 }} name="leader">
                  <Input disabled placeholder="Allow by" />
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
                  <DatePicker
                    className="w-full"
                    format="YYYY-MM-DD"
                    placeholder="Select date"
                    disabled={!employeeInfo?._id}
                  />
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

export default AddLate;
