/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Row, Input, Col, Breadcrumb, Modal, message, Space, Table } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dayjs from 'dayjs';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import AddShiftMgmt from './AddShiftMgmt';
import UpdateShiftMgmt from './UpdateShiftMgmt';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';

const DAYS = [
  { key: 'monday', title: 'Monday' },
  { key: 'tuesday', title: 'Tuesday' },
  { key: 'wednesday', title: 'Wednesday' },
  { key: 'thursday', title: 'Thursday' },
  { key: 'friday', title: 'Friday' },
  { key: 'saturday', title: 'Saturday' },
  { key: 'sunday', title: 'Sunday' },
];

const getRowId = (row) => row?._id || row?.id;

const fmt = (time) => {
  const d = dayjs(time, 'HH:mm');
  return d.isValid() ? d.format('hh:mm A') : '';
};

const renderDay = (dayObj) => {
  const morning = dayObj?.morning;
  const afternoon = dayObj?.afternoon;

  const morningStart = fmt(morning?.start);
  const morningEnd = fmt(morning?.end);
  const afternoonStart = fmt(afternoon?.start);
  const afternoonEnd = fmt(afternoon?.end);

  return (
    <div>
      {(morningStart || morningEnd) && (
        <div className="my-1">
          <Space>
            <span>{morningStart}</span>
            <span>-</span>
            <span>{morningEnd}</span>
          </Space>
        </div>
      )}

      {(afternoonStart || afternoonEnd) && (
        <div className="my-1">
          <Space>
            <span>{afternoonStart}</span>
            <span>-</span>
            <span>{afternoonEnd}</span>
          </Space>
        </div>
      )}
    </div>
  );
};

const MainShiftManagementPage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [modal, contextHolder] = Modal.useModal();

  const [open_update, setOpenUpdate] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const fetchedRef = useRef(false);
  const searchTimerRef = useRef(null);

  const loading = useShiftManagementStore((s) => s.loading);
  const btn_loading = useShiftManagementStore((s) => s.btn_loading);
  const list = useShiftManagementStore((s) => s.list);
  const selectedRowKeys = useShiftManagementStore((s) => s.selectedRowKeys);
  const selected = useShiftManagementStore((s) => s.selected);

  const fetchShifts = useShiftManagementStore((s) => s.fetchShifts);
  const getShiftById = useShiftManagementStore((s) => s.getShiftById);
  const removeShift = useShiftManagementStore((s) => s.removeShift);
  const setSelectedRowKeys = useShiftManagementStore((s) => s.setSelectedRowKeys);
  const setSelected = useShiftManagementStore((s) => s.setSelected);

  const selectedId = getRowId(selected);

  useEffect(() => {
    setContentRef.current = setContent;
  }, [setContent]);

  const success = useCallback((content) => {
    message.success({ content });
  }, []);

  const warning = useCallback((content) => {
    message.warning({ content });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelected(null);
    setModalData(null);
  }, [setSelectedRowKeys, setSelected]);

  const fetchList = useCallback(
    async (searchText) => {
      if (!access_token) return false;

      return fetchShifts({
        access_token,
        doc: {
          search: searchText || '',
        },
        force: true,
      });
    },
    [access_token, fetchShifts]
  );

  const closeUpdateModal = useCallback(
    (value) => {
      setOpenUpdate(value);

      if (!value) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  useEffect(() => {
    if (!access_token) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchList('');
  }, [access_token, fetchList]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;

      setSearch(value);
      setCurrentPage(1);
      clearSelection();

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        fetchList(value);
      }, 350);
    },
    [clearSelection, fetchList]
  );

  const tableData = useMemo(() => {
    return Array.isArray(list) ? list : [];
  }, [list]);

  const renderNo = useCallback(
    (_, __, index) => {
      return (currentPage - 1) * pageSize + index + 1;
    },
    [currentPage]
  );

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'No',
        key: 'no',
        width: 60,
        align: 'center',
        render: renderNo,
      },
      {
        title: 'Shift Name',
        dataIndex: 'shift_name',
        key: 'shift_name',
      },
    ];

    const dayColumns = DAYS.map((day) => ({
      title: day.title,
      key: day.key,
      render: (_, record) => renderDay(record?.attendance?.[day.key]),
    }));

    return [...baseColumns, ...dayColumns];
  }, [renderNo]);

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      onChange: (page) => setCurrentPage(page),
      total: tableData.length,
      showSizeChanger: false,
    }),
    [currentPage, tableData.length]
  );

  const selectRow = useCallback(
    (row) => {
      const id = getRowId(row);

      setSelectedRowKeys(id ? [id] : []);
      setSelected(row || null);
      setModalData(row || null);
    },
    [setSelectedRowKeys, setSelected]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'radio',
      selectedRowKeys,
      onChange: (_, rows) => {
        const row = rows?.[0];
        selectRow(row || null);
      },
    }),
    [selectedRowKeys, selectRow]
  );

  const openEditModal = useCallback(async () => {
    if (!selectedId) {
      warning('Please select shift first');
      return;
    }

    const rec = await getShiftById({
      access_token,
      id: selectedId,
    });

    if (!rec) {
      warning('Cannot get shift detail');
      return;
    }

    setModalData(rec);
    setOpenUpdate(true);
  }, [selectedId, access_token, getShiftById, warning]);

  const onDelete = useCallback(() => {
    if (!selectedId) {
      warning('Please select shift first');
      return;
    }

    modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: async () => {
        const res = await removeShift({
          access_token,
          id: selectedId,
        });

        if (res?.status === true || res === true || res) {
          success('Remove Success');
          clearSelection();
        } else {
          warning('Cannot remove record');
        }
      },
    });
  }, [modal, selectedId, access_token, removeShift, success, warning, clearSelection]);

  useEffect(() => {
    setContentRef.current(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            editBtn={!!selectedId}
            showEditBtn
            onEditBtnClick={openEditModal}
            deleteBtn={!!selectedId}
            showDeleteBtn
            onDeleteBtnClick={onDelete}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />,
            },
            {
              title: 'shift management',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, openEditModal, onDelete, navigate]);

  return (
    <div>
      {contextHolder}

      <Card title="SHIFT MANAGEMENT" extra={<AddShiftMgmt />}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
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
              placeholder="Search shift from API"
              value={search}
              onChange={handleSearchChange}
              allowClear
            />
          </Col>
        </Row>

        <UpdateShiftMgmt
          open={open_update}
          setOpen={closeUpdateModal}
          propData={modalData}
          onUpdated={clearSelection}
        />

        <Table
          rowKey={(row) => getRowId(row)}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={paginationConfig}
          bordered
          size="small"
          loading={loading || btn_loading}
          scroll={{ x: 'max-content' }}
          onRow={(record) => ({
            onClick: (event) => {
              const target = event.target;

              if (
                target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('.ant-radio') ||
                target.closest('.ant-radio-wrapper')
              ) {
                return;
              }

              const id = getRowId(record);

              if (selectedRowKeys.includes(id)) {
                clearSelection();
              } else {
                selectRow(record);
              }
            },
          })}
        />
      </Card>
    </div>
  );
};

export default MainShiftManagementPage;
