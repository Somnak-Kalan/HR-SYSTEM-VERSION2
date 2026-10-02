// // import { Col, Row, Skeleton } from 'antd';
// // import { useEffect, useState } from 'react';
// // import ShiftPanel from '../../../../components/employee/detail/ShiftPanel';
// // import LeaveTypePanel from '../../../../components/employee/detail/LeaveTypePanel';

// // const EmployeeSchedule = (props) => {
// //   const { loading, schedule_List, shift_management_id, leave_type_data, leave_type, success } = props;

// //   const [localSkeleton, setLocalSkeleton] = useState(false);

// //   useEffect(() => {
// //     if (loading && !schedule_List) {
// //       setLocalSkeleton(true);
// //     } else {
// //       setLocalSkeleton(false);
// //     }
// //   }, [loading, schedule_List]);

// //   if (localSkeleton) return <Skeleton active />;

// //   return (
// //     <div className="mb-5 overflow-hidden w-full mx-2">
// //       <Row>
// //         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
// //           {shift_management_id === null ||
// //             shift_management_id === '' ||
// //             (shift_management_id === undefined && <span className="text-red-500">* Required Add Shift Name</span>)}
// //           <ShiftPanel schedule_List={schedule_List} shift_management_id={shift_management_id} />
// //         </Col>

// //         <Col xs={24} sm={24} md={24} lg={24} xl={12}>
// //           {leave_type?.length === 0 && <span className="text-red-500">*Required Add Leave Type</span>}

// //           <LeaveTypePanel leave_type_data={leave_type_data || []} leave_type={leave_type || []} success={success} />
// //         </Col>
// //       </Row>
// //     </div>
// //   );
// // };

// // export default EmployeeSchedule;
// import {
//   Skeleton,
//   Button,
//   theme,
// } from 'antd';

// import {
//   EditOutlined,
// } from '@ant-design/icons';

// import ShiftPanel from '../../../../components/employee/detail/ShiftPanel';
// import LeaveTypePanel from '../../../../components/employee/detail/LeaveTypePanel';

// const CardHeader = ({
//   title,
//   onEdit,
// }) => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//       }}
//     >
//       <div
//         style={{
//           fontSize: 14,
//           fontWeight: 700,
//         }}
//       >
//         {title}
//       </div>

//       <Button
//         type="primary"
//         icon={<EditOutlined />}
//         onClick={onEdit}
//         style={{
//           width: 28,
//           height: 28,
//           padding: 0,
//           borderRadius: 6,
//           background: '#fa8c16',
//           borderColor: '#fa8c16',
//         }}
//       />
//     </div>
//   );
// };

// const EmployeeSchedule = ({
//   loading,
//   schedule_List,
//   shift_management_id,
//   leave_type_data,
//   leave_type,
//   success,
// }) => {
//   const {
//     token: {
//       colorBgContainer,
//       colorBorderSecondary,
//       colorText,
//     },
//   } = theme.useToken();

//   if (loading && !schedule_List) {
//     return <Skeleton active />;
//   }

//   const cardStyle = {
//     background: colorBgContainer,
//     border: `1px solid ${colorBorderSecondary}`,
//     borderRadius: 12,
//     padding: '10px 8px 12px',
//     color: colorText,
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 10,
//       }}
//     >
//       {/* CURRENT SHIFT */}
//       <div style={cardStyle}>
//         <div
//           style={{
//             padding: '0 0 0 0',
//           }}
//         >
//           <CardHeader
//             title="Current Shift"
//             onEdit={() => {
//               document
//                 .querySelector(
//                   '[data-shift-edit-button="true"]'
//                 )
//                 ?.click();
//             }}
//           />
//         </div>

//         {!shift_management_id && (
//           <div
//             style={{
//               color: '#ff4d4f',
//               fontSize: 12,
//               marginBottom: 8,
//             }}
//           >
//             * Required Add Shift Name
//           </div>
//         )}

//         <ShiftPanel
//           schedule_List={schedule_List || []}
//           shift_management_id={shift_management_id}
//           compact
//         />
//       </div>

//       {/* LEAVE TYPE */}
//       <div style={cardStyle}>
//         <CardHeader
//           title="Leave Type"
//           onEdit={() => {
//             document
//               .querySelector(
//                 '[data-leave-edit-button="true"]'
//               )
//               ?.click();
//           }}
//         />

//         {(!leave_type ||
//           leave_type.length === 0) && (
//             <div
//               style={{
//                 color: '#ff4d4f',
//                 fontSize: 12,
//                 marginBottom: 8,
//               }}
//             >
//               * Required Add Leave Type
//             </div>
//           )}

//         <LeaveTypePanel
//           leave_type_data={leave_type_data || []}
//           leave_type={leave_type || []}
//           success={success}
//           compact
//         />
//       </div>
//     </div>
//   );
// };

// export default EmployeeSchedule;
import React, { useState } from 'react';
import { Button, Skeleton, theme } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import LeaveTypePanel from '../../../../components/employee/detail/LeaveTypePanel';
import UpdateShift from './Edit/UpdateShift';
import UpdateLeaveType from './Edit/UpdateLeaveType'
import EditIcon from '../../../../assets/icons/white_edit.svg'
const DAYS = [
  'monday',
  'tuesday',
  'thursday',
  'wednesday',
  'friday',
  'saturday',
];

const formatTime = (time) => {
  if (!time) return '';

  const [hourString, minute] = time.split(':');

  let hour = Number(hourString);

  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
};

const formatDayName = (day) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

const CardHeader = ({
  title,
  onEdit,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: '22px',
        }}
      >
        {title}
      </div>

      <Button
        type="primary"
        icon={<img src={EditIcon} />}
        onClick={onEdit}
        style={{
          width: 28,
          height: 28,
          minWidth: 28,
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: '#fa8c16',
          borderColor: '#fa8c16',
          boxShadow: 'none',
        }}
      />
    </div>
  );
};

const ShiftDayCard = ({
  day,
  data,
}) => {
  const morning = data?.morning;
  const afternoon = data?.afternoon;

  const isSaturday =
    day.toLowerCase() === 'saturday';

  return (
    <div
      style={{
        position: 'relative',
        height: 74,
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '7px 5px 5px',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          lineHeight: '18px',
          marginBottom: 4,
          zIndex: 2,
        }}
      >
        {formatDayName(day)}
      </div>

      {morning && (
        <div
          style={{
            fontSize: 11,
            lineHeight: '17px',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {formatTime(morning.start)}
          {' - '}
          {formatTime(morning.end)}
        </div>
      )}

      {afternoon && (
        <div
          style={{
            fontSize: 11,
            lineHeight: '17px',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {formatTime(afternoon.start)}
          {' - '}
          {formatTime(afternoon.end)}
        </div>
      )}

      {/* Saturday half-day red bottom */}
      {isSaturday && !afternoon && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 21,
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0), rgba(224,120,120,0.65))',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

const EmployeeSchedule = ({
  loading,
  schedule_List,
  shift_management_id,
  leave_type_data,
  leave_type,
  success,
}) => {
  const {
    token: {
      colorBgContainer,
      colorBorderSecondary,
      colorText,
    },
  } = theme.useToken();
  const [openShift, setOpenShift] = useState(false)
  const [openLeaveType, setOpenLeaveType] = useState(false)
  if (loading && !schedule_List) {
    return <Skeleton active />;
  }

  /*
   * Your API:
   *
   * shift_management: {
   *   _id: "...",
   *   shift_name: "M-Sat (Half)",
   *   attendance: {...}
   * }
   *
   * So schedule_List should be shift_management.
   */
  const attendance =
    schedule_List?.attendance || {};

  const cardStyle = {
    width: '100%',
    background: colorBgContainer,
    border: `1px solid ${colorBorderSecondary}`,
    borderRadius: 10,
    color: colorText,
  };

  const handleShiftEdit = () => {
    setOpenShift(true)
  };

  const handleLeaveEdit = () => {
    setOpenLeaveType(true)
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* =========================
          CURRENT SHIFT
      ========================== */}

      <div
        style={{
          ...cardStyle,
          padding: '7px',
        }}
      >
        <CardHeader
          title="Current Shift"
          onEdit={handleShiftEdit}
        />

        <UpdateShift schedule_List={schedule_List} shift_management_id={shift_management_id} open={openShift} setOpen={setOpenShift} />
        {!shift_management_id ? (
          <div
            style={{
              minHeight: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff4d4f',
              fontSize: 12,
            }}
          >
            * Required Add Shift Name
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, minmax(0, 1fr))',
              gap: 6,
            }}
          >
            {DAYS.map((day) => (
              <ShiftDayCard
                key={day}
                day={day}
                data={attendance?.[day]}
              />
            ))}
          </div>
        )}
      </div>

      {/* =========================
          LEAVE TYPE
      ========================== */}

      <div
        style={{
          ...cardStyle,
          padding: '7px 10px 12px',
        }}
      >
        <CardHeader
          title="Leave Type"
          onEdit={handleLeaveEdit}
        />
        <UpdateLeaveType leave_type={leave_type_data?._id} success={success} open={openLeaveType} setOpen={setOpenLeaveType} />
        {!leave_type ||
          leave_type.length === 0 ? (
          <div
            style={{
              color: '#ff4d4f',
              fontSize: 12,
              padding: '10px 0',
            }}
          >
            * Required Add Leave Type
          </div>
        ) : (
          <>

            <LeaveTypePanel
              leave_type_data={
                leave_type_data || []
              }
              leave_type={leave_type || []}
              success={success}
              compact
            />
          </>

        )}
      </div>

      <style>
        {`
          @media (max-width: 600px) {
            .employee-shift-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EmployeeSchedule;