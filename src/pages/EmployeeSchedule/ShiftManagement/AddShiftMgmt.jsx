// /* eslint-disable react-hooks/exhaustive-deps */
// import { Card, Modal, Form, Button, Popconfirm, message } from 'antd'
// import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons'
// import dayjs from 'dayjs'
// import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
// import { AuthContext } from '../../../contexts/AuthContext'
// import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store'
// import CreateForm from './CreateForm'

// const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

// const DEFAULT_FIELDS = () => {
//   const fields = {}
//   DAYS.forEach((d) => {
//     fields[`${d}_morning`] = [dayjs('08:00', 'HH:mm'), dayjs('12:00', 'HH:mm')]
//     fields[`${d}_afternoon`] = [dayjs('13:00', 'HH:mm'), dayjs('17:00', 'HH:mm')]
//     fields[d] = false
//   })
//   fields.shift_name = ''
//   fields.attendance_rule_id = []
//   return fields
// }

// const createDayAttendance = (morning, afternoon) => {
//   const isValidRange = (t) => Array.isArray(t) && t.length === 2 && dayjs(t[0]).isValid() && dayjs(t[1]).isValid()
//   const toRange = (t) => ({ start: dayjs(t[0]).format('HH:mm'), end: dayjs(t[1]).format('HH:mm') })

//   const out = {}
//   if (isValidRange(morning)) out.morning = toRange(morning)
//   if (isValidRange(afternoon)) out.afternoon = toRange(afternoon)
//   return Object.keys(out).length ? out : undefined
// }

// const AddShiftMgmt = () => {
//   const { username, access_token } = useContext(AuthContext)

//   const [open, setOpen] = useState(false)
//   const [form] = Form.useForm()

//   const btn_loading = useShiftManagementStore((s) => s.btn_loading)
//   const attendance_rules = useShiftManagementStore((s) => s.attendance_rules)
//   const fetchAttendanceRules = useShiftManagementStore((s) => s.fetchAttendanceRules)
//   const createShift = useShiftManagementStore((s) => s.createShift)

//   const [checkDay, setCheckDay] = useState(() =>
//     DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {})
//   )

//   const resetDefaults = useCallback(() => {
//     setCheckDay(DAYS.reduce((acc, d) => ({ ...acc, [d]: false }), {}))
//     form.setFieldsValue(DEFAULT_FIELDS())
//   }, [form])

//   useEffect(() => {
//     if (!open) return
//     fetchAttendanceRules({ access_token })
//     resetDefaults()
//   }, [open])

//   const onClose = useCallback(() => {
//     setOpen(false)
//   }, [])

//   //  CREATE function lives here
//   const onSave = useCallback(async () => {
//     try {
//       await form.validateFields()
//       const v = form.getFieldsValue()

//       const attendance_rule_ids = Array.isArray(v.attendance_rule_id)
//         ? v.attendance_rule_id
//         : [v.attendance_rule_id].filter(Boolean)

//       const attendance = {}
//       DAYS.forEach((d) => {
//         if (!checkDay[d]) return
//         const dayAttendance = createDayAttendance(v[`${d}_morning`], v[`${d}_afternoon`])
//         if (dayAttendance) attendance[d] = dayAttendance
//       })

//       const doc = {
//         shift_name: v.shift_name,
//         user: username,
//         attendance_rule_ids,
//         attendance,
//       }

//       const res = await createShift({ access_token, doc })
//       if (res) {
//         message.success('Add Success')
//         setOpen(false)
//       } else {
//         message.warning('Add Fail')
//       }
//     } catch (e) {
//       // keep open
//     }
//   }, [form, checkDay, username, access_token, createShift])

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
//     <>
//       <Button
//         type='primary'
//         style={{ background: '#1677ff' }}
//         className='cursor-pointer text-white'
//         onClick={() => setOpen(true)}
//       >
//         <UserAddOutlined />
//         Add Shift Management
//       </Button>

//       <Modal
//         open={open}
//         closable={false}
//         forceRender
//         width='48vw'
//         onCancel={onClose}
//         footer={
//           <Button
//             onClick={onSave}
//             loading={btn_loading}
//             type='primary'
//             style={{ background: '#1677ff' }}
//             className='cursor-pointer text-white'
//           >
//             Save
//           </Button>
//         }
//       >
//         <Card title='Add Shift Management' extra={closeIcon}>
//           <Form form={form} name='add_shift_mgmt' autoComplete='off'>
//             <CreateForm
//               mode='create'
//               checkDay={checkDay}
//               setCheckDay={setCheckDay}
//               attendance_rules={attendance_rules}
//               access_token={access_token}
//             />
//           </Form>
//         </Card>
//       </Modal>
//     </>
//   )
// }

// export default AddShiftMgmt

/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Modal, Form, Button, Popconfirm, message } from 'antd';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';
import CreateForm from './CreateForm';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DEFAULT_FIELDS = () => {
  const fields = {};

  DAYS.forEach((day) => {
    fields[`${day}_morning`] = [dayjs('08:00', 'HH:mm'), dayjs('12:00', 'HH:mm')];

    fields[`${day}_afternoon`] = [dayjs('13:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];

    fields[day] = false;
  });

  fields.shift_name = '';
  fields.attendance_rule_ids = [];

  return fields;
};

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

const AddShiftMgmt = () => {
  const { access_token } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const btn_loading = useShiftManagementStore((s) => s.btn_loading);
  const attendance_rules = useShiftManagementStore((s) => s.attendance_rules);
  const fetchAttendanceRules = useShiftManagementStore((s) => s.fetchAttendanceRules);
  const createShift = useShiftManagementStore((s) => s.createShift);

  const [checkDay, setCheckDay] = useState(() => DAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {}));

  const resetDefaults = useCallback(() => {
    setCheckDay(DAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {}));
    form.setFieldsValue(DEFAULT_FIELDS());
  }, [form]);

  useEffect(() => {
    if (!open) return;

    fetchAttendanceRules({
      access_token,
    });

    resetDefaults();
  }, [open, access_token]);

  const onClose = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form]);

  const onSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

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

      const res = await createShift({
        access_token,
        doc,
      });

      if (res) {
        message.success('Add Success');
        onClose();
      } else {
        message.warning('Add Fail');
      }
    } catch (e) {
      console.log(e);
    }
  }, [form, checkDay, access_token, createShift, onClose]);

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
    <>
      <Button
        type="primary"
        style={{ background: '#1677ff' }}
        className="cursor-pointer text-white"
        onClick={() => setOpen(true)}>
        <UserAddOutlined />
        Add Shift Management
      </Button>

      <Modal
        open={open}
        closable={false}
        forceRender
        width="48vw"
        onCancel={onClose}
        footer={
          <Button
            onClick={onSave}
            loading={btn_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Save
          </Button>
        }>
        <Card title="Add Shift Management" extra={closeIcon}>
          <Form form={form} name="add_shift_mgmt" autoComplete="off">
            <CreateForm
              mode="create"
              checkDay={checkDay}
              setCheckDay={setCheckDay}
              attendance_rules={attendance_rules}
            />
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default AddShiftMgmt;
