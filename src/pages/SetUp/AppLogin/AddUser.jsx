/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Form, Select, Input, Button, Row, Col, DatePicker } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState, useCallback } from 'react';

import EmployeeOptServices from '../../../services/options/employee';
import PositionOptionService from '../../../services/options/position';
import EmployeeService from '../../../services/setup/employee';
import ValidateAppLoginService from '../../../services/validation/setUp/appLogin';
import CustomAutoComplete from '../../../components/config/AutoComplete';

import { useAppLoginStore } from '../../../stores/appLogin.store';
const __otpCache = {
  key: '',

  empOtp: null,
  posOtp: null,
  empAll: null,

  //  in-flight promises (dedupe concurrent calls / strictmode double mount)
  empOtpPromise: null,
  posOtpPromise: null,
  empAllPromise: null,
};
const AddUser = (props) => {
  const { open, setOpen, form, access_token, success, warning } = props;

  const btn_loading = useAppLoginStore((s) => s.btn_loading);
  const registerUser = useAppLoginStore((s) => s.registerUser);
  const fetchUsers = useAppLoginStore((s) => s.fetchUsers);

  const [employee_loading, setEmployeeLoading] = useState(false);
  const [position_loading, setPositionLoading] = useState(false);

  const [employee_options, setEmployeeOptions] = useState([]);

  const [employee_list, setEmployeeList] = useState([]);
  const [position_list, setPositionList] = useState([]);

  const [employee, setEmployee] = useState([]);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // load OTP lists once per open (fast + stable)
  useEffect(() => {
    if (!open || !access_token) return;

    let alive = true;
    const cacheKey = String(access_token);

    (async () => {
      try {
        setEmployeeLoading(true);
        setPositionLoading(true);

        //  if token changed, reset cache
        if (__otpCache.key !== cacheKey) {
          __otpCache.key = cacheKey;
          __otpCache.empOtp = null;
          __otpCache.posOtp = null;
          __otpCache.empAll = null;
          __otpCache.empOtpPromise = null;
          __otpCache.posOtpPromise = null;
          __otpCache.empAllPromise = null;
        }

        //  1) Employee OTP
        if (!__otpCache.empOtp) {
          __otpCache.empOtpPromise =
            __otpCache.empOtpPromise ||
            EmployeeOptServices.Get_Employee_Otp({ access_token }).then((res) => {
              __otpCache.empOtp = Array.isArray(res) ? res : [];
              return __otpCache.empOtp;
            });
        }

        //  2) Position OTP
        if (!__otpCache.posOtp) {
          __otpCache.posOtpPromise =
            __otpCache.posOtpPromise ||
            PositionOptionService.Get_Position_Otp({ access_token }).then((res) => {
              __otpCache.posOtp = Array.isArray(res) ? res : [];
              return __otpCache.posOtp;
            });
        }

        //  3) Employee list
        if (!__otpCache.empAll) {
          __otpCache.empAllPromise =
            __otpCache.empAllPromise ||
            EmployeeService.Get_Employee({ access_token }).then((res) => {
              __otpCache.empAll = Array.isArray(res?.data) ? res.data : [];
              return __otpCache.empAll;
            });
        }

        // wait all (from cache or in-flight promise)
        const [empOtp, posOtp, empAll] = await Promise.all([
          __otpCache.empOtpPromise || Promise.resolve(__otpCache.empOtp || []),
          __otpCache.posOtpPromise || Promise.resolve(__otpCache.posOtp || []),
          __otpCache.empAllPromise || Promise.resolve(__otpCache.empAll || []),
        ]);

        if (!alive) return;

        setEmployeeList(empOtp);
        setPositionList(posOtp);
        setEmployee(empAll);
      } catch (e) {
        if (!alive) return;
        setEmployeeList([]);
        setPositionList([]);
        setEmployee([]);
      } finally {
        if (!alive) return;
        setEmployeeLoading(false);
        setPositionLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, access_token]);

  // build autocomplete options (from active employees)
  const handleSearchEmployeeCode = useCallback(
    (value) => {
      const v = String(value || '').toUpperCase();
      const options = employee
        .filter((el) => el?.employee_id && el?.status !== 'Inactive' && el.employee_id.toUpperCase().includes(v))
        .slice(0, 30)
        .map((el) => ({ value: el.employee_id }));

      setEmployeeOptions(options);
    },
    [employee]
  );
  const onSelectEmployeeCode = useCallback(
    async (employee_code) => {
      form.setFieldsValue({
        id: null,
        employee_id: null,
        position_id: null,
        vtsIdShow: null,
      });

      try {
        setEmployeeLoading(true);
        setPositionLoading(true);

        const doc = { employee_card_id: employee_code };
        const res = await EmployeeOptServices.Search_Employee_Card_Id({ doc, access_token });
        const ok = !!res?.data?.status;

        if (!ok) {
          form.setFields([{ name: 'vtsID', errors: ['User not match'] }]);
          return;
        }

        const employeeInfo = res?.data?.employeeInfo;

        form.setFields([{ name: 'vtsID', errors: [] }]);

        form.setFieldsValue({
          id: employeeInfo?.id,
          employee_id: employeeInfo?.id,
          position_id: employeeInfo?.position_id,
          vtsIdShow: employeeInfo?.employee_id,
        });
      } catch (e) {
        form.setFields([{ name: 'vtsID', errors: ['User not match'] }]);
      } finally {
        setEmployeeLoading(false);
        setPositionLoading(false);
      }
    },
    [form, access_token]
  );

  const onFinish = useCallback(async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const inputVtsID = String(values?.vtsID || '')
        .trim()
        .toUpperCase();
      const selectedVtsID = String(values?.vtsIdShow || '')
        .trim()
        .toUpperCase();

      if (!values?.id || !selectedVtsID || inputVtsID !== selectedVtsID) {
        form.setFields([
          {
            name: 'vtsID',
            errors: ['User not match, cannot save'],
          },
        ]);
        warning('User not match, cannot save');
        return;
      }

      const doc = {
        idEmployee: values?.id,
        vtsID: inputVtsID,
        dateActive: dayjs(values?.dateActive).format('YYYY-MM-DD'),
        password: values?.password,
        deviceID: values?.deviceID ? values.deviceID : '',
      };

      const ok = await registerUser({ access_token, doc });
      if (!ok) {
        warning('add fail');
        return;
      }

      success('add success');
      closeModal();
      form.resetFields();
      await fetchUsers({ access_token });
    } catch (e) {
      warning('add fail');
    }
  }, [form, registerUser, fetchUsers, access_token, success, warning, closeModal]);

  // reset form when open
  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({ dateActive: dayjs() });
    setEmployeeOptions([]);
  }, [open]);

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
          Save
        </Button>
      }
      closable={false}>
      <Card
        title="Add User"
        extra={
          <CloseCircleOutlined onClick={closeModal} className="cursor-pointer" style={{ fontSize: 20, color: 'red' }} />
        }>
        <Form
          form={form}
          name="app_login_add_user"
          labelAlign="top"
          autoComplete="off"
          initialValues={{ dateActive: dayjs() }}>
          <Row gutter={[8, 8]}>
            <Col xs={24} xl={12}>
              <Form.Item
                label="Date Active"
                name="dateActive"
                className="m-0 p-0"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Field is required' }]}>
                <DatePicker placeholder="YYYY-MM-DD" allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {/* <Col xs={24} > */}
            <Form.Item hidden label="id" name="id" className="m-0 p-0">
              <Input disabled />
            </Form.Item>
            {/* </Col> */}
            <Col xs={24} xl={12}>
              <Form.Item
                label="VTS Code"
                name="vtsID"
                labelCol={{ span: 24 }}
                className="m-0 p-0"
                validateTrigger="onBlur"
                rules={[
                  { required: true, message: 'field require' },
                  ({ getFieldValue }) => ({
                    async validator(_, value) {
                      if (!value) return Promise.resolve();
                      if (/\s/.test(value)) return Promise.reject(new Error('Not Contain Space'));

                      const doc = { vtsID: String(value).toUpperCase() };
                      const exists = await ValidateAppLoginService.Validate_Employee_Id_App_Login({
                        doc,
                        access_token,
                      });
                      if (exists === true) return Promise.reject(new Error('Id already exists'));
                      return Promise.resolve();
                    },
                  }),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) return Promise.resolve();

                      const inputVtsID = String(value || '')
                        .trim()
                        .toUpperCase();
                      const selectedVtsID = String(getFieldValue('vtsIdShow') || '')
                        .trim()
                        .toUpperCase();

                      if (selectedVtsID && inputVtsID !== selectedVtsID) {
                        return Promise.reject(new Error('User not match,Please Select VTS ID instead'));
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}>
                <CustomAutoComplete
                  options={employee_options}
                  onSearch={handleSearchEmployeeCode}
                  placeholder="employee card id"
                  onSelect={onSelectEmployeeCode}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item labelCol={{ span: 24 }} label="VTS ID Check" name="vtsIdShow" className="m-0 p-0">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} xl={12}>
              <Form.Item label="Employee Name" name="employee_id" labelCol={{ span: 24 }} className="m-0 p-0">
                <Select open={false} placeholder="select employee" loading={employee_loading} options={employee_list} />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item label="Position" name="position_id" labelCol={{ span: 24 }} className="m-0 p-0">
                <Select open={false} placeholder="select position" loading={position_loading} options={position_list} />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item
                label="Password"
                name="password"
                className="m-0 p-0"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: 'field require' },
                  { min: 5, message: 'Password must be at least 5 characters long' },
                ]}>
                <Input type="password" placeholder="password" />
              </Form.Item>
            </Col>

            <Col xs={24} xl={12}>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                labelCol={{ span: 24 }}
                className="m-0 p-0"
                dependencies={['password']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('The two passwords do not match'));
                    },
                  }),
                ]}>
                <Input type="password" placeholder="confirm password" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Device ID (Optional)" name="deviceID" labelCol={{ span: 24 }} className="m-0 p-0">
                <Input placeholder="device id (optional)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default AddUser;
