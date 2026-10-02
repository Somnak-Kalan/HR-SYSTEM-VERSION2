// import React, { useMemo } from 'react';
// import { Table } from 'antd';
// import { buildEmployeeColumns } from './employeeColumns';

// const getRowId = (row) => {
//   return row?.id || row?._id || row?.employee_id;
// };

// export default function EmployeeTable({
//   loading,
//   data = [],
//   total = 0,
//   currentPage = 1,
//   pageSize = 10,
//   onChangePage,
//   onChangePageSize,
//   onSelectRow,
//   selectedRowId,
// }) {
//   const columns = useMemo(() => buildEmployeeColumns({ currentPage, pageSize }), [currentPage, pageSize]);

//   const paginationConfig = useMemo(
//     () => ({
//       current: Number(currentPage) || 1,
//       pageSize: Number(pageSize) || 10,

//       total: Number(total) || 0,

//       showSizeChanger: true,
//       pageSizeOptions: ['10', '20', '50', '100'],
//       // showTotal: total => `Total ${total} employees`,

//       onChange: (page, size) => {
//         if (size !== pageSize) {
//           onChangePageSize?.(size);
//           return;
//         }

//         onChangePage?.(page);
//       },
//     }),
//     [currentPage, pageSize, total, onChangePage, onChangePageSize]
//   );

//   const rowSelection = useMemo(
//     () => ({
//       type: 'radio',
//       selectedRowKeys: selectedRowId ? [selectedRowId] : [],
//       onChange: (_, selectedRows) => {
//         const selectedRow = selectedRows?.[0];

//         if (!selectedRow) {
//           onSelectRow?.(null);
//           return;
//         }

//         onSelectRow?.({
//           ...selectedRow,
//           id: getRowId(selectedRow),
//         });
//       },
//     }),
//     [selectedRowId, onSelectRow]
//   );

//   return (
//     // <Table
//     //   rowKey={row => getRowId(row)}
//     //   rowSelection={rowSelection}
//     //   columns={columns}
//     //   dataSource={data}
//     //   pagination={paginationConfig}
//     //   bordered
//     //   size="small"
//     //   loading={loading}
//     //   scroll={{ x: 'max-content' }}
//     // />
//     <Table
//       className="employee-table-fixed"
//       rowKey={(row) => row?.id || row?._id}
//       rowSelection={{
//         type: 'radio',
//         fixed: true,
//         columnWidth: 45,
//         selectedRowKeys: selectedRowId ? [selectedRowId] : [],
//         onChange: (_, selectedRows) => {
//           onSelectRow?.(selectedRows?.[0] || null);
//         },
//       }}
//       columns={columns}
//       dataSource={data}
//       pagination={paginationConfig}
//       bordered
//       size="small"
//       loading={loading}
//       scroll={{ x: 2000 }}
//       tableLayout="fixed"
//     />
//   );
// }
import React, { useMemo } from 'react';

import { Table } from 'antd';

import { buildEmployeeColumns } from './EmployeeColumns';

const getRowId = (row) => {
  return row?.id || row?._id || row?.employee_id;
};

export default function EmployeeTable({
  data = [],

  loading = false,

  total,

  currentPage = 1,

  pageSize = 10,

  selectedRowId,

  onSelectRow,
}) {
  const columns = useMemo(
    () =>
      buildEmployeeColumns({
        currentPage,

        pageSize,
      }),

    [currentPage, pageSize]
  );

  return (
    <Table
      className="employee-table-fixed"

      rowKey={(row) => getRowId(row)}

      rowSelection={{
        type: 'radio',

        columnWidth: 45,

        selectedRowKeys: selectedRowId ? [selectedRowId] : [],

        onChange: (_, rows) => {
          onSelectRow?.(rows?.[0] || null);
        },
      }}

      columns={columns}

      dataSource={data}

      bordered

      size="small"

      loading={loading}

      pagination={{
        pageSize: 10,

        showSizeChanger: true,

        pageSizeOptions: ['10', '20', '50', '100'],

        showTotal: (total) => `${total} Total Amount`,
      }}

      scroll={{
        x: 2200,
      }}

      tableLayout="fixed"
    />
  );
}
