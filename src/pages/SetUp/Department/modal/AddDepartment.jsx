import { Modal, Button, Card, message } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useDepartmentStore } from '../../../../stores/department.store';

import EmployeeOptServices from '../../../../services/options/employee';
import LeaveTypeOptServices from '../../../../services/options/setup/leaveTypeOtp';
import DepartmentForm from '../form/DepartmentForm';
const AddDepartment = ({ form, list_company, open_add, setOpenAdd }) => {
  const { access_token } = useContext(AuthContext);
  const Create_Department = useDepartmentStore((state) => state.Create_Department);
  const [btnLoading, setBtnLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [leaveTypeLoading, setLeaveTypeLoading] = useState(false);

  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);

  const searchTimerRef = useRef(null);

  const fetchEmployeeList = async (search = '') => {
    try {
      setEmployeeLoading(true);

      const res = await EmployeeOptServices.Get_Employee_Otp({
        access_token,
        doc: {
          search,
          page: 1,
          size: 10,
        },
      });
      setEmployeeOptions(res?.data);
    } catch (error) {
      console.log(error);

      setEmployeeOptions([]);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleEmployeeSearch = (value) => {
    clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(() => {
      fetchEmployeeList(value);
    }, 350);
  };

  const getLeaveTypeRows = (res) => {
    if (Array.isArray(res)) return res;

    if (Array.isArray(res?.data)) return res.data;

    if (Array.isArray(res?.data?.data)) return res.data.data;

    if (Array.isArray(res?.list)) return res.list;

    return [];
  };

  const formatLeaveTypeOptions = (res) => {
    return getLeaveTypeRows(res)
      .map((item) => ({
        label: item?.leave_type_name || item?.name || item?.leaveTypeName,

        value: item?._id || item?.id,
      }))

      .filter((item) => item.label && item.value);
  };

  const fetchLeaveTypeList = async () => {
    try {
      setLeaveTypeLoading(true);

      const res = await LeaveTypeOptServices.Get_Leave_Type_Otp({
        access_token,
      });

      setLeaveTypeOptions(formatLeaveTypeOptions(res));
    } catch (error) {
      console.log(error);

      setLeaveTypeOptions([]);
    } finally {
      setLeaveTypeLoading(false);
    }
  };

  useEffect(() => {
    if (open_add) {
      form.resetFields();

      fetchEmployeeList('');

      fetchLeaveTypeList();
    }
  }, [open_add]);

  const close = () => {
    setOpenAdd(false);

    form.resetFields();
  };
  const onFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(true);
      const dc = values.date_create ? dayjs(values.date_create) : null;
      const doc = {
        company_id: values.company_id,

        department_name: values.department_name,

        leader: values.leader || null,

        date_create: dc && dc.isValid() ? dc.format('YYYY-MM-DD') : null,
        department_description: values.department_description || '',
        leaveTypeIds: values.leave_types || [],
      };
      setBtnLoading(true);
      await Create_Department({
        doc,
        access_token,
      });
      message.success('Add Department Success');
      close();
    } catch (error) {
      if (error?.errorFields) return;
      console.log(error);
      message.error('Add Department Failed');
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <Modal
      open={open_add}

      width={700}

      centered

      closable={false}

      footer={null}

      destroyOnHidden

      onCancel={close}
    >
      <h2 className="my-2 font-bold">Add Department</h2>
      <DepartmentForm
        form={form}

        list_company={list_company}
        employeeOptions={employeeOptions}
        employeeLoading={employeeLoading}
        handleEmployeeSearch={handleEmployeeSearch}
        fetchEmployeeList={fetchEmployeeList}

        leaveTypes={leaveTypeOptions}

        leaveTypeLoading={leaveTypeLoading}
      />

      <div className="mt-5 flex gap-2">
        <Button
          className="flex-1"

          onClick={close}
        >
          Cancel
        </Button>

        <Button
          type="primary"

          loading={btnLoading}

          className="flex-1"

          style={{
            background: '#1677ff',
          }}

          onClick={onFinish}
        >
          Add Department
        </Button>
      </div>
    </Modal>
  );
};

export default AddDepartment;
