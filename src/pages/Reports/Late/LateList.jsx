import { Table } from 'antd';
import dayjs from 'dayjs';

import ReadMoreComponent from '../../../components/ReadMore';
import { useLateTypeStore } from '../../../stores/lateType.store';

const getId = (item) => {
  return item?._id || item?.id || '';
};

const getPermissionDate = (item) => {
  if (Array.isArray(item?.permission_date)) {
    return item.permission_date[0] || null;
  }

  if (item?.permission_date) {
    return {
      date: item.permission_date,
      day: item?.day,
    };
  }

  return null;
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

const LateList = ({ loading, data, total, page, size, onPageChange }) => {
  const selectedRowKeys = useLateTypeStore((state) => state.selectedRowKeys);

  const setSelected = useLateTypeStore((state) => state.setSelected);

  const columns = [
    {
      title: 'No',
      width: 60,
      align: 'center',
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: 'Employee ID',
      render: (_, item) => item?.employeeId || item?.employee_id || '',
    },
    {
      title: 'Full Name',
      render: (_, item) => <ReadMoreComponent text={item?.name || item?.full_name || ''} />,
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Date',
      render: (_, item) => {
        const permissionDate = getPermissionDate(item);

        return permissionDate?.date ? dayjs(permissionDate.date).format('YYYY-MM-DD') : '';
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
      rowKey={getId}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: (_, rows) => {
          setSelected(rows?.[0] || null);
        },
      }}
      columns={columns}
      dataSource={Array.isArray(data) ? data : []}
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

export default LateList;
