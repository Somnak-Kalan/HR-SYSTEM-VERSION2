import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Row, Input, Col, Breadcrumb, Table } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';

import GroupBtn from 'components/GroupBtn';
import ApplyShift from './ApplyShift';
import ViewShiftName from './ViewShitName';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useEmployeeScheduleStore } from '../../../stores/EmployeeSchedule/employeeSchedule.store';

const getEmployeeRows = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  const arrays = [payload?.data?.data, payload?.data, payload?.employees, payload?.employee, payload?.employee_list];

  const found = arrays.find((item) => Array.isArray(item) && item.length > 0);

  if (found) return found;

  if (typeof payload === 'object') {
    const numericRows = Object.keys(payload)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => payload[key])
      .filter(Boolean);

    if (numericRows.length > 0) return numericRows;
  }

  return [];
};

const MainEmployeeSchedulePage = () => {
  const { setContent } = useContent();
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const schedules = useEmployeeScheduleStore((s) => s.schedules);
  const loading = useEmployeeScheduleStore((s) => s.loading);
  const fetchSchedules = useEmployeeScheduleStore((s) => s.fetchSchedules);
  const fetchScheduleDetail = useEmployeeScheduleStore((s) => s.fetchScheduleDetail);

  const [open_modal_view, setOpenModelView] = useState(false);
  const [propData, setPropData] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadSchedules = useCallback(async () => {
    if (!access_token) return;

    await fetchSchedules({
      access_token,
      doc: {
        search: '',
      },
    });
  }, [access_token, fetchSchedules]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const filteredList = useMemo(() => {
    const list = Array.isArray(schedules) ? schedules : [];
    const q = (search || '').trim().toLowerCase();

    if (!q) return list;

    return list.filter((item) =>
      String(item?.shift_name || '')
        .toLowerCase()
        .includes(q)
    );
  }, [schedules, search]);

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      onChange: (page) => setCurrentPage(page),
      total: filteredList.length,
      showSizeChanger: false,
    }),
    [currentPage, pageSize, filteredList.length]
  );

  const renderNo = useCallback((_, __, index) => (currentPage - 1) * pageSize + index + 1, [currentPage, pageSize]);

  const columns = useMemo(
    () => [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 60,
        align: 'center',
        render: renderNo,
      },
      {
        title: 'Shift Name',
        dataIndex: 'shift_name',
        key: 'shift_name',
        render: (value) => value || '-',
      },
      {
        title: 'Employee',
        dataIndex: 'employee',
        key: 'employee',
        align: 'center',
        width: 120,
        render: (_, record) => {
          return (
            record?.employee ??
            record?.employee_count ??
            record?.total_employee ??
            record?.employees?.length ??
            record?.employee_list?.length ??
            record?.data?.length ??
            0
          );
        },
      },
    ],
    [renderNo]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'radio',
      onChange: (_, selectedRows) => {
        setPropData(selectedRows?.[0] || null);
      },
    }),
    []
  );

  const handleView = useCallback(async () => {
    if (!propData) return;

    const id = propData?._id || propData?.id || propData?.shift_management_id;

    if (!id) {
      setOpenModelView(true);
      return;
    }

    const detail = await fetchScheduleDetail({
      access_token,
      id,
      doc: {
        search: '',
      },
    });

    const employeeRows = getEmployeeRows(detail);

    setPropData({
      ...propData,
      ...(detail && typeof detail === 'object' && !Array.isArray(detail) ? detail : {}),
      data: employeeRows,
      employees: employeeRows,
      employee: employeeRows.length,
      total_employee: employeeRows.length,
    });

    setOpenModelView(true);
  }, [propData, fetchScheduleDetail, access_token]);

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <div>
          <GroupBtn collapsed={collapsed} viewBtn={!!propData} showViewBtn onViewBtnClick={handleView} />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },
            { title: 'employee schedule' },
          ]}
        />
      </div>
    );
  }, [setContent, collapsed, navigate, propData, handleView]);

  return (
    <div>
      <Card title="EMPLOYEE SCHEDULE" extra={<ApplyShift onRefresh={loadSchedules} />}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="search by shift name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingTop: 5, paddingBottom: 5 }}
              prefix={<SearchOutlined style={{ fontSize: 16, color: '#1890ff' }} />}
              allowClear
            />
          </Col>
        </Row>

        <ViewShiftName
          open={open_modal_view}
          setOpen={setOpenModelView}
          propData={propData}
          access_token={access_token}
        />

        <Table
          rowKey={(row) => row?._id || row?.id || row?.shift_management_id}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredList}
          pagination={paginationConfig}
          bordered
          size="small"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default MainEmployeeSchedulePage;
