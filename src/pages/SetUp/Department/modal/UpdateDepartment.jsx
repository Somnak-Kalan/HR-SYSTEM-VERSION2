import { Modal, Button, Card, message } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useDepartmentStore } from '../../../../stores/department.store';
import EmployeeOptServices from '../../../../services/options/employee';
import LeaveTypeOptServices from '../../../../services/options/setup/leaveTypeOtp';
import DepartmentForm from '../form/DepartmentForm';
const UpdateDepartment = ({
  form,
  open_update,
  setOpenUpdate,
  selectedData,
  list_company,
}) => {
  const { access_token } = useContext(AuthContext);
  const Update_Department = useDepartmentStore((state) => state.Update_Department);
  const Get_Department_By_Id = useDepartmentStore((state) => state.Get_Department_By_Id);
  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [leaveTypeLoading, setLeaveTypeLoading] = useState(false);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const searchTimerRef = useRef(null);
  // ===============================
  // EMPLOYEE OPTIONS
  // ===============================
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
      setEmployeeOptions(res?.data || []);
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
  // ===============================
  // LEAVE TYPE OPTIONS
  // ===============================
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
  // ===============================
  // GET DETAIL
  // ===============================
  useEffect(() => {
    if (!open_update || !selectedData?._id) return;
    const loadDetail = async () => {
      try {
        const data = await Get_Department_By_Id({
          doc: {
            id: selectedData._id,
          },

          access_token,
        });
        setFormValue(data);
      } catch (error) {
        console.log(error);
        message.error('Cannot get department detail');
      }
    };
    loadDetail();
    fetchEmployeeList('');
    fetchLeaveTypeList();
  }, [open_update, selectedData]);
  // ===============================
  // SET FORM VALUE
  // ===============================
  const setFormValue = (data) => {
    if (!data) return;
    const leaderId = typeof data?.leader === 'object' ? data?.leader?._id : data?.leader;
    form.setFieldsValue({
      company_id: data?.company_id?._id || data?.company_id || '',
      department_name: data?.department_name || '',
      leader: leaderId || null,
      date_create: data?.date_create ? dayjs(data.date_create) : null,
      department_description: data?.department_description || '',
      leave_types: data?.leaveTypeIds || data?.leave_types || [],
    });
  };

  // ===============================
  // CLOSE
  // ===============================

  const close = () => {
    form.resetFields();

    setOpenUpdate(false);
  };

  // ===============================
  // UPDATE
  // ===============================

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const payload = {
        id: selectedData?._id,
        doc: {
          company_id: values.company_id,

          department_name: values.department_name,

          leader: values.leader || null,
          department_description: values.department_description || '',
        },
      };
      setLoading(true);

      const res = await Update_Department({
        doc: payload,
        access_token,
      });

      if (res) {
        message.success('Update Department Success');

        close();
      }
    } catch (error) {
      if (error?.errorFields) return;

      console.log(error);

      message.error('Update Department Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open_update}

      width={700}

      centered

      footer={null}

      closable={false}

      destroyOnHidden

      onCancel={close}
    >
      <h2 className="my-2 font-bold">Update Department</h2>
      <DepartmentForm
        form={form}
        list_company={list_company}

        employeeOptions={employeeOptions}

        employeeLoading={employeeLoading}

        handleEmployeeSearch={handleEmployeeSearch}

        fetchEmployeeList={fetchEmployeeList}
        disabled={false}
        isUpdate={true}
        leaveTypes={0}
      />

      <div className="mt-5 flex gap-3">
        <Button
          className="flex-1"

          onClick={close}
        >
          Cancel
        </Button>

        <Button
          type="primary"

          loading={loading}

          className="flex-1"

          style={{
            background: '#FF8000',
          }}

          onClick={onFinish}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateDepartment;
