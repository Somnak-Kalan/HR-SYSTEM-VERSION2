import { Col, Form, Row, Select } from 'antd';
import { useMemo } from 'react';
import ListSchedule from './ListSchedule';
import { getScheduleById } from './schedule.utils';

const ApplyShiftToDepartment = (props) => {
  const { department_list, setDepartmentList, company_list, shift_mgmt_list, dept_form, Emit_Company_Id } = props;

  const companyId = Form.useWatch('company_id', dept_form);
  const shiftId = Form.useWatch('shift_management_id', dept_form);

  const schedule_List = useMemo(() => getScheduleById(shift_mgmt_list, shiftId), [shift_mgmt_list, shiftId]);

  const onChange_Company = (id) => {
    if (id) {
      Emit_Company_Id(id);
    } else {
      setDepartmentList([]);
    }

    dept_form.setFieldsValue({
      department_id: null,
    });
  };

  return (
    <Form form={dept_form} name="deptForm" autoComplete="off">
      <Row gutter={[8, 2]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Company"
            labelCol={{ span: 24 }}
            name="company_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select onChange={onChange_Company} placeholder="select company" allowClear options={company_list} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Department"
            labelCol={{ span: 24 }}
            name="department_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select placeholder="Select Department" allowClear options={department_list} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Shift Name"
            labelCol={{ span: 24 }}
            name="shift_management_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select
              placeholder="Select shift name"
              allowClear
              options={(shift_mgmt_list || []).map((s) => ({
                label: s?.shift_name || s?.label || '-',
                value: s?.id || s?._id || s?.value,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      {shiftId ? <ListSchedule add_new_shift={false} schedule_List={schedule_List} /> : null}
    </Form>
  );
};

export default ApplyShiftToDepartment;
