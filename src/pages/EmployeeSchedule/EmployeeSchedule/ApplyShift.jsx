import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Card, Modal, Form, Button, Tabs, message } from 'antd';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';

import ApplyToEmployee from './ApplyToEE';
import ApplyShiftToDepartment from './ApplyToDeptForm';

import { AuthContext } from '../../../contexts/AuthContext';
import OptionService from '../../../services/options';
import { useDepartmentStore } from '../../../stores/department.store';
import { useEmployeeScheduleStore } from '../../../stores/EmployeeSchedule/employeeSchedule.store';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';
import { useAttendanceRuleStore } from '../../../stores/EmployeeSchedule/attendanceRule.store';

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.rows)) return res.rows;

  return [];
};

const normalizeEmployeeOption = (item) => {
  if (!item) return null;

  const value = item?._id || item?.id || item?.value;
  const employeeId = item?.employee_id || item?.vtsID || '';
  const name = item?.name || item?.name_latin || '';

  if (!value) return null;

  return {
    ...item,
    value,
    id: value,
    _id: value,
    label: employeeId && name ? `${employeeId} - ${name}` : employeeId || name || '-',
    employee_id: employeeId,
    shift_management_id: item?.shift_management_id || item?.shift_id || item?.shiftManagementId || null,
  };
};

const ApplyShift = ({ onRefresh }) => {
  const { username, access_token } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const [dept_form] = Form.useForm();
  const [employee_form] = Form.useForm();
  const [shift_form] = Form.useForm();

  const [company_list, setCompanyList] = useState([]);
  const [department_list, setDepartmentList] = useState([]);
  const [employee_list, setEmployeeList] = useState([]);

  const Fetch_List_Employee_By_Department = useDepartmentStore((s) => s.Fetch_List_Employee_By_Department);

  const applyShiftToDept = useEmployeeScheduleStore((s) => s.applyShiftToDept);
  const applyShiftToEmployee = useEmployeeScheduleStore((s) => s.applyShiftToEmployee);

  const shifts = useShiftManagementStore((s) => s.list);
  const fetchShifts = useShiftManagementStore((s) => s.fetchShifts);

  const rules = useAttendanceRuleStore((s) => s.list);
  const fetchRules = useAttendanceRuleStore((s) => s.fetchAttendanceRules);

  const toastSuccess = (content) => message.success({ content });
  const toastError = (content) => message.error({ content });

  const Get_Company = useCallback(async () => {
    const res = await OptionService.getCompanyOptions({ access_token });

    setCompanyList(Array.isArray(res?.data) ? res.data : []);
  }, [access_token]);

  const Get_Department_By_Company_Id = useCallback(
    async (id) => {
      if (!id) {
        setDepartmentList([]);
        return;
      }

      const res = await OptionService.getDepartmentOptions({
        id,
        access_token,
      });

      setDepartmentList(Array.isArray(res?.data) ? res.data : []);
    },
    [access_token]
  );

  const Get_Otp_Employee_By_Dept_Id = useCallback(
    async (id) => {
      if (!id) {
        setEmployeeList([]);
        return;
      }

      try {
        const res = await Fetch_List_Employee_By_Department({
          doc: {
            id,
            search: '',
          },
          access_token,
        });

        const list = toArray(res).map(normalizeEmployeeOption).filter(Boolean);

        setEmployeeList(list);
      } catch (error) {
        console.log('fetch employee by department error:', error);
        setEmployeeList([]);
        toastError('Failed to load employee');
      }
    },
    [access_token, Fetch_List_Employee_By_Department]
  );

  const showModal = useCallback(async () => {
    setOpen(true);

    try {
      await Promise.all([
        Get_Company(),
        fetchShifts({
          access_token,
          doc: {
            search: '',
          },
          force: true,
        }),
      ]);
    } catch (e) {
      console.log(e);
    }
  }, [Get_Company, fetchShifts, access_token]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setActiveTab('1');

    dept_form.resetFields();
    employee_form.resetFields();
    shift_form.resetFields();

    setDepartmentList([]);
    setEmployeeList([]);
  }, [dept_form, employee_form, shift_form]);

  useEffect(() => {
    if (!open) return;
    if (activeTab !== '2') return;
    if ((rules || []).length > 0) return;

    fetchRules({ access_token });
  }, [open, activeTab, rules, fetchRules, access_token]);

  const handleOk = async () => {
    try {
      if (activeTab === '1') {
        await dept_form.validateFields();
        const values = dept_form.getFieldsValue();

        const ok = await applyShiftToDept?.(
          {
            department_id: values.department_id,
            shift_management_id: values.shift_management_id,
          },
          access_token
        );

        if (!ok) {
          toastError('Save failed');
          return;
        }

        toastSuccess('Add Success');
        closeModal();
        onRefresh?.();
      } else {
        employee_form.submit();
      }
    } catch (e) {
      toastError('Save failed');
    }
  };

  const items = useMemo(
    () => [
      {
        key: '1',
        label: 'Apply to Department',
        children: (
          <ApplyShiftToDepartment
            dept_form={dept_form}
            shift_mgmt_list={shifts}
            company_list={company_list}
            department_list={department_list}
            setDepartmentList={setDepartmentList}
            Emit_Company_Id={Get_Department_By_Company_Id}
            setOpen={setOpen}
          />
        ),
      },
      {
        key: '2',
        label: 'Apply to Employee',
        children: (
          <ApplyToEmployee
            company_list={company_list}
            department_list={department_list}
            setDepartmentList={setDepartmentList}
            setEmployeeList={setEmployeeList}
            shift_mgmt_list={shifts}
            employee_list={employee_list}
            employee_form={employee_form}
            shift_form={shift_form}
            access_token={access_token}
            username={username}
            list_attendance_rule={rules || []}
            Emit_Company_Id={Get_Department_By_Company_Id}
            Emit_Department_Id={Get_Otp_Employee_By_Dept_Id}
            Emit_Employee_Data={applyShiftToEmployee}
            onSaved={() => {
              toastSuccess('Add Success');
              closeModal();
              onRefresh?.();
            }}
            onLoadRules={() => fetchRules?.({ access_token })}
          />
        ),
      },
    ],
    [
      dept_form,
      employee_form,
      shift_form,
      shifts,
      company_list,
      department_list,
      employee_list,
      access_token,
      username,
      rules,
      onRefresh,
      applyShiftToEmployee,
      fetchRules,
      Get_Department_By_Company_Id,
      Get_Otp_Employee_By_Dept_Id,
      closeModal,
    ]
  );

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: '#1677ff' }}
        className="cursor-pointer text-white">
        <UserAddOutlined />
        Apply Shift
      </Button>

      <Modal
        open={open}
        width="48vw"
        closable={false}
        onCancel={closeModal}
        footer={
          <Button
            type="primary"
            onClick={handleOk}
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Save
          </Button>
        }>
        <Card
          title="Apply Shift Management"
          extra={
            <CloseCircleOutlined
              onClick={closeModal}
              className="cursor-pointer"
              style={{ fontSize: 20, color: 'red' }}
            />
          }>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </Card>
      </Modal>
    </>
  );
};

export default ApplyShift;
