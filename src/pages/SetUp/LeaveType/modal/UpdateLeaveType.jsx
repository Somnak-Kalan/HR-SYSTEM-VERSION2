import { Modal, Button } from 'antd';
import { useEffect } from 'react';
import { useLeaveTypeStore } from '../../../../stores/leaveType.store';
import LeaveTypeForm from '../form/LeaveTypeForm';
import dayjs from 'dayjs';
const UpdateLeaveType = ({ propData, form, btn_loading, access_token, open_update, setOpenUpdate }) => {
  const updateLeaveType = useLeaveTypeStore((s) => s.updateLeaveType);
  const fetchLeaveTypeById = useLeaveTypeStore((s) => s.fetchLeaveTypeById);
  const current = useLeaveTypeStore((s) => s.current);
  // ==========================
  // FETCH DETAIL
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      if (open_update && propData?._id && access_token) {
        await fetchLeaveTypeById({
          access_token,
          id: propData._id,
        });
      }
    };

    loadData();
  }, [open_update, propData?._id, access_token]);
  // ==========================
  // SET FORM DATA
  // ==========================
  useEffect(() => {
    if (open_update && current) {
      form.setFieldsValue({
        leave_type_name: current.leave_type_name,
        leave_type_name_kh: current.leave_type_name_kh,
        status: current?.status,
        leave_type: current.leave_type,
        description: current.description,
        pay_type: current.payType,
        rule_type: current.rulesSet?.entitlementType === 'as-requested' ? 'Request' : current.rulesSet?.entitlementType,
        days_year: current.rulesSet?.daysPerYear,
        days_month: current.rulesSet?.daysPerMonth,
        carry_forward: current.rulesSet?.carryForward,

        grant_condition: current.rulesSet?.grantCondition,


        publicDate: current.publicDate
          ? dayjs(current.publicDate)
          : null,
      });
    }
  }, [open_update, current]);

  const close = () => {
    setOpenUpdate(false);

    form.resetFields();
  };

  const submit = async () => {

    await form.validateFields();

    const values = form.getFieldsValue();


    const formData = {

      leave_type_name:
        values.leave_type_name,

      leave_type_name_kh:
        values.leave_type_name_kh,

      status:
        values.status,

      description:
        values.description,
      publicDate: values.publicDate || null,
      // payType:
      //   values.pay_type,
    };


    const doc = {

      id: propData._id,

      formData,

    };
    const res = await updateLeaveType({
      doc,
      access_token,
    });
    if (res) {
      close();
    }
  };
  return (
    <Modal
      open={open_update}
      width={900}
      footer={null}
      closable={false}
      destroyOnHidden
      onCancel={close}
    >
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-bold">Update Leave Type</h2>
      </div>

      <LeaveTypeForm form={form} mode="update" />

      <div className="mt-5 flex gap-2">
        <Button
          className="flex-1"

          onClick={close}
        >
          Cancel
        </Button>

        <button
          type="primary"

          loading={btn_loading}
          className="flex-1 bg-[#F79421] rounded-lg text-white"

          onClick={submit}
        >
          Update Leave Type
        </button>
      </div>
    </Modal>
  );
};

export default UpdateLeaveType;
