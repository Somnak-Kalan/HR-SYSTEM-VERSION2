import { Button, Card, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Spin, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { useMissScanStore } from '../../../stores/Reports/missScan.store';

const AddMissScan = ({ open, setOpen, access_token, onSaved }) => {
  const [form] = Form.useForm();

  const [requestType, setRequestType] = useState('full');

  const employeeInfo = useMissScanStore((state) => state.employeeInfo);

  const employeeInfoLoading = useMissScanStore((state) => state.employeeInfoLoading);

  const employeeOptions = useMissScanStore((state) => state.employeeOptions);

  const employeeOptionsLoading = useMissScanStore((state) => state.employeeOptionsLoading);

  const actionLoading = useMissScanStore((state) => state.actionLoading);

  const fetchEmployeeOptions = useMissScanStore((state) => state.fetchEmployeeOptions);

  const fetchEmployeeInfo = useMissScanStore((state) => state.fetchEmployeeInfo);

  const clearEmployeeContext = useMissScanStore((state) => state.clearEmployeeContext);

  const addMiss = useMissScanStore((state) => state.addMiss);

  const selectedDate = Form.useWatch('date', form);

  const totalDays = useMemo(() => {
    if (!selectedDate) {
      return 0;
    }

    if (requestType === 'morning' || requestType === 'afternoon') {
      return 0.5;
    }

    return 1;
  }, [selectedDate, requestType]);

  useEffect(() => {
    if (!open) return;

    form.resetFields();
    clearEmployeeContext();
    setRequestType('full');
  }, [open, form, clearEmployeeContext]);

  const clearEmployeeFields = () => {
    form.setFieldsValue({
      company: '',
      department: '',
      position: '',
      leader: '',
      date: null,
    });

    setRequestType('full');
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
    setRequestType('full');
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const requestDate = dayjs(values.date);

      const permissionDate = [
        {
          date: requestDate.format('YYYY-MM-DD'),

          day: requestDate.format('dddd'),

          status_request: requestType,
        },
      ];

      await addMiss({
        access_token,

        employeeId: values.employeeId,

        permissionDate,

        reason: values.reason,

        status: 'approved',
      });

      message.success('Missed scan created successfully');

      handleCancel();
      onSaved?.();
    } catch (error) {
      if (!error?.errorFields) {
        message.warning(error?.message || 'Cannot create missed scan');
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
          title="Add Missed Scan"
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
                  labelCol={{
                    span: 24,
                  }}
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
                    onSearch={(value) => {
                      fetchEmployeeOptions(value, access_token);
                    }}
                    onChange={handleEmployeeChange}
                    options={employeeOptions.map((item) => ({
                      value: item?.value || item?._id,

                      label: item?.label || item?.name,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Company"
                  labelCol={{
                    span: 24,
                  }}
                  name="company">
                  <Input disabled placeholder="Company" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Department"
                  labelCol={{
                    span: 24,
                  }}
                  name="department">
                  <Input disabled placeholder="Department" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Position"
                  labelCol={{
                    span: 24,
                  }}
                  name="position">
                  <Input disabled placeholder="Position" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Allow By"
                  labelCol={{
                    span: 24,
                  }}
                  name="leader">
                  <Input disabled placeholder="Allow by" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label="Date"
                  labelCol={{
                    span: 24,
                  }}
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
                <Form.Item
                  label="Total Leave"
                  labelCol={{
                    span: 24,
                  }}
                  hidden>
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
                      {totalDays}
                    </strong>
                    day
                  </div>
                </Form.Item>
              </Col>

              {selectedDate && (
                <Col span={24}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 160px 1fr',
                      alignItems: 'center',
                      gap: 12,
                      border: '1px solid #d9d9d9',
                      borderRadius: 6,
                      padding: '12px 16px',
                      marginBottom: 12,
                    }}>
                    <span
                      style={{
                        color: '#3457d5',
                      }}>
                      {dayjs(selectedDate).format('YYYY-MMMM-D')}
                    </span>

                    <span
                      style={{
                        color: dayjs(selectedDate).format('dddd') === 'Sunday' ? 'red' : '#3457d5',
                      }}>
                      {dayjs(selectedDate).format('dddd')}
                    </span>

                    <Radio.Group
                      value={requestType}
                      onChange={(event) => {
                        setRequestType(event.target.value);
                      }}>
                      <Radio value="full">Full Day</Radio>

                      <Radio value="morning">Morning</Radio>

                      <Radio value="afternoon">Afternoon</Radio>
                    </Radio.Group>
                  </div>
                </Col>
              )}

              <Col xs={24}>
                <Form.Item
                  label="Reason"
                  labelCol={{
                    span: 24,
                  }}
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

export default AddMissScan;
