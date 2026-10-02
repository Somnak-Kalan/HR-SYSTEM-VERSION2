/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Row, Input, Col, Breadcrumb, Modal, Space, message, Table } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AddAttendanceRule from './AddAttendanceRule';
import UpdateAttendanceRule from './UpdateAttendanceRule';
import { AuthContext } from '../../../contexts/AuthContext';
import dayjs from 'dayjs';
import { useContent } from '../../../contexts/ContentContext';
import { useAttendanceRuleStore } from '../../../stores/EmployeeSchedule/attendanceRule.store';

const getRowId = (row) => row?._id || row?.id;

const capitalizeString = (str) => {
  const s = String(str || '').replace(/_/g, ' ');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
};

const MainAttendanceRulePage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [open_update, setOpenUpdate] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const fetchedRef = useRef(false);
  const searchTimerRef = useRef(null);

  const loading = useAttendanceRuleStore((s) => s.loading);
  const list = useAttendanceRuleStore((s) => s.list);
  const selectedRowKeys = useAttendanceRuleStore((s) => s.selectedRowKeys);
  const selected = useAttendanceRuleStore((s) => s.selected);

  const fetchAttendanceRules = useAttendanceRuleStore((s) => s.fetchAttendanceRules);
  const getAttendanceRuleById = useAttendanceRuleStore((s) => s.getAttendanceRuleById);
  const removeAttendanceRule = useAttendanceRuleStore((s) => s.removeAttendanceRule);
  const setSelectedRowKeys = useAttendanceRuleStore((s) => s.setSelectedRowKeys);
  const setSelected = useAttendanceRuleStore((s) => s.setSelected);

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

      return fetchAttendanceRules({
        access_token,
        doc: {
          search: searchText || '',
        },
        force: true,
      });
    },
    [access_token, fetchAttendanceRules]
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

  const previewBreakTime = useCallback((break_time) => {
    if (!break_time?.start || !break_time?.end) return '';

    const s = dayjs(break_time.start, 'HH:mm');
    const e = dayjs(break_time.end, 'HH:mm');

    return `${s.isValid() ? s.format('hh:mm A') : ''} - ${e.isValid() ? e.format('hh:mm A') : ''}`;
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'No',
        key: 'no',
        width: 50,
        align: 'center',
        render: renderNo,
      },
      {
        title: 'Attendance Rule Name',
        dataIndex: 'attendance_rule_name',
        key: 'attendance_rule_name',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (_, record) => <span>{record?.type ? capitalizeString(record.type) : ''}</span>,
      },
      {
        title: 'Time Control',
        dataIndex: 'time_control',
        key: 'time_control',
        render: (_, record) =>
          record?.time_control === 'scan_in' ? 'Scan In' : record?.time_control === 'scan_out' ? 'Scan Out' : '',
      },
      {
        title: 'Duration (Min) / Break Time',
        dataIndex: 'duration',
        key: 'duration',
        render: (_, record) => (
          <Space>
            {record?.type === 'break_time' ? (
              <span>{previewBreakTime(record?.break_time)}</span>
            ) : (
              <span>{record?.duration ?? 0} (min)</span>
            )}
          </Space>
        ),
      },
      {
        title: 'Round Off Control',
        dataIndex: 'round_off_control',
        key: 'round_off_control',
        render: (_, record) => (
          <span>{record?.round_off_control ? capitalizeString(record.round_off_control) : ''}</span>
        ),
      },
    ],
    [renderNo, previewBreakTime]
  );

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
      warning('Please select attendance rule first');
      return;
    }

    const rec = await getAttendanceRuleById({
      access_token,
      id: selectedId,
    });

    if (!rec) {
      warning('Cannot get attendance rule detail');
      return;
    }

    setModalData(rec);
    setOpenUpdate(true);
  }, [selectedId, access_token, getAttendanceRuleById, warning]);

  const onDelete = useCallback(() => {
    if (!selectedId) {
      warning('Please select attendance rule first');
      return;
    }

    Modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: async () => {
        const res = await removeAttendanceRule({
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
  }, [selectedId, access_token, removeAttendanceRule, success, warning, clearSelection]);

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
              title: 'attendance rule',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, openEditModal, onDelete, navigate]);

  return (
    <div>
      <Card title="ATTENDANCE RULE" extra={<AddAttendanceRule />}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="Search from API"
              value={search}
              onChange={handleSearchChange}
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
              allowClear
            />
          </Col>
        </Row>

        <UpdateAttendanceRule
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
          loading={loading}
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

export default MainAttendanceRulePage;
