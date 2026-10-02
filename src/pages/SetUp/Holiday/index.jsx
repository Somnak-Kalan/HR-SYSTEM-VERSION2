import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Breadcrumb, Row, Col, Input, Space, message, Form, Table, Button, Modal } from 'antd';
import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import AddHoliday from './AddHoliday';
import UpdateHoliday from './UpdateHoliday';
import { useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import dayjs from 'dayjs';
import ReadMoreComponent from '../../../components/ReadMore';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useHolidayStore } from '../../../stores/holidday.store';

const MainHolidayPage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [form_update] = Form.useForm();
  const [form_add] = Form.useForm();

  const [open_update, setOpenUpdate] = useState(false);
  const [add_open, setAddOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const loading = useHolidayStore((s) => s.loading);
  const btn_loading = useHolidayStore((s) => s.btn_loading);
  const holiday_list = useHolidayStore((s) => s.holiday_list);
  const selectedRowKeys = useHolidayStore((s) => s.selectedRowKeys);
  const selected = useHolidayStore((s) => s.selected);
  const total = useHolidayStore((s) => s.total);

  const fetchHolidays = useHolidayStore((s) => s.fetchHolidays);
  const removeHoliday = useHolidayStore((s) => s.removeHoliday);
  const setSelectedRowKeys = useHolidayStore((s) => s.setSelectedRowKeys);
  const setSelected = useHolidayStore((s) => s.setSelected);
  const clearSelected = useHolidayStore((s) => s.clearSelected);

  const selectedId = selected?.id || selected?._id;

  useEffect(() => {
    setContentRef.current = setContent;
  }, [setContent]);

  const success = useCallback((content) => message.success({ content }), []);
  const warning = useCallback((content) => message.warning({ content }), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!access_token) return;

    fetchHolidays({
      access_token,
      search: debouncedSearch,
      page: currentPage,
      size: pageSize,
    });
  }, [access_token, debouncedSearch, currentPage, fetchHolidays]);

  const renderNo = useCallback((_, __, index) => (currentPage - 1) * pageSize + index + 1, [currentPage]);

  const getStartDate = useCallback((record) => {
    if (record?.startDate) return record.startDate;

    const list = Array.isArray(record?.holiday_date) ? record.holiday_date : [];
    return list?.[0]?.date;
  }, []);

  const getEndDate = useCallback((record) => {
    if (record?.endDate) return record.endDate;

    const list = Array.isArray(record?.holiday_date) ? record.holiday_date : [];
    return list?.[list.length - 1]?.date;
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 50,
        align: 'center',
        render: renderNo,
      },
      {
        title: 'Holiday Name',
        dataIndex: 'holiday_en',
        key: 'holiday_en',
        render: (_, record) => (
          <div className="overflow-hidden leading-[18px]">
            <div className="truncate whitespace-nowrap font-bold">
              <ReadMoreComponent text={record?.holiday_kh || ''} />
            </div>

            <div className="truncate whitespace-nowrap text-sm">{record?.holiday_en || ''}</div>
          </div>
        ),
      },
      {
        title: 'Days',
        dataIndex: 'num_holiday_day',
        key: 'num_holiday_day',
        width: 80,
        align: 'center',
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        width: 160,
        render: (_, record) => {
          const date = getStartDate(record);

          return <Space>{date ? dayjs(date).format('YYYY-MM-DD') : ''}</Space>;
        },
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        width: 160,
        render: (_, record) => {
          const date = getEndDate(record);

          return <Space>{date ? dayjs(date).format('YYYY-MM-DD') : ''}</Space>;
        },
      },
    ],
    [renderNo, getStartDate, getEndDate]
  );

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      total,
      showSizeChanger: false,
      onChange: (page) => {
        setCurrentPage(page);
        clearSelected();
      },
    }),
    [currentPage, total, clearSelected]
  );

  const isLockedRow = useCallback(
    (record) => {
      const start = getStartDate(record);
      const end = getEndDate(record);

      if (!start || !end) return false;

      return (
        dayjs().isSame(dayjs(start), 'day') ||
        dayjs().isAfter(dayjs(start), 'day') ||
        dayjs().isAfter(dayjs(end), 'day')
      );
    },
    [getStartDate, getEndDate]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'radio',
      selectedRowKeys,
      onChange: (keys, selectedRows) => {
        setSelectedRowKeys(keys);
        setSelected(selectedRows?.[0]);
      },
      getCheckboxProps: (record) => ({
        disabled: isLockedRow(record),
      }),
    }),
    [selectedRowKeys, setSelectedRowKeys, setSelected, isLockedRow]
  );

  const Remove_Holiday = useCallback(() => {
    if (!selectedId) {
      warning('Please select holiday first');
      return;
    }

    Modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: async () => {
        const ok = await removeHoliday({
          id: selectedId,
          access_token,
        });

        ok ? success('Remove Success') : warning('Remove Fail');
      },
    });
  }, [selectedId, access_token, removeHoliday, success, warning]);

  useEffect(() => {
    setContentRef.current(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            editBtn={!!selectedId}
            showEditBtn
            onEditBtnClick={() => {
              if (selectedId) {
                setOpenUpdate(true);
              }
            }}
            deleteBtn={!!selectedId}
            showDeleteBtn
            onDeleteBtnClick={Remove_Holiday}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },
            {
              title: 'holiday',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, Remove_Holiday, navigate]);

  return (
    <div>
      <Card
        extra={
          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={() => {
              form_add.resetFields();
              setAddOpen(true);
            }}>
            <UserAddOutlined />
            Add Holiday
          </Button>
        }
        title="HOLIDAY">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="search by holiday name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                clearSelected();
              }}
              style={{ paddingTop: 5, paddingBottom: 5 }}
              prefix={<SearchOutlined style={{ fontSize: 16, color: '#1890ff' }} />}
              allowClear
            />
          </Col>
        </Row>

        <AddHoliday
          access_token={access_token}
          form={form_add}
          add_open={add_open}
          setAddOpen={setAddOpen}
          btn_loading={btn_loading}
        />

        <UpdateHoliday
          selectedId={selectedId}
          access_token={access_token}
          form={form_update}
          open_update={open_update}
          setOpenUpdate={setOpenUpdate}
          btn_loading={btn_loading}
        />

        <Table
          rowKey={(row) => row.id || row._id}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={holiday_list}
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

export default MainHolidayPage;
