import { Form, Row, Col, Select, Button, Flex } from 'antd';
import { useEffect, useMemo } from 'react';
import { getScheduleById } from './schedule.utils';

const ApplyToEmployeeForm = (props) => {
  const {
    company_list,
    department_list,
    setDepartmentList,
    setEmployeeList,
    setListSchedule,
    shift_mgmt_list,
    Emit_Company_Id,
    Emit_Department_Id,
    employee_list,
    add_new_shift,
    setAddNewShift,
    Emit_schedule_List,
    Emit_list_schedule,
    form,
    onAddNewShift,
    onLoadRules,
  } = props;

  const companyId = Form.useWatch('company_id', form);
  const departmentId = Form.useWatch('department_id', form);
  const employeeId = Form.useWatch('employee_id', form);
  const shiftId = Form.useWatch('shift_management_id', form);

  useEffect(() => {
    if (companyId) {
      Emit_Company_Id(companyId);
    } else {
      setDepartmentList([]);
      setEmployeeList([]);
      form.setFieldsValue({
        department_id: null,
        employee_id: null,
        shift_management_id: null,
      });
      Emit_list_schedule(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (departmentId) {
      Emit_Department_Id(departmentId);
      setAddNewShift(false);
      form.setFieldsValue({
        employee_id: null,
        shift_management_id: null,
      });
      Emit_list_schedule(false);
    } else {
      setEmployeeList([]);
      form.setFieldsValue({
        employee_id: null,
        shift_management_id: null,
      });
      Emit_list_schedule(false);
    }
  }, [departmentId]);

  const employeeOptions = useMemo(() => {
    return (Array.isArray(employee_list) ? employee_list : []).map((el) => ({
      label: el?.label || el?.employee_id || el?.name || '-',
      value: el?.value || el?.id || el?._id,
      shift_management_id: el?.shift_management_id,
    }));
  }, [employee_list]);

  const onChange_Employee = (id, option) => {
    setAddNewShift(false);

    if (!id) {
      form.setFieldValue('shift_management_id', null);
      Emit_list_schedule(false);
      return;
    }

    onLoadRules?.();
    Emit_list_schedule(true);
    form.setFieldValue('shift_management_id', option?.shift_management_id || null);
  };

  const onChange_Shift = (id) => {
    Emit_list_schedule(!!id);
  };

  useEffect(() => {
    const schedule = getScheduleById(shift_mgmt_list, shiftId);
    Emit_schedule_List(schedule);
    setListSchedule(!!shiftId);
  }, [shiftId, shift_mgmt_list]);

  return (
    <>
      <Row gutter={[8, 2]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Company"
            labelCol={{ span: 24 }}
            name="company_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select placeholder="select company" allowClear options={company_list} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Department"
            labelCol={{ span: 24 }}
            name="department_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select placeholder="select department" allowClear options={department_list} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Employee"
            labelCol={{ span: 24 }}
            name="employee_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select placeholder="select employee" onChange={onChange_Employee} allowClear options={employeeOptions} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          {employeeId && !add_new_shift ? (
            <Form.Item
              label="Shift Name"
              labelCol={{ span: 24 }}
              name="shift_management_id"
              rules={[{ required: true, message: 'field require' }]}>
              <Select
                placeholder="shift name"
                onChange={onChange_Shift}
                allowClear
                options={(shift_mgmt_list || []).map((el) => ({
                  label: el?.shift_name || el?.label || '-',
                  value: el?.id || el?._id || el?.value,
                }))}
              />
            </Form.Item>
          ) : null}
        </Col>
      </Row>
      {/* 
      {employeeId && !add_new_shift ? (
        <Flex justify="end">
          <Button onClick={onAddNewShift} className="border-blue-500">
            Add New Shift
          </Button>
        </Flex>
      ) : null} */}
    </>
  );
};

export default ApplyToEmployeeForm;
