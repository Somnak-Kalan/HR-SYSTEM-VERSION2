import { Select, DatePicker, Form, Input, InputNumber, Flex, Button, Card, Modal, Row, Col, message } from 'antd';
import { useContext, useEffect, useCallback, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import OptionsService from '../../../../../services/options';
import ValidationEmployees from '../../../../../services/validation/setUp/employee';
import { AuthContext } from '../../../../../contexts/AuthContext';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';
import EditIcon from '../../../../../assets/icons/white_edit.svg'
const formatDate = (value) => {
  if (!value) return null;
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : null;
};

const getOptionArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

const EmployeeInformation = (props) => {
  const { company_info, props_company_id, props_department_id } = props;

  const updateCompanyInfo = useEmployeeDetailStore((s) => s.updateCompanyInfo);
  const storeLoading = useEmployeeDetailStore((s) => s.loading);

  const { username, access_token } = useContext(AuthContext);
  const { id } = useParams();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [companyOpts, setCompanyOpts] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [positionOpts, setPositionOpts] = useState([]);

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);
  const onCloseModal = () => setOpen(false);

  const getCompanyOptions = useCallback(async () => {
    try {
      const res = await OptionsService.getCompanyOptions({
        access_token,
      });

      setCompanyOpts(getOptionArray(res));
    } catch (error) {
      setCompanyOpts([]);
    }
  }, [access_token]);

  const getDepartmentOptions = useCallback(
    async (companyId) => {
      if (!companyId) {
        setDepartmentOpts([]);
        return;
      }

      try {
        const res = await OptionsService.getDepartmentOptions({
          access_token,
          id: companyId,
        });

        setDepartmentOpts(getOptionArray(res));
      } catch (error) {
        setDepartmentOpts([]);
      }
    },
    [access_token]
  );

  const getPositionOptions = useCallback(
    async (departmentId) => {
      if (!departmentId) {
        setPositionOpts([]);
        return;
      }

      try {
        const res = await OptionsService.getPositionOptions({
          access_token,
          id: departmentId,
        });

        setPositionOpts(getOptionArray(res));
      } catch (error) {
        setPositionOpts([]);
      }
    },
    [access_token]
  );

  const updateProbationDate = () => {
    const joinDate = form.getFieldValue('join_date');
    const probation = Number(form.getFieldValue('probation') || 0);

    if (!joinDate || !dayjs(joinDate).isValid()) return;

    form.setFieldValue('probation_date', dayjs(joinDate).add(probation, 'month'));
  };

  useEffect(() => {
    if (!open || !access_token) return;

    getCompanyOptions();
  }, [open, access_token, getCompanyOptions]);

  useEffect(() => {
    if (!open || !company_info) return;

    const companyId = company_info?.company_id || props_company_id || null;
    const departmentId = company_info?.department_id || props_department_id || null;

    form.setFieldsValue({
      ...company_info,

      employee_id: company_info?.employee_id || '',

      company_id: companyId,
      department_id: departmentId,
      position_id: company_info?.position_id || null,

      base_salary: Number(company_info?.base_salary || 0),
      probation: Number(company_info?.probation || 0),
      evaluation_period: Number(company_info?.evaluation_period || 0),

      join_date:
        company_info?.join_date && dayjs(company_info.join_date).isValid() ? dayjs(company_info.join_date) : null,

      probation_date:
        company_info?.probation_date && dayjs(company_info.probation_date).isValid()
          ? dayjs(company_info.probation_date)
          : null,

      passed_probation:
        company_info?.passed_probation && dayjs(company_info.passed_probation).isValid()
          ? dayjs(company_info.passed_probation)
          : null,
    });

    if (companyId) {
      getDepartmentOptions(companyId);
    }

    if (departmentId) {
      getPositionOptions(departmentId);
    }
  }, [open, form, company_info, props_company_id, props_department_id, getDepartmentOptions, getPositionOptions]);

  const onChangeCompany = (value) => {
    form.setFieldsValue({
      department_id: null,
      position_id: null,
    });

    setDepartmentOpts([]);
    setPositionOpts([]);

    if (value) {
      getDepartmentOptions(value);
    }
  };

  const onChangeDepartment = (value) => {
    form.setFieldsValue({
      position_id: null,
    });

    setPositionOpts([]);

    if (value) {
      getPositionOptions(value);
    }
  };

  const onFinish = async (values) => {
    setBtnLoading(true);

    try {
      const doc = {
        id,
        jsonData: {
          employee_id: String(values.employee_id || '').trim(),
          company_id: values.company_id,
          department_id: values.department_id,
          position_id: values.position_id,
          join_date: formatDate(values.join_date),
          base_salary: Number(values.base_salary || 0),
          probation: Number(values.probation || 0),
          evaluation_period: Number(values.evaluation_period || 0),
          probation_date: formatDate(values.probation_date),
          passed_probation: formatDate(values.passed_probation),
        },
        // user: username,
      };

      const ok = await updateCompanyInfo({
        id,
        access_token,
        doc,
      });

      if (ok) {
        messageApi.success('Update Success');
        setOpen(false);
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Update Fail');
    } finally {
      setBtnLoading(false);
    }
  };

  const onFinishFailed = () => { };

  return (
    <>
      {contextHolder}

      <div>


        <Button

          type="primary"
          icon={<img src={EditIcon} />}
          onClick={showModal}
          style={{
            width: 28,
            height: 28,
            minWidth: 28,
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            background: '#fa8c16',
            borderColor: '#fa8c16',
            boxShadow: 'none',
          }}
        />
      </div>

      <Modal open={open} onCancel={handleCancel} footer="" width="65vw" closable={false}>
        <Card
          title="Update Company Info"
          extra={
            <CloseCircleOutlined
              onClick={onCloseModal}
              className="cursor-pointer"
              style={{ fontSize: '20px', color: 'red' }}
            />
          }>
          <Form
            form={form}
            name="edit_company_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Row gutter={[8, 2]}>
              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Employee ID"
                  name="employee_id"
                  labelCol={{ span: 24 }}
                  className="m-0 p-0"
                  validateTrigger="onChange"
                  validateDebounce={500}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Employee ID is required',
                    },
                    {
                      validator: async (_, value) => {
                        if (!value) {
                          return Promise.resolve();
                        }

                        if (/\s/.test(value)) {
                          return Promise.reject(new Error('Employee ID must not contain spaces'));
                        }

                        // Normalize the currently entered Employee ID
                        const employeeId = String(value).trim().toUpperCase();

                        // Employee ID received from employee detail API
                        const originalEmployeeId = String(company_info?.employee_id || '')
                          .trim()
                          .toUpperCase();

                        // Same Employee ID as the current employee
                        // No need to call duplicate validation API
                        if (employeeId === originalEmployeeId) {
                          return Promise.resolve();
                        }

                        try {
                          const response = await ValidationEmployees.Validate_Update_Employee_Card_id({
                            access_token,
                            doc: {
                              id,
                              employee_id: employeeId,
                            },
                          });

                          const data = response?.data ?? response;

                          if (data?.check === true) {
                            return Promise.reject(new Error(data?.message || 'Employee ID already exists'));
                          }

                          return Promise.resolve();
                        } catch (error) {
                          const errorData = error?.response?.data ?? error;

                          // Supports:
                          // {
                          //   message: 'You cannot use this id!!!',
                          //   check: true
                          // }
                          if (errorData?.check === true) {
                            return Promise.reject(new Error(errorData?.message || 'Employee ID already exists'));
                          }
                          // Supports:
                          // {
                          //   statusCode: 409,
                          //   message: 'Employee ID is already exists'
                          // }
                          if (error?.response?.status === 409 || errorData?.statusCode === 409) {
                            return Promise.reject(new Error(errorData?.message || 'Employee ID already exists'));
                          }

                          return Promise.reject(
                            new Error(
                              errorData?.message || errorData?.msg || error?.message || 'Cannot validate Employee ID'
                            )
                          );
                        }
                      },
                    },
                  ]}>
                  <Input
                    placeholder="Employee ID"
                    onBlur={(event) => {
                      const employeeId = String(event.target.value || '')
                        .trim()
                        .toUpperCase();

                      form.setFieldValue('employee_id', employeeId);

                      form.validateFields(['employee_id']).catch(() => { });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Company"
                  labelCol={{ span: 24 }}
                  name="company_id"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require!' }]}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Company"
                    options={companyOpts}
                    onChange={onChangeCompany}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Department"
                  labelCol={{ span: 24 }}
                  name="department_id"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require!' }]}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Department"
                    options={departmentOpts}
                    onChange={onChangeDepartment}
                    disabled={!departmentOpts.length}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Position"
                  labelCol={{ span: 24 }}
                  name="position_id"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require!' }]}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Position"
                    options={positionOpts}
                    disabled={!positionOpts.length}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Join Date"
                  labelCol={{ span: 24 }}
                  name="join_date"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require' }]}>
                  <DatePicker className="w-full" placeholder="YYYY-MM-DD" onChange={updateProbationDate} />
                </Form.Item>
              </Col>
              {/* 
              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item label="Base Salary" labelCol={{ span: 24 }} name="base_salary" className="m-0 p-0">
                  <InputNumber placeholder="Base Salary" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col> */}


              {/* 
              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Evaluation Period Month"
                  labelCol={{ span: 24 }}
                  name="evaluation_period"
                  className="m-0 p-0">
                  <InputNumber placeholder="Evaluation Period" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col> */}

              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Probation Date"
                  labelCol={{ span: 24 }}
                  name="probation_date"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require' }]}>
                  <DatePicker className="w-full" placeholder="YYYY-MM-DD" />
                </Form.Item>
              </Col>

              {/* <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item label="Passed Probation" labelCol={{ span: 24 }} name="passed_probation" className="m-0 p-0">
                  <DatePicker className="w-full" placeholder="YYYY-MM-DD" />
                </Form.Item>
              </Col> */}
              <Col xs={24} sm={24} md={12} lg={8} className="my-2">
                <Form.Item
                  label="Probation Month"
                  labelCol={{ span: 24 }}
                  name="probation"
                  className="m-0 p-0"
                  rules={[{ required: true, message: 'field require' }]}>
                  <InputNumber
                    placeholder="Probation"
                    style={{ width: '100%' }}
                    min={0}
                    onChange={updateProbationDate}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="right" className="mt-5">
              <Form.Item className="m-0 p-0">
                <Button
                  loading={btnLoading || storeLoading}
                  type="primary"
                  htmlType="submit"
                  style={{ background: '#1677ff' }}
                  className="cursor-pointer text-white">
                  Update
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default EmployeeInformation;
