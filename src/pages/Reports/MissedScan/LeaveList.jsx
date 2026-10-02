import { Table } from 'antd';
import dayjs from 'dayjs';

import ReadMoreComponent from '../../../components/ReadMore';
import { useMissScanStore } from '../../../stores/Reports/missScan.store';

const getRecordId = (record) => {
  return record?._id || record?.id || '';
};

const getPermissionDates = (record) => {
  if (Array.isArray(record?.permission_date)) {
    return record.permission_date;
  }

  if (record?.permission_date) {
    return [
      {
        date: record.permission_date,

        day: record?.day,

        status_request: record?.status_request,
      },
    ];
  }

  return [];
};

const getStatusColor = (status) => {
  if (status === 'reject' || status === 'rejected') {
    return '#cd5c5c';
  }

  if (status === 'pending') {
    return '#faad14';
  }

  return '#32cd32';
};

const LeaveList = ({ loading, leaveRequestData, total, page, size, onPageChange }) => {
  const selectedRowKeys = useMissScanStore((state) => state.selectedRowKeys);

  const setSelected = useMissScanStore((state) => state.setSelected);

  const columns = [
    {
      title: 'No',
      width: 60,
      align: 'center',

      render: (_, __, index) => {
        return (page - 1) * size + index + 1;
      },
    },

    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
    },

    {
      title: 'Full Name',
      dataIndex: 'name',

      render: (value) => <ReadMoreComponent text={value || ''} />,
    },

    {
      title: 'Position',
      dataIndex: 'position',
    },

    {
      title: 'Date',

      render: (_, record) => {
        const dates = getPermissionDates(record);

        return dates.map((item, index) => (
          <div key={`${item?.date}-${index}`}>{item?.date ? dayjs(item.date).format('YYYY-MM-DD') : ''}</div>
        ));
      },
    },

    {
      title: 'Total',
      dataIndex: 'num_permission_day',
      align: 'center',
    },

    {
      title: 'Reason',
      dataIndex: 'reason',

      render: (value) => <ReadMoreComponent text={value || ''} />,
    },

    {
      title: 'Status',
      dataIndex: 'status',

      render: (status) => (
        <span
          style={{
            color: getStatusColor(status),

            textTransform: 'capitalize',
          }}>
          {status || ''}
        </span>
      ),
    },
  ];

  return (
    <Table
      rowKey={getRecordId}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,

        onChange: (_, selectedRows) => {
          setSelected(selectedRows?.[0] || null);
        },
      }}
      columns={columns}
      dataSource={Array.isArray(leaveRequestData) ? leaveRequestData : []}
      loading={loading}
      bordered
      size="small"
      scroll={{
        x: 'max-content',
      }}
      pagination={{
        current: page,
        pageSize: size,
        total,

        showSizeChanger: true,

        pageSizeOptions: ['10', '20', '50', '100'],

        showTotal: (value) => `Total ${value} records`,

        onChange: (nextPage, nextSize) => {
          onPageChange?.(nextPage, nextSize);
        },
      }}
    />
  );
};

export default LeaveList;
