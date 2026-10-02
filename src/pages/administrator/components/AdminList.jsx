import { Table, Tag, Space, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  UserDeleteOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CheckOutlined,
  CloseOutlined,
  DesktopOutlined,
  MobileOutlined,
} from '@ant-design/icons';

const toBoolean = (value) => {
  return value === true || value === 1 || value === '1' || value === 'true';
};

const CircleAction = ({ title, icon, className = '', onClick, disabled = false }) => {
  return (
    <Tooltip title={title}>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`
          flex h-8 w-8 items-center justify-center rounded-full border
          bg-white text-[15px] transition-all duration-200
          hover:scale-105 hover:shadow-sm
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}>
        {icon}
      </button>
    </Tooltip>
  );
};
const SystemPermissionItem = ({ icon, title, enabled }) => {
  return (
    <Tooltip title={`${title}: ${enabled ? 'Yes' : 'No'}`}>
      <div
        className="
          flex min-w-[42px] items-center justify-center gap-1.5
          rounded-md border border-gray-200 bg-gray-50
          px-2 py-1
        ">
        <span className="text-base text-gray-600">{icon}</span>

        {enabled ? (
          <CheckOutlined className="text-sm text-blue-500" />
        ) : (
          <CloseOutlined className="text-sm text-red-500" />
        )}
      </div>
    </Tooltip>
  );
};
const renderSystemAccess = (_, record) => {
  const items = [
    {
      key: 'systemCore',
      title: 'System Core',
      icon: <DesktopOutlined />,
      enabled: toBoolean(record?.systemCore),
    },
    {
      key: 'systemApp',
      title: 'System App',
      icon: <MobileOutlined />,
      enabled: toBoolean(record?.systemApp),
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {items.map((item) => (
        <Tooltip key={item.key} title={`${item.title}: ${item.enabled ? 'Yes' : 'No'}`}>
          <div className="flex items-center gap-1.5">
            <span className="text-lg text-gray-600">{item.icon}</span>

            {item.enabled ? (
              <CheckOutlined className="text-sm text-blue-500" />
            ) : (
              <CloseOutlined className="text-sm text-red-500" />
            )}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
const actionRender = (record, { onEdit, onDelete, onRemoveFromCore }, type) => {
  const canRemoveFromCore = type === 'user' && toBoolean(record?.systemCore) && typeof onRemoveFromCore === 'function';

  return (
    <Space size={8}>
      {onEdit && (
        <CircleAction
          title="Edit"
          icon={<EditOutlined />}
          className="
            border-gray-300 text-gray-700
            hover:border-gray-500 hover:text-gray-900
          "
          onClick={() => onEdit(record)}
        />
      )}

      {onDelete && (
        <CircleAction
          title="Delete"
          icon={<DeleteOutlined />}
          className="
            border-red-200 text-red-500
            hover:border-red-500 hover:text-red-600
          "
          onClick={() => onDelete(record)}
        />
      )}
    </Space>
  );
};

const actionColumn = (type, handlers) => ({
  title: 'Action',
  width: type === 'user' ? 150 : 120,
  fixed: 'right',
  align: 'center',
  render: (_, record) => actionRender(record, handlers, type),
});

const renderEllipsisText = (text, max = 50) => {
  const value = String(text || '');

  if (value.length <= max) {
    return <span>{value || '-'}</span>;
  }

  return (
    <Tooltip title={value}>
      <span className="cursor-pointer">{value.slice(0, max)}...</span>
    </Tooltip>
  );
};

const renderStatus = (status) => {
  const value = String(status || '').toLowerCase();
  const isActive = value === 'active';

  return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>;
};

const renderBoolean = (value) => {
  return toBoolean(value) ? <Tag color="green">Yes</Tag> : <Tag color="default">No</Tag>;
};

const getColumns = (type, handlers) => {
  if (type === 'user') {
    return [
      {
        title: 'No',
        dataIndex: 'no',
        width: 60,
        align: 'center',
      },
      {
        title: 'Username',
        dataIndex: 'username',
        width: 200,
        render: (_, record) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-gray-800">{record?.username || '-'}</span>

            <span className="text-xs text-gray-500">{record?.staffCode || '-'}</span>
          </div>
        ),
      },
      {
        title: 'Full Name',
        dataIndex: 'fullName',
        width: 200,
        render: (text) => text || '-',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        width: 110,
        render: (text) => String(text || '-').toUpperCase(),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: 120,
        render: renderStatus,
      },
      {
        title: 'Admin',
        dataIndex: 'isAdmin',
        width: 100,
        align: 'center',
        render: renderBoolean,
      },
      {
        title: 'System Access',
        key: 'systemAccess',
        width: 150,
        align: 'center',
        render: renderSystemAccess,
      },
      actionColumn(type, handlers),
    ];
  }

  if (type === 'role') {
    return [
      {
        title: 'No',
        dataIndex: 'no',
        width: 60,
        align: 'center',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: 220,
        render: (text) => <span className="font-semibold">{text || '-'}</span>,
      },
      {
        title: 'User',
        dataIndex: 'user',
        width: 260,
        render: (text) => renderEllipsisText(text, 40),
      },
      {
        title: 'Company',
        dataIndex: 'company',
        width: 240,
        render: (text) => text || '-',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        width: 240,
        render: (text) => text || '-',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: 260,
        render: (text) => renderEllipsisText(text, 50),
      },
      actionColumn(type, handlers),
    ];
  }

  return [
    {
      title: 'No',
      dataIndex: 'no',
      width: 60,
      align: 'center',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 320,
      render: (text) => <span className="font-semibold text-blue-500">{text || '-'}</span>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      width: 280,
      render: (text) => text || '-',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      width: 250,
      render: (text) => text || '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 280,
      render: (text) => renderEllipsisText(text, 50),
    },
    actionColumn(type, handlers),
  ];
};

const AdminList = ({ type, data, loading, onEdit, onDelete, onRemoveFromCore, pagination, onTableChange }) => {
  const scrollX = {
    user: 1250,
    role: 1510,
    module: 1120,
  };

  return (
    <Table
      rowKey={(record) => record?._id || record?.id || record?.key}
      columns={getColumns(type, {
        onEdit,
        onDelete,
        onRemoveFromCore,
      })}
      dataSource={data || []}
      loading={loading}
      pagination={
        pagination || {
          pageSize: 10,
        }
      }
      onChange={onTableChange}
      className="admin-table"
      size="small"
      scroll={{
        x: scrollX[type] || 1120,
      }}
    />
  );
};

export default AdminList;
