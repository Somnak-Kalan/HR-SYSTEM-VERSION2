import { Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useLeaveTypeStore } from '../../../../stores/leaveType.store';
import LeaveTypeForm from '../form/LeaveTypeForm';
import ApplyLeaveType from '../form/ApplyLeaveType';
import dayjs from 'dayjs';
const AddLeaveType = ({ form, open_add, setOpenAdd, access_token, btn_loading, copyData, setCopyData }) => {
  const createLeaveType = useLeaveTypeStore((state) => state.createLeaveType);
  const applyLeaveType = useLeaveTypeStore((state) => state.applyLeaveType);
  const [step, setStep] = useState(1);
  const [leaveTypeData, setLeaveTypeData] = useState({});
  // ==========================
  // OPEN MODAL
  // ==========================
  useEffect(() => {
    if (open_add) {
      setStep(1);
      setLeaveTypeData({});
      if (copyData) {
        const data = {
          leave_type_name: `${copyData.leave_type_name}-COPY`,

          leave_type_name_kh: `${copyData.leave_type_name_kh}-COPY`,

          leave_type: copyData.leave_type,

          description: copyData.description,

          status: copyData.status,

          pay_type: copyData.payType,

          rule_type:
            copyData.rulesSet?.entitlementType === 'as-requested' ? 'Request' : copyData.rulesSet?.entitlementType,

          days_year: copyData.rulesSet?.daysPerYear,

          days_month: copyData.rulesSet?.daysPerMonth,

          carry_forward: copyData.rulesSet?.carryForward,

          grant_condition: copyData.rulesSet?.grantCondition,

          publicDate: copyData.publicDate
            ? dayjs(copyData.publicDate)
            : null,
        };

        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    }
  }, [open_add, copyData]);

  // ==========================
  // CLOSE
  // ==========================

  const close = () => {
    setOpenAdd(false);

    setStep(1);

    setLeaveTypeData({});

    form.resetFields();
    setCopyData(null);
  };
  // ==========================
  // STEP 1 SAVE RULE
  // ==========================

  const saveRule = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const doc = {
        leave_type_name: values.leave_type_name,
        leave_type_name_kh: values.leave_type_name_kh,
        leave_type: values.leave_type,
        description: values.description,
        status: values.status || 'active',
        payType: values.pay_type || 'paid',
        rulesSet:
          values.rule_type === 'Accrual'
            ? {
              entitlementType: 'accrual',
              grantCondition: values.grant_condition || 'immediate',

              daysPerYear: Number(values.days_year),

              daysPerMonth: Number(values.days_month),

              carryForward: values.carry_forward || false,

              expireMonth: [
                values.expire_start_month?.format('MMMM'),
                values.expire_end_month?.format('MMMM'),
              ].filter(Boolean),
            }
            : values.rule_type === 'Fixed'
              ? {
                entitlementType: 'fixed',

                grantCondition: values.grant_condition || 'immediate',

                daysPerMonth: Number(values.days_month),
              }
              : {
                entitlementType: 'as-requested',

                grantCondition: values.grant_condition || 'immediate',
              },
        publicDate: values.publicDate || null,
      };

      delete doc._id;

      delete doc.id;
      console.log(doc, 'doc');
      const res = await createLeaveType({
        access_token,
        doc,
      });

      if (!res) {
        return;
      }
      // save created leave type id

      setLeaveTypeData({
        ...values,
        _id: res?.data?._id || res?._id,
      });
      // only success then go step 2

      setStep(2);
    } catch (error) {
      console.log('CREATE LEAVE TYPE ERROR:', error);
    }
  };
  // ==========================
  // FINAL CREATE
  // ==========================

  const handleApply = async (values) => {
    const doc = {
      leaveTypeId: leaveTypeData?._id,

      employeeIds: values.employee || [],

      departmentIds: values.department || [],

      applyAllDepartment: values.apply_all_department || false,
    };

    console.log('APPLY LEAVE TYPE:', doc);

    const res = await applyLeaveType({
      access_token,

      doc,
    });

    if (res) {
      close();
    }
  };

  return (
    <Modal
      open={open_add}

      width={900}

      footer={null}

      destroyOnHidden
      closable={false}
    >
      {/* TITLE */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Add Leave Type</h2>
      </div>

      {/* STEP */}

      <div className="mb-5 flex items-center">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } `}
          >
            1
          </div>

          <span>Create rule</span>
        </div>

        <div className="mx-4 flex-1 border-t" />

        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } `}
          >
            2
          </div>

          <span>Apply</span>
        </div>
      </div>

      {/* STEP 1 */}

      {step === 1 && (
        <>
          <LeaveTypeForm
            form={form}

            mode="create"
          />

          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"

              onClick={close}
            >
              Close
            </Button>

            <Button
              type="primary"

              loading={btn_loading}

              className="flex-1"

              onClick={saveRule}
            >
              Save
            </Button>
          </div>
        </>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <ApplyLeaveType
          leaveTypeId={leaveTypeData?._id}
          form={form}
          setOpen={setOpenAdd}
          loading={btn_loading}
          access_token={access_token}
          onSubmit={handleApply}
        />
      )}
    </Modal>
  );
};

export default AddLeaveType;
