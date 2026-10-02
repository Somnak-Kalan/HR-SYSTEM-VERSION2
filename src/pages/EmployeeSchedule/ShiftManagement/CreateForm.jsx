// // /* eslint-disable react-hooks/exhaustive-deps */
// // import { TimePicker, Row, Col, Form, Input, Checkbox, Select } from 'antd'
// // import ShiftManagementService from '../../../services/employeeSchedule/shiftManagement'

// // const FORMS = [
// //   { label: 'Monday', name: 'monday', morning: 'monday_morning', afternoon: 'monday_afternoon' },
// //   { label: 'Tuesday', name: 'tuesday', morning: 'tuesday_morning', afternoon: 'tuesday_afternoon' },
// //   { label: 'Wednesday', name: 'wednesday', morning: 'wednesday_morning', afternoon: 'wednesday_afternoon' },
// //   { label: 'Thursday', name: 'thursday', morning: 'thursday_morning', afternoon: 'thursday_afternoon' },
// //   { label: 'Friday', name: 'friday', morning: 'friday_morning', afternoon: 'friday_afternoon' },
// //   { label: 'Saturday', name: 'saturday', morning: 'saturday_morning', afternoon: 'saturday_afternoon' },
// //   { label: 'Sunday', name: 'sunday', morning: 'sunday_morning', afternoon: 'sunday_afternoon' },
// // ]

// // const CreateForm = ({ mode, selectedId, checkDay, setCheckDay, attendance_rules, access_token }) => {
// //   const form = Form.useFormInstance()

// //   const validateShiftName = async (_, value) => {
// //     const name = String(value || '').trim()
// //     if (!name) return Promise.resolve()

// //     // (optional) reduce API spam
// //     if (name.length < 2) return Promise.resolve()

// //     if (mode === 'update') {
// //       const doc = { id: selectedId, shift_name: name }
// //       const result = await ShiftManagementService.Validate_Update_Shift_Name({ doc, access_token })
// //       if (result === true) return Promise.reject(new Error('Shift Name already exists'))
// //       return Promise.resolve()
// //     }

// //     const doc = { shift_name: name }
// //     const result = await ShiftManagementService.Validate_Create_Shift_name({ doc, access_token })
// //     if (result === true) return Promise.reject(new Error('Shift Name already exists'))
// //     return Promise.resolve()
// //   }

// //   return (

// //     <div>
// //         <style>
// //     {`
// //       .ant-picker-ok .ant-btn{
// //         background:#1677ff !important;
// //         border-color:#1677ff !important;
// //         color:#fff !important;
// //       }
// //       .ant-picker-ok .ant-btn:hover,
// //       .ant-picker-ok .ant-btn:focus{
// //         background:#4096ff !important;
// //         border-color:#4096ff !important;
// //         color:#fff !important;
// //       }
// //     `}
// //   </style>
// //       <Row className='mb-5' gutter={[8, 2]}>
// //         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
// //           <Form.Item
// //             name='shift_name'
// //             label='Shift Name'
// //             labelCol={{ span: 24 }}
// //             className='m-0 p-0'
// //             rules={[
// //               { required: true, message: 'Field is required' },
// //               { validator: validateShiftName },
// //             ]}
// //           >
// //             <Input placeholder='Shift Name' />
// //           </Form.Item>
// //         </Col>

// //         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
// //           <Form.Item
// //             label='Attendance Rule'
// //             labelCol={{ span: 24 }}
// //             name='attendance_rule_id'
// //             className='m-0 p-0'
// //             rules={[{ required: true, message: 'field require' }]}
// //           >
// //             <Select
// //               mode='multiple'
// //               placeholder='Select attendance rule'
// //               optionLabelProp='label'
// //               options={(attendance_rules || []).map((o) => ({
// //                 label: o?.attendance_rule_name,
// //                 value: o?.id,
// //               }))}
// //             />
// //           </Form.Item>
// //         </Col>
// //       </Row>

// //       {FORMS.map((el) => (
// //         <Row key={el.name} gutter={[8, 2]}>
// //           <Col xs={8} lg={4} xl={4}>
// //             <label>{el.label}</label>
// //           </Col>
// //           <Col xs={4} lg={1} xl={1}>
// //             :
// //           </Col>

// //           <Col lg={1} xl={1}>
// //             <Form.Item name={el.name} valuePropName='checked' className='mb-4'>
// //               <Checkbox
// //                 className='mb-2'
// //                 checked={!!checkDay?.[el.name]}
// //                 onChange={(e) => {
// //                   const checked = e.target.checked
// //                   setCheckDay((prev) => ({ ...prev, [el.name]: checked }))
// //                   if (!checked) {
// //                     // optional: clear values when disable
// //                     form.setFieldsValue({
// //                       [el.morning]: null,
// //                       [el.afternoon]: null,
// //                     })
// //                   }
// //                 }}
// //               />
// //             </Form.Item>
// //           </Col>

// //           <Col xs={24} sm={24} lg={18} xl={18}>
// //             <div className='md:block xl:flex'>
// //               <div className='xl:mx-1'>
// //                 <Form.Item
// //                   label='Morning'
// //                   labelCol={{ span: 24 }}
// //                   className='m-0 p-0'
// //                   name={el.morning}
// //                 >
// //                   <TimePicker.RangePicker
// //                     allowEmpty
// //                     format='HH:mm'
// //                     disabled={!checkDay?.[el.name]}
// //                     className='sm:w-full '
// //                   />
// //                 </Form.Item>
// //               </div>

// //               <div className='xl:mx-1'>
// //                 <Form.Item
// //                   label='Afternoon'
// //                   labelCol={{ span: 24 }}
// //                   className='m-0 p-0'
// //                   name={el.afternoon}
// //                 >
// //                   <TimePicker.RangePicker
// //                     allowEmpty
// //                     format='HH:mm'
// //                     disabled={!checkDay?.[el.name]}
// //                     className='sm:w-full'
// //                   />
// //                 </Form.Item>
// //               </div>
// //             </div>
// //           </Col>
// //         </Row>
// //       ))}
// //     </div>
// //   )
// // }

// // export default CreateForm

// /* eslint-disable react-hooks/exhaustive-deps */
// import { TimePicker, Row, Col, Form, Input, Checkbox, Select } from 'antd'

// const FORMS = [
//   {
//     label: 'Monday',
//     name: 'monday',
//     morning: 'monday_morning',
//     afternoon: 'monday_afternoon',
//   },
//   {
//     label: 'Tuesday',
//     name: 'tuesday',
//     morning: 'tuesday_morning',
//     afternoon: 'tuesday_afternoon',
//   },
//   {
//     label: 'Wednesday',
//     name: 'wednesday',
//     morning: 'wednesday_morning',
//     afternoon: 'wednesday_afternoon',
//   },
//   {
//     label: 'Thursday',
//     name: 'thursday',
//     morning: 'thursday_morning',
//     afternoon: 'thursday_afternoon',
//   },
//   {
//     label: 'Friday',
//     name: 'friday',
//     morning: 'friday_morning',
//     afternoon: 'friday_afternoon',
//   },
//   {
//     label: 'Saturday',
//     name: 'saturday',
//     morning: 'saturday_morning',
//     afternoon: 'saturday_afternoon',
//   },
//   {
//     label: 'Sunday',
//     name: 'sunday',
//     morning: 'sunday_morning',
//     afternoon: 'sunday_afternoon',
//   },
// ]

// const CreateForm = props => {
//   const { checkDay, setCheckDay, attendance_rules } = props

//   const form = Form.useFormInstance()

//   return (
//     <div>
//       <style>
//         {`
//           .ant-picker-ok .ant-btn {
//             background:#1677ff !important;
//             border-color:#1677ff !important;
//             color:#fff !important;
//           }

//           .ant-picker-ok .ant-btn:hover,
//           .ant-picker-ok .ant-btn:focus {
//             background:#4096ff !important;
//             border-color:#4096ff !important;
//             color:#fff !important;
//           }
//         `}
//       </style>

//       <Row className='mb-5' gutter={[8, 2]}>
//         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//           <Form.Item
//             name='shift_name'
//             label='Shift Name'
//             labelCol={{ span: 24 }}
//             className='m-0 p-0'
//             rules={[
//               {
//                 required: true,
//                 message: 'Field is required',
//               },
//             ]}
//           >
//             <Input placeholder='Shift Name' />
//           </Form.Item>
//         </Col>

//         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//           <Form.Item
//             label='Attendance Rule'
//             labelCol={{ span: 24 }}
//             name='attendance_rule_ids'
//             className='m-0 p-0'
//             rules={[
//               {
//                 required: true,
//                 message: 'field require',
//               },
//             ]}
//           >
//             <Select
//               mode='multiple'
//               placeholder='Select attendance rule'
//               optionLabelProp='label'
//               options={(attendance_rules || []).map(item => ({
//                 label: item?.attendance_rule_name,
//                 value: item?._id || item?.id,
//               }))}
//             />
//           </Form.Item>
//         </Col>
//       </Row>

//       {FORMS.map(el => (
//         <Row key={el.name} gutter={[8, 2]}>
//           <Col xs={8} lg={4} xl={4}>
//             <label>{el.label}</label>
//           </Col>

//           <Col xs={4} lg={1} xl={1}>
//             :
//           </Col>

//           <Col lg={1} xl={1}>
//             <Form.Item name={el.name} valuePropName='checked' className='mb-4'>
//               <Checkbox
//                 className='mb-2'
//                 checked={!!checkDay?.[el.name]}
//                 onChange={e => {
//                   const checked = e.target.checked

//                   setCheckDay(prev => ({
//                     ...prev,
//                     [el.name]: checked,
//                   }))

//                   if (!checked) {
//                     form.setFieldsValue({
//                       [el.morning]: null,
//                       [el.afternoon]: null,
//                     })
//                   }
//                 }}
//               />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={24} lg={18} xl={18}>
//             <div className='md:block xl:flex'>
//               <div className='xl:mx-1'>
//                 <Form.Item
//                   label='Morning'
//                   labelCol={{ span: 24 }}
//                   className='m-0 p-0'
//                   name={el.morning}
//                 >
//                   <TimePicker.RangePicker
//                     allowEmpty
//                     format='HH:mm'
//                     disabled={!checkDay?.[el.name]}
//                     className='sm:w-full'
//                   />
//                 </Form.Item>
//               </div>

//               <div className='xl:mx-1'>
//                 <Form.Item
//                   label='Afternoon'
//                   labelCol={{ span: 24 }}
//                   className='m-0 p-0'
//                   name={el.afternoon}
//                 >
//                   <TimePicker.RangePicker
//                     allowEmpty
//                     format='HH:mm'
//                     disabled={!checkDay?.[el.name]}
//                     className='sm:w-full'
//                   />
//                 </Form.Item>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       ))}
//     </div>
//   )
// }

// export default CreateForm
/* eslint-disable react-hooks/exhaustive-deps */
import { TimePicker, Row, Col, Form, Input, Checkbox, Select } from 'antd';
import dayjs from 'dayjs';

const FORMS = [
  {
    label: 'Monday',
    name: 'monday',
    morning: 'monday_morning',
    afternoon: 'monday_afternoon',
  },
  {
    label: 'Tuesday',
    name: 'tuesday',
    morning: 'tuesday_morning',
    afternoon: 'tuesday_afternoon',
  },
  {
    label: 'Wednesday',
    name: 'wednesday',
    morning: 'wednesday_morning',
    afternoon: 'wednesday_afternoon',
  },
  {
    label: 'Thursday',
    name: 'thursday',
    morning: 'thursday_morning',
    afternoon: 'thursday_afternoon',
  },
  {
    label: 'Friday',
    name: 'friday',
    morning: 'friday_morning',
    afternoon: 'friday_afternoon',
  },
  {
    label: 'Saturday',
    name: 'saturday',
    morning: 'saturday_morning',
    afternoon: 'saturday_afternoon',
  },
  {
    label: 'Sunday',
    name: 'sunday',
    morning: 'sunday_morning',
    afternoon: 'sunday_afternoon',
  },
];

const defaultMorning = () => [dayjs('08:00', 'HH:mm'), dayjs('12:00', 'HH:mm')];

const defaultAfternoon = () => [dayjs('13:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];

const CreateForm = (props) => {
  const { checkDay, setCheckDay, attendance_rules } = props;

  const form = Form.useFormInstance();

  const handleCheckDay = (checked, item) => {
    setCheckDay((prev) => ({
      ...prev,
      [item.name]: checked,
    }));

    form.setFieldsValue({
      [item.name]: checked,
    });

    if (checked) {
      const currentMorning = form.getFieldValue(item.morning);
      const currentAfternoon = form.getFieldValue(item.afternoon);

      form.setFieldsValue({
        [item.morning]:
          Array.isArray(currentMorning) && currentMorning.length === 2 ? currentMorning : defaultMorning(),

        [item.afternoon]:
          Array.isArray(currentAfternoon) && currentAfternoon.length === 2 ? currentAfternoon : defaultAfternoon(),
      });

      return;
    }

    form.setFieldsValue({
      [item.morning]: null,
      [item.afternoon]: null,
    });
  };

  return (
    <div>
      <style>
        {`
          .ant-picker-ok .ant-btn {
            background:#1677ff !important;
            border-color:#1677ff !important;
            color:#fff !important;
          }

          .ant-picker-ok .ant-btn:hover,
          .ant-picker-ok .ant-btn:focus {
            background:#4096ff !important;
            border-color:#4096ff !important;
            color:#fff !important;
          }
        `}
      </style>

      <Row className="mb-5" gutter={[8, 2]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            name="shift_name"
            label="Shift Name"
            labelCol={{ span: 24 }}
            className="m-0 p-0"
            rules={[
              {
                required: true,
                message: 'Field is required',
              },
            ]}>
            <Input placeholder="Shift Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Attendance Rule"
            labelCol={{ span: 24 }}
            name="attendance_rule_ids"
            className="m-0 p-0"
            rules={[
              {
                required: true,
                message: 'field require',
              },
            ]}>
            <Select
              mode="multiple"
              placeholder="Select attendance rule"
              optionLabelProp="label"
              options={(attendance_rules || []).map((item) => ({
                label: item?.attendance_rule_name,
                value: item?._id || item?.id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      {FORMS.map((item) => (
        <Row key={item.name} gutter={[8, 2]}>
          <Col xs={8} lg={4} xl={4}>
            <label>{item.label}</label>
          </Col>

          <Col xs={4} lg={1} xl={1}>
            :
          </Col>

          <Col lg={1} xl={1}>
            <Form.Item name={item.name} valuePropName="checked" className="mb-4">
              <Checkbox
                className="mb-2"
                checked={!!checkDay?.[item.name]}
                onChange={(e) => {
                  handleCheckDay(e.target.checked, item);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} lg={18} xl={18}>
            <div className="md:block xl:flex">
              <div className="xl:mx-1">
                <Form.Item label="Morning" labelCol={{ span: 24 }} className="m-0 p-0" name={item.morning}>
                  <TimePicker.RangePicker
                    allowEmpty
                    format="HH:mm"
                    disabled={!checkDay?.[item.name]}
                    className="sm:w-full"
                  />
                </Form.Item>
              </div>

              <div className="xl:mx-1">
                <Form.Item label="Afternoon" labelCol={{ span: 24 }} className="m-0 p-0" name={item.afternoon}>
                  <TimePicker.RangePicker
                    allowEmpty
                    format="HH:mm"
                    disabled={!checkDay?.[item.name]}
                    className="sm:w-full"
                  />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default CreateForm;
