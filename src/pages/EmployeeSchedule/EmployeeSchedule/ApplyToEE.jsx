import { useState } from 'react';
import { Form, message } from 'antd';

import ApplyToEmployeeForm from './ApplyToEmployeeForm';
import ListSchedule from './ListSchedule';
import NewShift from './NewShift';
import { buildCreateShiftDoc, getCreatedShiftId } from './schedule.utils';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';

const ApplyToEmployee = (props) => {
  const {
    company_list,
    department_list,
    setDepartmentList,
    setEmployeeList,
    shift_mgmt_list,
    Emit_Company_Id,
    Emit_Department_Id,
    employee_list,
    Emit_Employee_Data,
    list_attendance_rule,
    access_token,
    username,
    employee_form,
    shift_form,
    onSaved,
    onLoadRules,
  } = props;

  const createShift = useShiftManagementStore((s) => s.createShift);

  const [add_new_shift, setAddNewShift] = useState(false);
  const [schedule_List, setScheduleList] = useState(null);
  const [is_list_schedule, setListSchedule] = useState(false);
  const [showNewShift, setShowNewShift] = useState(false);

  const Add_New_Shift = async () => {
    onLoadRules?.();
    setAddNewShift(true);
    setShowNewShift(true);

    setTimeout(() => {
      employee_form.setFieldValue('shift_management_id', null);
      shift_form.setFieldValue('shift_name', null);
    }, 200);
  };

  const handleSubmit = async () => {
    try {
      await employee_form.validateFields();

      const employeeValues = employee_form.getFieldsValue();

      if (add_new_shift) {
        await shift_form.validateFields();
        const shiftValues = shift_form.getFieldsValue();

        const docShift = buildCreateShiftDoc({
          // username,
          shiftFormValues: shiftValues,
        });

        const created = await createShift({
          access_token,
          doc: docShift,
        });

        const createdId = getCreatedShiftId(created?.rec);

        if (!createdId) {
          message.error('Create shift failed');
          return;
        }

        await Emit_Employee_Data(
          {
            employee_id: employeeValues.employee_id,
            shift_management_id: createdId,
            // user: username,
          },
          access_token
        );

        onSaved?.();
      } else {
        await Emit_Employee_Data(
          {
            employee_id: employeeValues.employee_id,
            shift_management_id: employeeValues.shift_management_id,
            // user: username,
          },
          access_token
        );

        onSaved?.();
      }
    } catch (error) {}
  };

  return (
    <>
      <Form form={employee_form} onFinish={handleSubmit}>
        <ApplyToEmployeeForm
          form={employee_form}
          company_list={company_list}
          department_list={department_list}
          setDepartmentList={setDepartmentList}
          setEmployeeList={setEmployeeList}
          setListSchedule={setListSchedule}
          shift_mgmt_list={shift_mgmt_list}
          employee_list={employee_list}
          Emit_Company_Id={Emit_Company_Id}
          Emit_Department_Id={Emit_Department_Id}
          add_new_shift={add_new_shift}
          setAddNewShift={setAddNewShift}
          Emit_schedule_List={(value) => setScheduleList(value)}
          Emit_list_schedule={(value) => setListSchedule(value)}
          onAddNewShift={Add_New_Shift}
          onLoadRules={onLoadRules}
        />
      </Form>

      {add_new_shift ? (
        <div style={{ opacity: showNewShift ? 1 : 0, transition: 'opacity 0.4s' }}>
          <Form form={shift_form}>
            <NewShift form={shift_form} list_attendance_rule={list_attendance_rule} propData={schedule_List} />
          </Form>
        </div>
      ) : is_list_schedule ? (
        <ListSchedule new_shift_mgmt={Add_New_Shift} schedule_List={schedule_List} add_new_shift />
      ) : null}
    </>
  );
};

export default ApplyToEmployee;
