/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Breadcrumb, Button, Form, Input, Table, Modal, message, Row, Col } from 'antd';
import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';

import AddUser from './AddUser';
import ChangePassword from './ChangePassword';
import DisableUser from './Disable';
import ResetDeviceId from './ResetDeviceId';
import dayjs from 'dayjs';
import { useAppLoginStore } from '../../../stores/appLogin.store';

const MainAppLoginPage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [form_add] = Form.useForm();
  const [form_update] = Form.useForm();
  const [disable_form] = Form.useForm();
  const [device_id_form] = Form.useForm();

  const [open_add, setOpenAdd] = useState(false);
  const [open_update, setOpenUpdate] = useState(false);
  const [open_disable, setOpenDisable] = useState(false);
  const [open_reset, setOpenReset] = useState(false);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const loading = useAppLoginStore((s) => s.loading);
  const user_list = useAppLoginStore((s) => s.user_list);
  const totalUsers = useAppLoginStore((s) => s.totalUsers);
  const selectedRowKeys = useAppLoginStore((s) => s.selectedRowKeys);
  const selected = useAppLoginStore((s) => s.selected);

  const fetchUsers = useAppLoginStore((s) => s.fetchUsers);
  const setSelectedRowKeys = useAppLoginStore((s) => s.setSelectedRowKeys);
  const setSelected = useAppLoginStore((s) => s.setSelected);
  const deleteAppLogin = useAppLoginStore((s) => s.deleteAppLogin);

  const selectedId = selected?.id || selected?._id;

  const fetchedRef = useRef(false);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    setContentRef.current = setContent;
  }, [setContent]);

  const success = useCallback((content) => {
    message.success({ content });
  }, []);

  const warning = useCallback((content) => {
    message.warning({ content });
  }, []);

  const getUserList = useCallback(
    ({ searchText = search, page = currentPage, force = true } = {}) => {
      return fetchUsers({
        access_token,
        doc: {
          search: String(searchText || '').trim(),
          page,
          size: pageSize,
        },
        force,
      });
    },
    [access_token, fetchUsers, search, currentPage]
  );

  useEffect(() => {
    if (!access_token) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    getUserList({
      searchText: '',
      page: 1,
      force: true,
    });
  }, [access_token]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value || '';

      setSearch(value);
      setCurrentPage(1);
      setSelected(null);
      setSelectedRowKeys([]);

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        getUserList({
          searchText: value,
          page: 1,
          force: true,
        });
      }, 350);
    },
    [getUserList, setSelected, setSelectedRowKeys]
  );

  useEffect(() => {
    if (!selectedId) return;

    const updated = user_list.find((u) => {
      const id = u?.id || u?._id;
      return id === selectedId;
    });

    if (updated) {
      setSelected(updated);
      setSelectedRowKeys([updated?.id || updated?._id]);
    }
  }, [user_list]);

  const tableData = useMemo(() => {
    return Array.isArray(user_list) ? user_list : [];
  }, [user_list]);

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      onChange: (page) => {
        setCurrentPage(page);
        setSelected(null);
        setSelectedRowKeys([]);

        getUserList({
          searchText: search,
          page,
          force: true,
        });
      },
      total: totalUsers,
      showSizeChanger: false,
    }),
    [currentPage, totalUsers, getUserList, search, setSelected, setSelectedRowKeys]
  );

  const renderNo = useCallback(
    (_, __, index) => {
      return (currentPage - 1) * pageSize + index + 1;
    },
    [currentPage]
  );

  const columns = useMemo(
    () => [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 50,
        align: 'center',
        render: renderNo,

        fixed: 'left',
        className: 'employee-fixed-left-cell',
      },

      {
        title: 'VTS ID & Username',
        dataIndex: 'employeeName',
        key: 'employeeName',
        fixed: 'left',
        className: 'employee-fixed-left-cell',
        render: (_, record) => (
          <div style={{ lineHeight: '18px' }}>
            <div>{record?.staffCode?.toUpperCase() || '-'}</div>
            <div style={{ fontSize: 14, color: '#888' }}>{record?.username || ''}</div>
          </div>
        ),
      },

      {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        render: (_, record) => (
          <div style={{ lineHeight: '18px' }}>
            <div>{record?.employeeName || '-'}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record?.employeeNameLatin || ''}</div>
          </div>
        ),
      },
      {
        title: 'Device ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        render: (_, record) => (
          <div style={{ lineHeight: '18px' }}>
            <div>{record?.deviceId || '-'}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {record?.lastLogin ? dayjs(record.lastLogin).format('DD/MM/YYYY HH:mm:ss') : ''}
            </div>
          </div>
        ),
      },

      {
        title: 'Date Active',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 160,
        render: (_, record) => {
          const date = record?.createdAt;

          if (!date || !dayjs(date).isValid()) {
            return <span style={{ color: '#999' }}>-</span>;
          }

          return (
            <div style={{ lineHeight: '18px' }}>
              <div style={{ fontWeight: 600 }}>{dayjs(date).format('YYYY-MM-DD')}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{dayjs(date).format('hh:mm A')}</div>
            </div>
          );
        },
      },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   align: 'center',
      //   width: 120,
      //   fixed: 'right',
      //   className: 'employee-fixed-left-cell',
      //   render: (_, record) => {
      //     const status = String(record?.status || '').toLowerCase();

      //     const isActive = status === 'active';
      //     const isPending = status === 'pending';

      //     let className = 'bg-red-500 outline-none border-none rounded-sm text-white px-5';
      //     let label = 'Inactive';

      //     if (isActive) {
      //       className = 'bg-green-500 outline-none border-none rounded-sm text-white px-6';
      //       label = 'Active';
      //     }

      //     if (isPending) {
      //       className = 'bg-yellow-500 outline-none border-none rounded-sm text-white px-5';
      //       label = 'Pending';
      //     }

      //     return (
      //       <button
      //         style={{
      //           boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
      //         }}
      //         className={className}>
      //         <strong>{label}</strong>
      //       </button>
      //     );
      //   },
      // },
    ],
    [renderNo]
  );

  const handleDelete = useCallback(() => {
    if (!selectedId) {
      warning('Please select a user first');
      return;
    }

    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to delete this user?',
      okText: 'Yes',
      cancelText: 'No',
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await deleteAppLogin({
            access_token,
            id: selectedId,
          });

          if (res) {
            success(res?.message || 'Delete success');
            setSelected(null);
            setSelectedRowKeys([]);

            getUserList({
              searchText: search,
              page: currentPage,
              force: true,
            });
          } else {
            warning('Delete failed');
          }
        } catch (error) {
          warning(error?.response?.data?.message || error?.message || 'Delete failed');
        }
      },
    });
  }, [
    selectedId,
    warning,
    deleteAppLogin,
    access_token,
    success,
    setSelected,
    setSelectedRowKeys,
    getUserList,
    search,
    currentPage,
  ]);

  useEffect(() => {
    setContentRef.current(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            disabledBtn={!!selectedId}
            showDisableBtn
            onDisableBtn={() => setOpenDisable(true)}
            changePasswordBtn={!!selectedId}
            showChangePasswordBtn
            onChangePasswordBtn={() => setOpenUpdate(true)}
            resetDeviceId={!!selectedId}
            showResetDeviceId
            onResetDeviceId={() => setOpenReset(true)}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />,
            },
            {
              title: 'app login',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, handleDelete, navigate]);

  return (
    <div>
      <Card
        title="APP LOGIN"
      // extra={
      //   <Button
      //     type='primary'
      //     style={{ background: '#1677ff' }}
      //     className='cursor-pointer text-white'
      //     onClick={() => setOpenAdd(true)}
      //   >
      //     <UserAddOutlined />
      //     Add User
      //   </Button>
      // }
      >
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="Search By employee id"
              value={search}
              onChange={handleSearchChange}
              allowClear
              style={{
                paddingTop: 5,
                paddingBottom: 5,
              }}
              prefix={
                <SearchOutlined
                  style={{
                    fontSize: 16,
                    color: '#1890ff',
                  }}
                />
              }
            />
          </Col>
        </Row>

        {open_add && (
          <AddUser
            open={open_add}
            setOpen={setOpenAdd}
            form={form_add}
            access_token={access_token}
            success={success}
            warning={warning}
          />
        )}

        <ChangePassword
          open={open_update}
          setOpen={setOpenUpdate}
          form={form_update}
          access_token={access_token}
          propData={selected}
          success={success}
          warning={warning}
        />

        <DisableUser
          open={open_disable}
          setOpen={setOpenDisable}
          form={disable_form}
          access_token={access_token}
          propData={selected}
          success={success}
          warning={warning}
        />

        <ResetDeviceId
          open={open_reset}
          setOpen={setOpenReset}
          form={device_id_form}
          access_token={access_token}
          propData={selected}
          success={success}
          warning={warning}
          onRefresh={() =>
            getUserList({
              searchText: search,
              page: currentPage,
              force: true,
            })
          }
        />

        <Table
          rowKey={(row) => row?.id || row?._id}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (_, selectedRows) => {
              const row = selectedRows?.[0];
              const id = row?.id || row?._id;

              setSelectedRowKeys(id ? [id] : []);
              setSelected(row || null);
            },
          }}
          columns={columns}
          dataSource={tableData}
          pagination={paginationConfig}
          size="small"
          bordered
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default MainAppLoginPage;
