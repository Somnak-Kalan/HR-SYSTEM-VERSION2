// /* eslint-disable react-hooks/exhaustive-deps */
// import { Card, Modal, Form, Button, Popconfirm, Input, message } from 'antd'
// import { CloseCircleOutlined } from '@ant-design/icons'
// import dayjs from 'dayjs'
// import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
// import { AuthContext } from '../../../contexts/AuthContext'
// import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store'
// import CreateForm from './CreateForm'

// const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

// const createDayAttendance = (morning, afternoon) => {
//   const isValidRange = (t) => Array.isArray(t) && t.length === 2 && dayjs(t[0]).isValid() && dayjs(t[1]).isValid()
//   const toRange = (t) => ({ start: dayjs(t[0]).format('HH:mm'), end: dayjs(t[1]).format('HH:mm') })

//   const out = {}
//   if (isValidRange(morning)) out.morning = toRange(morning)
//   if (isValidRange(afternoon)) out.afternoon = toRange(afternoon)
//   return Object.keys(out).length ? out : undefined
// }

// const toPickerRange = (start, end) => {
//   const s = dayjs(start, 'HH:mm')
//   const e = dayjs(end, 'HH:mm')
//   if (!s.isValid() || !e.isValid()) return null
//   return [s, e]
// }

// const UpdateShiftMgmt = ({ open, setOpen }) => {
//   const { username, access_token } = useContext(AuthContext)

//   const [form] = Form.useForm()
//   const btn_loading = useShiftManagementStore((s) => s.btn_loading)
//   const attendance_rules = useShiftManagementStore((s) => s.attendance_rules)
//   const fetchAttendanceRules = useShiftManagementStore((s) => s.fetchAttendanceRules)
//   const updateShift = useShiftManagementStore((s) => s.updateShift)
//   const selected = useShiftManagementStore((s) => s.selected)

//   const selectedId = selected?.id

//   const [checkDay, setCheckDay] = useState(() =>
//     DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
//   )

//   useEffect(() => {
//     if (!open) return
//     fetchAttendanceRules({ access_token })
//   }, [open])

//   useEffect(() => {
//     if (!open) return
//     if (!selectedId) return

//     // build fields from selected
//     const fields = {
//       id: selected?.id,
//       shift_name: selected?.shift_name,
//       attendance_rule_id: selected?.attendance_rule_ids || [],
//     }

//     const nextCheck = {}
//     DAYS.forEach((d) => {
//       const dayData = selected?.attendance?.[d]
//       const m = dayData?.morning
//       const a = dayData?.afternoon

//       const mRange = m ? toPickerRange(m.start, m.end) : null
//       const aRange = a ? toPickerRange(a.start, a.end) : null

//       fields[`${d}_morning`] = mRange
//       fields[`${d}_afternoon`] = aRange
//       nextCheck[d] = !!(mRange || aRange)
//       fields[d] = nextCheck[d]
//     })

//     setCheckDay(nextCheck)
//     form.setFieldsValue(fields)
//   }, [open, selectedId])

//   const onClose = useCallback(() => {
//     setOpen(false)
//   }, [setOpen])

//   //  UPDATE function lives here
//   const onUpdate = useCallback(async () => {
//     try {
//       await form.validateFields()
//       const v = form.getFieldsValue()

//       const attendance = {}
//       DAYS.forEach((d) => {
//         if (!checkDay[d]) return
//         const dayAttendance = createDayAttendance(v[`${d}_morning`], v[`${d}_afternoon`])
//         if (dayAttendance) attendance[d] = dayAttendance
//       })

//       const doc = {
//         id: v.id,
//         shift_name: v.shift_name,
//         user: username,
//         attendance_rule_ids: v.attendance_rule_id,
//         attendance,
//       }

//       const res = await updateShift({ access_token, doc })
//       if (res) {
//         message.success('Update Success')
//         setOpen(false)
//       } else {
//         message.warning('Update Fail')
//       }
//     } catch (e) {
//       // keep open
//     }
//   }, [form, checkDay, username, access_token, updateShift, setOpen])

//   const closeIcon = useMemo(
//     () => (
//       <Popconfirm
//         title='Please confirm !'
//         description='Are you sure to close this form?'
//         onConfirm={onClose}
//         okText='Yes'
//         cancelText='No'
//         overlayClassName='custom-popconfirm'
//       >
//         <CloseCircleOutlined className='cursor-pointer' style={{ fontSize: 20, color: 'red' }} />
//       </Popconfirm>
//     ),
//     [onClose]
//   )

//   return (
//     <Modal
//       open={open}
//       closable={false}
//       forceRender
//       width='48vw'
//       onCancel={onClose}
//       footer={
//         <Button
//           onClick={onUpdate}
//           loading={btn_loading}
//           type='primary'
//           style={{ background: '#1677ff' }}
//           className='cursor-pointer text-white'
//         >
//           Update
//         </Button>
//       }
//     >
//       <Card title='Update Shift Management' extra={closeIcon}>
//         <Form form={form} name='update_shift_mgmt' autoComplete='off'>
//           <Form.Item name='id' hidden>
//             <Input />
//           </Form.Item>

//           <CreateForm
//             mode='update'
//             selectedId={selectedId}
//             checkDay={checkDay}
//             setCheckDay={setCheckDay}
//             attendance_rules={attendance_rules}
//             access_token={access_token}
//           />
//         </Form>
//       </Card>
//     </Modal>
//   )
// }

// export default UpdateShiftMgmt
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Form, Button, Popconfirm, Input, message, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';
import CreateForm from './CreateForm';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const getRowId = (row) => row?._id || row?.id;

const createDayAttendance = (morning, afternoon) => {
  const isValidRange = (range) => {
    return Array.isArray(range) && range.length === 2 && dayjs(range[0]).isValid() && dayjs(range[1]).isValid();
  };

  const toRange = (range) => ({
    start: dayjs(range[0]).format('HH:mm'),
    end: dayjs(range[1]).format('HH:mm'),
  });

  const out = {};

  if (isValidRange(morning)) {
    out.morning = toRange(morning);
  }

  if (isValidRange(afternoon)) {
    out.afternoon = toRange(afternoon);
  }

  return Object.keys(out).length ? out : undefined;
};

const toPickerRange = (start, end) => {
  const s = dayjs(start, 'HH:mm');
  const e = dayjs(end, 'HH:mm');

  if (!s.isValid() || !e.isValid()) return null;

  return [s, e];
};

const UpdateShiftMgmt = (props) => {
  const { open, setOpen, propData, onUpdated } = props;

  const { access_token } = useContext(AuthContext);

  const [form] = Form.useForm();

  const btn_loading = useShiftManagementStore((s) => s.btn_loading);
  const detail_loading = useShiftManagementStore((s) => s.detail_loading);
  const attendance_rules = useShiftManagementStore((s) => s.attendance_rules);
  const fetchAttendanceRules = useShiftManagementStore((s) => s.fetchAttendanceRules);
  const updateShift = useShiftManagementStore((s) => s.updateShift);

  const [checkDay, setCheckDay] = useState(() => DAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {}));

  const onClose = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form, setOpen]);

  useEffect(() => {
    if (!open) return;

    fetchAttendanceRules({
      access_token,
    });
  }, [open, access_token]);

  useEffect(() => {
    if (!open) return;

    const id = getRowId(propData);

    if (!id) {
      form.resetFields();
      return;
    }

    const fields = {
      id,
      shift_name: propData?.shift_name || '',
      attendance_rule_ids: propData?.attendance_rule_ids || propData?.attendance_rule_id || [],
    };

    const nextCheck = {};

    DAYS.forEach((day) => {
      const dayData = propData?.attendance?.[day];
      const morning = dayData?.morning;
      const afternoon = dayData?.afternoon;

      const morningRange = morning ? toPickerRange(morning.start, morning.end) : null;

      const afternoonRange = afternoon ? toPickerRange(afternoon.start, afternoon.end) : null;

      fields[`${day}_morning`] = morningRange;
      fields[`${day}_afternoon`] = afternoonRange;

      nextCheck[day] = !!(morningRange || afternoonRange);
      fields[day] = nextCheck[day];
    });

    setCheckDay(nextCheck);
    form.setFieldsValue(fields);
  }, [open, propData?._id, propData?.id]);

  const onUpdate = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const id = values?.id;

      if (!id) {
        message.warning('No shift selected');
        return;
      }

      const attendance_rule_ids = Array.isArray(values.attendance_rule_ids)
        ? values.attendance_rule_ids
        : [values.attendance_rule_ids].filter(Boolean);

      const attendance = {};

      DAYS.forEach((day) => {
        if (!checkDay[day]) return;

        const dayAttendance = createDayAttendance(values[`${day}_morning`], values[`${day}_afternoon`]);

        if (dayAttendance) {
          attendance[day] = dayAttendance;
        }
      });

      const doc = {
        shift_name: values.shift_name,
        attendance_rule_ids,
        attendance,
      };

      const res = await updateShift({
        access_token,
        id,
        doc,
      });

      if (res) {
        message.success('Update Success');
        onUpdated?.();
        onClose();
      } else {
        message.warning('Update Fail');
      }
    } catch (e) {
      console.log(e);
    }
  }, [form, checkDay, access_token, updateShift, onUpdated, onClose]);

  const closeIcon = useMemo(
    () => (
      <Popconfirm
        title="Please confirm !"
        description="Are you sure to close this form?"
        onConfirm={onClose}
        okText="Yes"
        cancelText="No"
        overlayClassName="custom-popconfirm">
        <CloseCircleOutlined
          className="cursor-pointer"
          style={{
            fontSize: 20,
            color: 'red',
          }}
        />
      </Popconfirm>
    ),
    [onClose]
  );

  return (
    <Modal
      open={open}
      closable={false}
      forceRender
      width="48vw"
      onCancel={onClose}
      footer={
        <Button
          onClick={onUpdate}
          loading={btn_loading}
          disabled={detail_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Update
        </Button>
      }>
      <Card title="Update Shift Management" extra={closeIcon}>
        {detail_loading ? (
          <div style={{ textAlign: 'center', padding: 30 }}>
            <Spin />
          </div>
        ) : (
          <Form form={form} name="update_shift_mgmt" autoComplete="off">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <CreateForm
              mode="update"
              checkDay={checkDay}
              setCheckDay={setCheckDay}
              attendance_rules={attendance_rules}
            />
          </Form>
        )}
      </Card>
    </Modal>
  );
};

export default UpdateShiftMgmt;
