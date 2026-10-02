import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Spin, message, theme } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useEmployeeStore } from '../../../stores/employee.store';
import { useEmployeeDetailStore } from '../../../stores/employeeDetail.store';

const safe = (value) => {
  if (value === undefined || value === null || value === 'undefined' || value === 'null') {
    return '';
  }

  return value;
};

const getEmployeeId = (employee) => {
  return employee?.id || employee?._id;
};

const formatDate = (value) => {
  const text = String(safe(value)).trim();

  if (!text) return '';

  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);

  if (match) return match[1];

  const date = new Date(text);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('en-GB');
  }

  return text;
};

const formatGender = (value) => {
  const text = String(safe(value)).trim().toLowerCase();

  if (!text) return '';
  if (text === 'm' || text === 'male') return 'Male';
  if (text === 'f' || text === 'female') return 'Female';

  return safe(value);
};

const getDefaultStatus = (statusValue) => {
  const status = String(statusValue || 'active').toLowerCase();

  if (status === 'inactive' || status === 'disabled' || status === 'disable') {
    return 'inactive';
  }

  if (status === 'resign') {
    return 'inactive';
  }

  return 'active';
};

const getEmployeeName = (personalInfo) => {
  const khmerName = `${safe(personalInfo?.first_name)} ${safe(personalInfo?.last_name)}`.trim();

  const latinName = `${safe(personalInfo?.first_name_latin)} ${safe(personalInfo?.last_name_latin)}`.trim();

  if (khmerName && latinName) return `${khmerName} / ${latinName}`;
  return khmerName || latinName || '';
};

const ChangeEmployeeStatus = (props) => {
  const { open, setOpen, selectedEmployee, access_token, onRefresh } = props;

  const {
    token: { colorBgContainer, colorText, colorBorder, colorFillAlter, colorError, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);

  const updateEmployeeStatus = useEmployeeStore((s) => s.updateEmployeeStatus);
  const setSelectedEmployee = useEmployeeStore((s) => s.setSelectedEmployee);

  const detailLoading = useEmployeeDetailStore((s) => s.loading);
  const fetchDetail = useEmployeeDetailStore((s) => s.fetchDetail);
  const resetDetail = useEmployeeDetailStore((s) => s.resetDetail);
  const detailStatus = useEmployeeDetailStore((s) => s.status);
  const personalInfo = useEmployeeDetailStore((s) => s.personal_info);
  const companyInfo = useEmployeeDetailStore((s) => s.company_info);

  const employeeId = getEmployeeId(selectedEmployee);

  const employeeInfo = useMemo(() => {
    return {
      staffCode: String(safe(companyInfo?.employee_id || selectedEmployee?.employee_id)).toUpperCase(),
      username: safe(selectedEmployee?.username),
      employeeName: getEmployeeName(personalInfo),
      company: safe(companyInfo?.company),
      department: safe(companyInfo?.department),
      position: safe(companyInfo?.position),
      identityCard: safe(personalInfo?.identity_card_id),
      dateOfBirth: formatDate(personalInfo?.dob),
      phoneNumber: safe(personalInfo?.phone_number),
      joiningDate: formatDate(companyInfo?.join_date),
      gender: formatGender(personalInfo?.gender),
      status: getDefaultStatus(detailStatus || selectedEmployee?.status),
    };
  }, [companyInfo, detailStatus, personalInfo, selectedEmployee]);

  useEffect(() => {
    if (!open) return;

    resetDetail();
    form.resetFields();

    if (!employeeId || !access_token) return;

    fetchDetail({
      id: employeeId,
      access_token,
      force: true,
    });
  }, [open, employeeId, access_token, fetchDetail, resetDetail, form]);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue(employeeInfo);
  }, [open, employeeInfo, form]);

  const closeModal = () => {
    form.resetFields();
    resetDetail();
    setOpen(false);
  };

  const onFinish = async (values) => {
    if (!employeeId) {
      message.warning('Please select employee');
      return;
    }

    try {
      setBtnLoading(true);

      const nextStatus = String(values?.status || '').toLowerCase();

      const ok = await updateEmployeeStatus({
        access_token,
        id: employeeId,
        status: nextStatus,
      });

      if (ok) {
        message.success('Change Status Success');

        if (onRefresh) {
          await onRefresh();
        }

        setSelectedEmployee(null);
        closeModal();
      } else {
        message.warning('Change Status Fail');
      }
    } catch (error) {
      message.warning(
        error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Change Status Fail'
      );
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      onCancel={closeModal}
      width={820}
      centered
      destroyOnHidden
      className="change-employee-status-modal"
      styles={{
        content: {
          padding: 0,
          background: colorBgContainer,
        },
      }}>
      <Card
        title="Change Status"
        extra={
          <CloseCircleOutlined
            onClick={closeModal}
            style={{
              color: colorError,
              fontSize: 26,
              cursor: 'pointer',
            }}
          />
        }
        style={{
          background: colorBgContainer,
          color: colorText,
          border: `1px solid ${colorBorder}`,
          borderRadius: borderRadiusLG,
        }}
        styles={{
          header: {
            background: colorBgContainer,
            color: colorText,
            borderBottom: `1px solid ${colorBorder}`,
          },
          body: {
            background: colorBgContainer,
            color: colorText,
          },
        }}>
        <Spin spinning={detailLoading} description="Loading employee...">
          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Staff Code" name="staffCode">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Employee Name" name="employeeName">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Identity Card" name="identityCard">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Phone Number" name="phoneNumber">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Joining Date" name="joiningDate">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Gender" name="gender">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Company" name="company">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Department" name="department">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item label="Position" name="position">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: 'Please select status',
                    },
                  ]}>
                  <Radio.Group>
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: `1px solid ${colorBorder}`,
                  }}>
                  <Button onClick={closeModal}>Cancel</Button>

                  <Button type="primary" htmlType="submit" loading={btnLoading} disabled={detailLoading}>
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>

      <style>
        {`
          .change-employee-status-modal .ant-form-item-label > label {
            color: ${colorText} !important;
          }

          .change-employee-status-modal .ant-input[disabled],
          .change-employee-status-modal .ant-input-disabled {
            background: ${colorFillAlter} !important;
            color: ${colorText} !important;
            border-color: ${colorBorder} !important;
          }

          .change-employee-status-modal .ant-radio-wrapper {
            color: ${colorText} !important;
          }
        `}
      </style>
    </Modal>
  );
};

export default ChangeEmployeeStatus;
