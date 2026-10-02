import { CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Col, Form, Input, Modal, Row, Spin, message, theme } from 'antd';
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

const getEmployeeName = (personalInfo) => {
  const khmerName = `${safe(personalInfo?.first_name)} ${safe(personalInfo?.last_name)}`.trim();

  const latinName = `${safe(personalInfo?.first_name_latin)} ${safe(personalInfo?.last_name_latin)}`.trim();

  if (khmerName && latinName) return `${khmerName} / ${latinName}`;
  return khmerName || latinName || '';
};

const ResignEmployee = (props) => {
  const { open, setOpen, selectedEmployee, access_token, onRefresh } = props;

  const {
    token: { colorBgContainer, colorText, colorBorder, colorFillAlter, colorError, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [checkedConfirm, setCheckedConfirm] = useState(false);

  const updateEmployeeStatus = useEmployeeStore((s) => s.updateEmployeeStatus);
  const setSelectedEmployee = useEmployeeStore((s) => s.setSelectedEmployee);

  const detailLoading = useEmployeeDetailStore((s) => s.loading);
  const fetchDetail = useEmployeeDetailStore((s) => s.fetchDetail);
  const resetDetail = useEmployeeDetailStore((s) => s.resetDetail);
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
    };
  }, [companyInfo, personalInfo, selectedEmployee]);

  useEffect(() => {
    if (!open) return;

    resetDetail();
    form.resetFields();
    setCheckedConfirm(false);

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
    setCheckedConfirm(false);
    resetDetail();
    setOpen(false);
  };

  const onFinish = async () => {
    if (!employeeId) {
      message.warning('Please select employee');
      return;
    }

    if (!checkedConfirm) {
      message.warning('Please tick confirm first');
      return;
    }

    try {
      setBtnLoading(true);

      const ok = await updateEmployeeStatus({
        access_token,
        id: employeeId,
        status: 'resign',
      });

      if (ok) {
        message.success('Resign Success');

        if (onRefresh) {
          await onRefresh();
        }

        setSelectedEmployee(null);
        closeModal();
      } else {
        message.warning('Resign Fail');
      }
    } catch (error) {
      message.warning(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Resign Fail');
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
      className="resign-employee-modal"
      styles={{
        content: {
          padding: 0,
          background: colorBgContainer,
        },
      }}>
      <Card
        title="Resign Employee"
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

              <Col span={24}>
                <Form.Item label="Position" name="position">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Alert
                  type="warning"
                  showIcon
                  message="Please check employee information before resign."
                  description="After save, this employee will be moved to resign status."
                  style={{
                    marginBottom: 14,
                  }}
                />
              </Col>

              <Col span={24}>
                <Checkbox
                  checked={checkedConfirm}
                  disabled={detailLoading}
                  onChange={(e) => setCheckedConfirm(e.target.checked)}>
                  I have checked and confirmed this employee resign information.
                </Checkbox>
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    marginTop: 18,
                    paddingTop: 12,
                    borderTop: `1px solid ${colorBorder}`,
                  }}>
                  <Button onClick={closeModal}>Cancel</Button>

                  <Button
                    danger
                    type="primary"
                    htmlType="submit"
                    loading={btnLoading}
                    disabled={!checkedConfirm || detailLoading}>
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
          .resign-employee-modal .ant-form-item-label > label {
            color: ${colorText} !important;
          }

          .resign-employee-modal .ant-input[disabled],
          .resign-employee-modal .ant-input-disabled {
            background: ${colorFillAlter} !important;
            color: ${colorText} !important;
            border-color: ${colorBorder} !important;
          }

          .resign-employee-modal .ant-checkbox-wrapper {
            color: ${colorText} !important;
          }
        `}
      </style>
    </Modal>
  );
};

export default ResignEmployee;
