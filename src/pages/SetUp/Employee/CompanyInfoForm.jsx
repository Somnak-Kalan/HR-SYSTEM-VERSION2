import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import OptionsService from '../../../services/options';
import LeaveTypeService from '../../../services/setup/LeaveType';
import ValidationEmployees from '../../../services/validation/setUp/employee';

const formatDate = (value) => {
  if (!value) return null;
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : null;
};

const CompanyInfoForm = (props) => {
  const {
    form,
    open,
    setCurrent,
    btnLoading,
    companyOpts,
    setCompanyOpts,
    departmentOpts,
    setDepartmentOpts,
    positionOpts,
    setPositionOpts,
    shiftManagementOpts,
    setShiftManagementOpts,
    setCompanyInfoDoc,
  } = props;

  const { access_token } = useContext(AuthContext);
  const [leaveTypeList, setLeaveTypeList] = useState([]);

  const getLeaveType = () => {
    OptionsService.GetLeaveTypeOpt({ access_token })
      .then((res) => {
        setLeaveTypeList(Array.isArray(res?.data) ? res?.data : []);
      })
      .catch((error) => {
        console.log(error);
        setLeaveTypeList([]);
      });
  };

  const getCompanyOptions = () => {
    OptionsService.getCompanyOptions({ access_token })
      .then((res) => {
        setCompanyOpts(Array.isArray(res?.data) ? res?.data : []);
      })
      .catch((error) => {
        console.log(error);
        setCompanyOpts([]);
      });
  };

  const getShiftManagementOptions = () => {
    OptionsService.getShiftManagementOptions({ access_token })
      .then((res) => {
        setShiftManagementOpts(Array.isArray(res?.data) ? res?.data : []);
      })
      .catch((error) => {
        console.log(error);
        setShiftManagementOpts([]);
      });
  };

  const getDepartmentOptions = (companyId) => {
    OptionsService.getDepartmentOptions({
      access_token,
      id: companyId,
    })
      .then((res) => {
        setDepartmentOpts(Array.isArray(res?.data) ? res?.data : []);
      })
      .catch((error) => {
        console.log(error);
        setDepartmentOpts([]);
      });
  };

  const getPositionOptions = (departmentId) => {
    OptionsService.getPositionOptions({
      access_token,
      id: departmentId,
    })
      .then((res) => {
        setPositionOpts(Array.isArray(res?.data) ? res?.data : []);
      })
      .catch((error) => {
        console.log(error);
        setPositionOpts([]);
      });
  };

  useEffect(() => {
    if (!open || !access_token) return;

    getLeaveType();
    getCompanyOptions();
    getShiftManagementOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, access_token]);

  const updateProbationMonth = () => {
    const joinDate = form.getFieldValue('join_date');
    const probationDate = form.getFieldValue('probation_date');

    if (
      !joinDate ||
      !probationDate ||
      !dayjs(joinDate).isValid() ||
      !dayjs(probationDate).isValid()
    ) {
      form.setFieldValue('probation', null);
      return;
    }

    const months = dayjs(probationDate).diff(
      dayjs(joinDate),
      'month'
    );

    form.setFieldValue('probation', months >= 0 ? months + 'M' : null);
  };


  const onFinish = (values) => {
    const doc = {
      company_info: {
        employee_id: String(values.employee_id || '')
          .trim()
          .toUpperCase(),
        company_id: values.company_id,
        department_id: values.department_id,
        position_id: values.position_id,
        join_date: formatDate(values.join_date),
        base_salary: Number(values.base_salary || 0),
        probation: Number(values.probation || 0),
        evaluation_period: Number(values.evaluation_period || 0),
        probation_date: formatDate(values.probation_date),
        passed_probation: formatDate(values.passed_probation),
        // working_status: 'Full-Time',
      },
      shift_management_id: values.shift_management_id || null,
      leave_type: Array.isArray(values.leave_type) ? values.leave_type : [],
    };

    setCompanyInfoDoc(doc);
    setCurrent(2);
  };

  return (
    <div>
      <Form
        form={form}
        name="company_form"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          base_salary: 0,
          probation: 3,
          evaluation_period: 2,
        }}>
        <Row gutter={[8, 2]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              name="employee_id"
              label="Employee ID"
              rules={[
                {
                  required: true,
                  message: 'Field is required',
                },
                {
                  validator: async (_, value) => {
                    if (!value) return Promise.resolve();

                    if (/\s/.test(value)) {
                      return Promise.reject(new Error('Not contain space'));
                    }

                    const employeeId = String(value).trim().toUpperCase();

                    const result = await ValidationEmployees.Validate_Create_Employee_Card_id({
                      access_token,
                      doc: { employee_id: employeeId },
                    });

                    if (result === true || result?.check === true) {
                      return Promise.reject(new Error('Id already exists'));
                    }

                    return Promise.resolve();
                  },
                },
              ]}>
              <Input
                placeholder="Employee ID"
                onBlur={(e) => {
                  form.setFieldValue(
                    'employee_id',
                    String(e.target.value || '')
                      .trim()
                      .toUpperCase()
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="company_id" label="Company" rules={[{ required: true, message: 'field require' }]}>
              <Select
                showSearch
                allowClear
                optionFilterProp="label"
                placeholder="Company"
                options={companyOpts}
                onChange={(value) => {
                  form.setFieldsValue({
                    department_id: null,
                    position_id: null,
                  });

                  setDepartmentOpts([]);
                  setPositionOpts([]);

                  if (value) getDepartmentOptions(value);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="department_id" label="Department" rules={[{ required: true, message: 'field require' }]}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Department"
                options={departmentOpts}
                onChange={(value) => {
                  form.setFieldValue('position_id', null);
                  setPositionOpts([]);

                  if (value) getPositionOptions(value);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="position_id" label="Position" rules={[{ required: true, message: 'field require' }]}>
              <Select allowClear showSearch optionFilterProp="label" placeholder="Position" options={positionOpts} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="shift_management_id" label="Shift Name">
              <Select showSearch optionFilterProp="label" placeholder="Shift Name" options={shiftManagementOpts} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="leave_type" label="Leave Type">
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                placeholder="Select leave type"
                options={leaveTypeList}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              name="join_date"
              label="Join Date"
              rules={[{ required: true, message: 'field require' }]}
            >
              <DatePicker
                placeholder="YYYY-MM-DD"
                style={{ width: '100%' }}
                onChange={updateProbationMonth}
              />
            </Form.Item>
          </Col>
          {/* 
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="base_salary" label="Base Salary">
              <InputNumber placeholder="Base Salary" style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col> */}
          {/* 
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="probation" label="Probation Month" rules={[{ required: true, message: 'field require' }]}>
              <InputNumber placeholder="Probation" style={{ width: '100%' }} min={0} onChange={updateProbationDate} />
            </Form.Item>
          </Col> */}

          {/* <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item name="evaluation_period" label="Evaluation Period Month">
              <InputNumber placeholder="Evaluation Period" style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col> */}
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              name="probation_date"
              label="Probation Date"
              rules={[{ required: true, message: 'field require' }]}
            >
              <DatePicker
                placeholder="YYYY-MM-DD"
                style={{ width: '100%' }}
                onChange={updateProbationMonth}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              name="probation"
              label="Probation Month"
              rules={[{ required: true, message: 'field require' }]}
            >
              <Input
                disabled
                placeholder="3M"

              />
            </Form.Item>
          </Col>


          <Col span={24}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col span={12} align="right">
                <Space>
                  <Button onClick={() => setCurrent(0)}>Previous</Button>

                  <Button
                    loading={btnLoading}
                    type="primary"
                    htmlType="submit"
                    style={{ background: '#1677ff' }}
                    className="cursor-pointer text-white">
                    Next
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CompanyInfoForm;
