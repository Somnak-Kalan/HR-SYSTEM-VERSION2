// import { useContext, useEffect, useMemo } from 'react';
// import { Collapse, Divider, Row, Col, Spin, Empty, Typography } from 'antd';

// import UpdateLeaveType from '../../../pages/SetUp/Employee/Details/Edit/UpdateLeaveType';
// import { AuthContext } from '../../../contexts/AuthContext';
// import { useEmployeeDetailStore } from '../../../stores/employeeDetail.store';

// const { Text } = Typography;

// const getId = (item) => {
//   if (!item) return null;
//   if (typeof item === 'string') return item;

//   return item?._id || item?.id || item?.value || null;
// };

// const normalizeIds = (value) => {
//   if (!value) return [];

//   const list = Array.isArray(value) ? value : [value];

//   return list.map(getId).filter(Boolean);
// };

// const getLeaveName = (item) => {
//   return item?.leave_type_name || item?.name || item?.label || '-';
// };

// const getLeaveType = (item) => {
//   return item?.type || item?.leave_type || item?.leave_type_type || item?.category || '-';
// };

// export default function LeaveTypePanel({ leave_type_data, leave_type, success }) {
//   const { access_token } = useContext(AuthContext);

//   const storeLeaveTypeData = useEmployeeDetailStore((s) => s.leave_type_data);
//   const leaveTypeDetailLoading = useEmployeeDetailStore((s) => s.leaveTypeDetailLoading);

//   const leaveTypeIds = useMemo(() => normalizeIds(leave_type), [leave_type]);
//   const leaveTypeIdsKey = useMemo(() => JSON.stringify(leaveTypeIds), [leaveTypeIds]);

//   const displayData = useMemo(() => {
//     if (Array.isArray(storeLeaveTypeData) && storeLeaveTypeData.length > 0) {
//       return storeLeaveTypeData;
//     }

//     if (Array.isArray(leave_type_data) && leave_type_data.length > 0) {
//       return leave_type_data;
//     }

//     return [];
//   }, [storeLeaveTypeData, leave_type_data]);

//   const items = useMemo(() => {
//     return [
//       {
//         key: 'panel-leave',
//         label: (
//           <div className="flex">
//             <header className="text-gray-500 font-semibold">Leave Type</header>
//           </div>
//         ),
//         extra: (
//           <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
//             <UpdateLeaveType leave_type={leaveTypeIds} success={success} />
//           </div>
//         ),
//         children: (
//           <Col sm={24} md={18} lg={18} xl={24} className="sm:mt-5 lg:mt-0">
//             <div className="my-3">
//               <Divider titlePlacement="left">Leave Type</Divider>
//             </div>

//             {leaveTypeDetailLoading ? (
//               <div style={{ padding: 24, textAlign: 'center' }}>
//                 <Spin />
//               </div>
//             ) : displayData.length > 0 ? (
//               <>
//                 <Row
//                   style={{
//                     marginBottom: 8,
//                     color: '#262626',
//                     fontWeight: 700,
//                   }}>
//                   <Col span={12}>
//                     <Text strong>Leave Type Name</Text>
//                   </Col>

//                   <Col span={1}>
//                     <Text strong>:</Text>
//                   </Col>

//                   <Col span={11}>
//                     <Text strong>Leave Type</Text>
//                   </Col>
//                 </Row>

//                 {displayData.map((item, index) => (
//                   <Row
//                     key={item?._id || item?.id || item?.value || index}
//                     style={{
//                       marginBottom: 6,
//                       color: '#5b6b86',
//                       fontWeight: 500,
//                     }}>
//                     <Col span={12}>
//                       <Text style={{ color: '#5b6b86', fontWeight: 600 }}>{getLeaveName(item)}</Text>
//                     </Col>

//                     <Col span={1}>
//                       <Text style={{ color: '#5b6b86', fontWeight: 600 }}>:</Text>
//                     </Col>

//                     <Col span={11}>
//                       <Text style={{ color: '#5b6b86' }}>{getLeaveType(item)}</Text>
//                     </Col>
//                   </Row>
//                 ))}
//               </>
//             ) : (
//               <Empty description="No leave types available" />
//             )}
//           </Col>
//         ),
//       },
//     ];
//   }, [displayData, leaveTypeDetailLoading, leaveTypeIds, success, access_token]);

//   return <Collapse items={items} style={{ padding: 0, margin: 0, border: 'solid 1px white' }} />;
// }
import React, { useMemo } from 'react';
import { Empty, Spin, theme } from 'antd';

import { useEmployeeDetailStore } from '../../../stores/employeeDetail.store';

const getLeaveName = (item) => {
  return (
    item?.name ||
    item?.leave_type_name ||
    item?.label ||
    '-'
  );
};

const getTotal = (item) => {
  return (
    item?.total ??
    item?.total_day ??
    item?.total_days ??
    0
  );
};

const getUsedValue = (item) => {
  const value =
    item?.use ??
    item?.used ??
    item?.used_day ??
    item?.used_days ??
    '0';

  // Example API:
  // use: "0.5/1.5"
  if (typeof value === 'string') {
    return value;
  }

  return String(value);
};

const LeaveTypePanel = ({
  leave_type_data = [],
}) => {
  const {
    token: {
      colorText,
      colorTextSecondary,
    },
  } = theme.useToken();

  const storeLeaveTypeData =
    useEmployeeDetailStore(
      (state) => state.leave_type_data
    );

  const leaveTypeDetailLoading =
    useEmployeeDetailStore(
      (state) => state.leaveTypeDetailLoading
    );

  const displayData = useMemo(() => {
    // Prefer latest store data
    if (
      Array.isArray(storeLeaveTypeData) &&
      storeLeaveTypeData.length > 0
    ) {
      return storeLeaveTypeData;
    }

    if (
      Array.isArray(leave_type_data) &&
      leave_type_data.length > 0
    ) {
      return leave_type_data;
    }

    return [];
  }, [
    storeLeaveTypeData,
    leave_type_data,
  ]);

  if (leaveTypeDetailLoading) {
    return (
      <div
        style={{
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="small" />
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No leave types available"
        style={{
          margin: '15px 0',
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      {displayData.map((item, index) => {
        const name = getLeaveName(item);

        const total = getTotal(item);

        const usedValue = getUsedValue(item);

        const parts =
          String(usedValue).split('/');

        const used = parts[0] || '0';

        const allowance =
          parts[1] || total || '0';

        return (
          <div
            key={
              item?._id ||
              item?.id ||
              item?.value ||
              `${name}-${index}`
            }
            style={{
              width: '100%',
              minHeight: 58,
              background: '#f5f5f5',
              borderRadius: 10,
              padding: '8px 10px 7px 10px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              boxSizing: 'border-box',
            }}
          >
            {/* LEFT SIDE */}
            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              {/* Leave name */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colorText,
                  lineHeight: '19px',

                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </div>

              {/* Total */}
              <div
                style={{
                  marginTop: 1,
                  fontSize: 11,
                  fontWeight: 400,
                  color: colorTextSecondary,
                  lineHeight: '15px',
                }}
              >
                Total :{total} Day
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div
              style={{
                flexShrink: 0,
                textAlign: 'right',
                marginLeft: 12,
              }}
            >
              {/* Used label */}
              <div
                style={{
                  fontSize: 11,
                  color: colorTextSecondary,
                  lineHeight: '15px',
                }}
              >
                Used
              </div>

              {/* Used amount */}
              <div
                style={{
                  marginTop: 1,
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: '19px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    color: '#0958d9',
                  }}
                >
                  {used}
                </span>

                <span
                  style={{
                    color: colorText,
                  }}
                >
                  /{allowance} Day
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveTypePanel;