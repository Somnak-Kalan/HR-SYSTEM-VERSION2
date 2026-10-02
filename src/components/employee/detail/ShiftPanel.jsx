// import { useMemo } from 'react'
// import { Collapse, Divider, Row, Col, Empty, Typography } from 'antd'
// import dayjs from 'dayjs'

// import UpdateShift from '../../../pages/SetUp/Employee/Details/Edit/UpdateShift'

// const { Text } = Typography

// const DAYS = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ]

// const isValidTime = value => dayjs(value, 'HH:mm', true).isValid()

// const formatTime = value => {
//   if (!isValidTime(value)) return ''
//   return dayjs(value, 'HH:mm').format('hh:mm A')
// }

// const hasDayTime = dayData => {
//   const morning = dayData?.morning
//   const afternoon = dayData?.afternoon

//   return (
//     isValidTime(morning?.start) ||
//     isValidTime(morning?.end) ||
//     isValidTime(afternoon?.start) ||
//     isValidTime(afternoon?.end)
//   )
// }

// const hasAnyAttendance = attendance => {
//   if (!attendance) return false

//   return DAYS.some(day => {
//     const key = day.toLowerCase()
//     return hasDayTime(attendance?.[key])
//   })
// }

// export default function ShiftPanel({ schedule_List, shift_management_id }) {
//   const displayShift =
//     schedule_List?.shift_management ||
//     schedule_List?.shift ||
//     schedule_List?.schedule ||
//     schedule_List ||
//     {}

//   const shiftId =
//     shift_management_id ||
//     schedule_List?.shift_management_id ||
//     displayShift?._id ||
//     displayShift?.id

//   const attendance = displayShift?.attendance || {}

//   const shiftName =
//     displayShift?.shift_name ||
//     displayShift?.label ||
//     schedule_List?.shift_name ||
//     '-'

//   const showAttendance = hasAnyAttendance(attendance)

//   const items = useMemo(() => {
//     return [
//       {
//         key: 'panel-shift',
//         label: (
//           <div className="flex items-center gap-3 flex-wrap">
//             <Text strong style={{ color: '#262626' }}>
//               Shift Name
//             </Text>

//             <Text strong style={{ color: '#1677ff' }}>
//               {shiftName}
//             </Text>
//           </div>
//         ),

//         extra: (
//           <div onClick={e => e.stopPropagation()}>
//             <UpdateShift
//               schedule_List={displayShift}
//               shift_management_id={shiftId}
//             />
//           </div>
//         ),

//         children: !showAttendance ? (
//           <Empty description="No shift attendance found" />
//         ) : (
//           <div style={{ padding: '0 4px 8px 4px' }}>
//             <div style={{ marginBottom: 12 }}>
//               <Divider
//                 plain
//                 style={{
//                   margin: '8px 0 20px 0',
//                   color: '#262626',
//                   fontWeight: 600,
//                 }}
//               >
//                 Shift Name
//               </Divider>
//             </div>

//             <Row
//               style={{
//                 marginBottom: 8,
//                 color: '#262626',
//                 fontWeight: 700,
//               }}
//             >
//               <Col span={5}>
//                 <Text strong>Day</Text>
//               </Col>

//               <Col span={1}>
//                 <Text strong>:</Text>
//               </Col>

//               <Col span={8}>
//                 <div className="flex justify-center">
//                   <Text strong>Morning</Text>
//                 </div>
//               </Col>

//               <Col span={10}>
//                 <div className="flex justify-center">
//                   <Text strong>Afternoon</Text>
//                 </div>
//               </Col>
//             </Row>

//             {DAYS.map(day => {
//               const key = day.toLowerCase()
//               const dayData = attendance?.[key]

//               if (!hasDayTime(dayData)) return null

//               const morning = dayData?.morning
//               const afternoon = dayData?.afternoon

//               return (
//                 <Row
//                   key={day}
//                   style={{
//                     marginBottom: 6,
//                     color: '#5b6b86',
//                     fontWeight: 500,
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Col span={5}>
//                     <Text style={{ color: '#5b6b86', fontWeight: 600 }}>
//                       {day}
//                     </Text>
//                   </Col>

//                   <Col span={1}>
//                     <Text style={{ color: '#5b6b86', fontWeight: 600 }}>
//                       :
//                     </Text>
//                   </Col>

//                   <Col span={4}>
//                     <Text style={{ color: '#5b6b86' }}>
//                       {formatTime(morning?.start)}
//                     </Text>
//                   </Col>

//                   <Col span={4}>
//                     <Text style={{ color: '#5b6b86' }}>
//                       {formatTime(morning?.end)}
//                     </Text>
//                   </Col>

//                   <Col span={5}>
//                     <Text style={{ color: '#5b6b86' }}>
//                       {formatTime(afternoon?.start)}
//                     </Text>
//                   </Col>

//                   <Col span={5}>
//                     <Text style={{ color: '#5b6b86' }}>
//                       {formatTime(afternoon?.end)}
//                     </Text>
//                   </Col>
//                 </Row>
//               )
//             })}
//           </div>
//         ),
//       },
//     ]
//   }, [shiftName, displayShift, shiftId, attendance, showAttendance])

//   return (
//     <Collapse
//       items={items}
//       bordered={false}
//       style={{
//         background: '#fff',
//         border: '1px solid #ffffff',
//       }}
//     />
//   )
// }
import { useMemo } from 'react';
import { Collapse, Divider, Row, Col, Empty, Typography, theme } from 'antd';
import dayjs from 'dayjs';

import UpdateShift from '../../../pages/SetUp/Employee/Details/Edit/UpdateShift';

const { Text } = Typography;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const isValidTime = (value) => dayjs(value, 'HH:mm', true).isValid();

const formatTime = (value) => {
  if (!isValidTime(value)) return '';
  return dayjs(value, 'HH:mm').format('hh:mm A');
};

const hasDayTime = (dayData) => {
  const morning = dayData?.morning;
  const afternoon = dayData?.afternoon;

  return (
    isValidTime(morning?.start) ||
    isValidTime(morning?.end) ||
    isValidTime(afternoon?.start) ||
    isValidTime(afternoon?.end)
  );
};

const hasAnyAttendance = (attendance) => {
  if (!attendance) return false;

  return DAYS.some((day) => {
    const key = day.toLowerCase();
    return hasDayTime(attendance?.[key]);
  });
};

export default function ShiftPanel({ schedule_List, shift_management_id }) {
  const {
    token: {
      colorBgContainer,
      colorBgElevated,
      colorFillAlter,
      colorText,
      colorTextSecondary,
      colorPrimary,
      colorBorder,
      borderRadiusLG,
    },
  } = theme.useToken();

  const displayShift =
    schedule_List?.shift_management || schedule_List?.shift || schedule_List?.schedule || schedule_List || {};

  const shiftId = shift_management_id || schedule_List?.shift_management_id || displayShift?._id || displayShift?.id;

  const attendance = displayShift?.attendance || {};

  const shiftName = displayShift?.shift_name || displayShift?.label || schedule_List?.shift_name || '-';

  const showAttendance = hasAnyAttendance(attendance);

  const items = useMemo(() => {
    return [
      {
        key: 'panel-shift',

        label: (
          <div className="flex items-center gap-3 flex-wrap">
            <Text strong style={{ color: colorText }}>
              Shift Name
            </Text>

            <Text strong style={{ color: colorPrimary }}>
              {shiftName}
            </Text>
          </div>
        ),

        extra: (
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateShift schedule_List={displayShift} shift_management_id={shiftId} />
          </div>
        ),

        children: !showAttendance ? (
          <Empty description={<span style={{ color: colorTextSecondary }}>No shift attendance found</span>} />
        ) : (
          <div style={{ padding: '0 4px 8px 4px' }}>
            <div style={{ marginBottom: 12 }}>
              <Divider
                plain
                style={{
                  margin: '8px 0 20px 0',
                  color: colorText,
                  fontWeight: 600,
                  borderColor: colorBorder,
                }}>
                Shift Name
              </Divider>
            </div>

            <Row
              style={{
                marginBottom: 8,
                color: colorText,
                fontWeight: 700,
              }}>
              <Col span={5}>
                <Text strong style={{ color: colorText }}>
                  Day
                </Text>
              </Col>

              <Col span={1}>
                <Text strong style={{ color: colorText }}>
                  :
                </Text>
              </Col>

              <Col span={8}>
                <div className="flex justify-center">
                  <Text strong style={{ color: colorText }}>
                    Morning
                  </Text>
                </div>
              </Col>

              <Col span={10}>
                <div className="flex justify-center">
                  <Text strong style={{ color: colorText }}>
                    Afternoon
                  </Text>
                </div>
              </Col>
            </Row>

            {DAYS.map((day) => {
              const key = day.toLowerCase();
              const dayData = attendance?.[key];

              if (!hasDayTime(dayData)) return null;

              const morning = dayData?.morning;
              const afternoon = dayData?.afternoon;

              return (
                <Row
                  key={day}
                  style={{
                    marginBottom: 6,
                    color: colorTextSecondary,
                    fontWeight: 500,
                    alignItems: 'center',
                  }}>
                  <Col span={5}>
                    <Text
                      style={{
                        color: colorTextSecondary,
                        fontWeight: 600,
                      }}>
                      {day}
                    </Text>
                  </Col>

                  <Col span={1}>
                    <Text
                      style={{
                        color: colorTextSecondary,
                        fontWeight: 600,
                      }}>
                      :
                    </Text>
                  </Col>

                  <Col span={4}>
                    <Text style={{ color: colorTextSecondary }}>{formatTime(morning?.start)}</Text>
                  </Col>

                  <Col span={4}>
                    <Text style={{ color: colorTextSecondary }}>{formatTime(morning?.end)}</Text>
                  </Col>

                  <Col span={5}>
                    <Text style={{ color: colorTextSecondary }}>{formatTime(afternoon?.start)}</Text>
                  </Col>

                  <Col span={5}>
                    <Text style={{ color: colorTextSecondary }}>{formatTime(afternoon?.end)}</Text>
                  </Col>
                </Row>
              );
            })}
          </div>
        ),
      },
    ];
  }, [
    shiftName,
    displayShift,
    shiftId,
    attendance,
    showAttendance,
    colorText,
    colorTextSecondary,
    colorPrimary,
    colorBorder,
  ]);

  return (
    <>
      <style>
        {`
          .shift-panel-collapse {
            background: ${colorBgContainer} !important;
            border: 1px solid ${colorBorder} !important;
            border-radius: ${borderRadiusLG}px !important;
          }

          .shift-panel-collapse .ant-collapse-item {
            background: ${colorBgContainer} !important;
            border-color: ${colorBorder} !important;
          }

          .shift-panel-collapse .ant-collapse-header {
            background: ${colorFillAlter} !important;
            color: ${colorText} !important;
            border-radius: ${borderRadiusLG}px ${borderRadiusLG}px 0 0 !important;
          }

          .shift-panel-collapse .ant-collapse-expand-icon {
            color: ${colorText} !important;
          }

          .shift-panel-collapse .ant-collapse-content {
            background: ${colorBgContainer} !important;
            color: ${colorText} !important;
            border-color: ${colorBorder} !important;
          }

          .shift-panel-collapse .ant-collapse-content-box {
            background: ${colorBgContainer} !important;
            color: ${colorText} !important;
          }

          .shift-panel-collapse .ant-divider {
            border-color: ${colorBorder} !important;
          }

          .shift-panel-collapse .ant-empty-description {
            color: ${colorTextSecondary} !important;
          }

          .shift-panel-collapse:hover .ant-collapse-header {
            background: ${colorBgElevated} !important;
          }
        `}
      </style>

      <Collapse
        className="shift-panel-collapse"
        items={items}
        bordered={false}
        style={{
          background: colorBgContainer,
          border: `1px solid ${colorBorder}`,
          borderRadius: borderRadiusLG,
          overflow: 'hidden',
        }}
      />
    </>
  );
}
