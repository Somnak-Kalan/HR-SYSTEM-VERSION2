import { useNavigate, useOutletContext } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Modal, Row, message } from 'antd';
import { HomeOutlined, UserAddOutlined } from '@ant-design/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import GroupBtn from 'components/GroupBtn';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useMissScanStore } from '../../../stores/Reports/missScan.store';

import AddMissScan from './AddMissScan';
import UpdateMissScan from './UpdateMIssScan';
import LeaveList from './LeaveList';
import SearchMissScanFilter from './SearchMissScanFilter';

const getRecordId = (record) => {
  return record?._id || record?.id || '';
};

const getRequestDate = (record) => {
  if (Array.isArray(record?.permission_date)) {
    return record.permission_date[0]?.date || '';
  }

  return record?.permission_date || '';
};

const MainMissedScanPage = () => {
  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [openAdd, setOpenAdd] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  const list = useMissScanStore((state) => state.list);

  const total = useMissScanStore((state) => state.total);

  const page = useMissScanStore((state) => state.page);

  const size = useMissScanStore((state) => state.size);

  const filters = useMissScanStore((state) => state.filters);

  const loading = useMissScanStore((state) => state.loading);

  const selected = useMissScanStore((state) => state.selected);

  const fetchList = useMissScanStore((state) => state.fetchList);

  const removeMiss = useMissScanStore((state) => state.removeMiss);

  const clearSelection = useMissScanStore((state) => state.clearSelection);

  const handleSearch = useCallback(
    async (searchFilters) => {
      await fetchList({
        access_token,

        doc: {
          search: searchFilters?.search || '',

          startDate: searchFilters?.startDate || '',

          endDate: searchFilters?.endDate || '',

          page: 1,

          size: searchFilters?.size || size,
        },
      });
    },
    [access_token, fetchList, size]
  );

  const handlePageChange = useCallback(
    async (nextPage, nextSize) => {
      await fetchList({
        access_token,

        doc: {
          ...filters,

          page: nextSize !== size ? 1 : nextPage,

          size: nextSize,
        },
      });
    },
    [access_token, fetchList, filters, size]
  );

  const handleDelete = useCallback(() => {
    const selectedId = getRecordId(selected);

    if (!selectedId) {
      return;
    }

    const requestDate = getRequestDate(selected);

    Modal.confirm({
      title: 'Delete missed scan request?',

      content: (
        <Row gutter={[4, 4]}>
          <Col span={7}>Employee ID</Col>

          <Col span={1}>:</Col>

          <Col span={16}>{selected?.employeeId || ''}</Col>

          <Col span={7}>Name</Col>

          <Col span={1}>:</Col>

          <Col span={16}>{selected?.name || ''}</Col>

          <Col span={7}>Date</Col>

          <Col span={1}>:</Col>

          <Col span={16}>
            <span
              style={{
                color: '#1677ff',
              }}>
              {requestDate ? dayjs(requestDate).format('YYYY-MM-DD') : ''}
            </span>
          </Col>
        </Row>
      ),

      okText: 'Delete',

      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          await removeMiss({
            access_token,
            id: selectedId,
          });

          message.success('Missed scan removed successfully');
        } catch (error) {
          message.warning(error?.message || 'Cannot remove missed scan');
        }
      },
    });
  }, [selected, access_token, removeMiss]);

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={collapsed}
          editBtn={!!selected}
          showEditBtn
          onEditBtnClick={() => {
            if (getRecordId(selected)) {
              setOpenUpdate(true);
            }
          }}
          deleteBtn={!!selected}
          showDeleteBtn
          onDeleteBtnClick={handleDelete}
        />

        <Breadcrumb
          items={[
            {
              title: (
                <HomeOutlined
                  onClick={() => {
                    navigate('/');
                  }}
                />
              ),
            },

            {
              title: 'Missed Scan',
            },
          ]}
        />
      </div>
    );
  }, [setContent, collapsed, navigate, selected, handleDelete]);

  return (
    <Card
      title="MISSED SCAN"
      extra={
        <Button
          type="primary"
          style={{
            background: '#1677ff',
          }}
          onClick={() => {
            clearSelection();
            setOpenAdd(true);
          }}>
          <UserAddOutlined />
          Add Missed Scan
        </Button>
      }>
      <SearchMissScanFilter size={size} onSearch={handleSearch} />

      <AddMissScan
        open={openAdd}
        setOpen={setOpenAdd}
        access_token={access_token}
        onSaved={() => {
          setOpenAdd(false);
        }}
      />

      <UpdateMissScan
        open={openUpdate}
        setOpen={setOpenUpdate}
        id={getRecordId(selected)}
        access_token={access_token}
        onSaved={() => {
          setOpenUpdate(false);
          clearSelection();
        }}
      />

      <LeaveList
        loading={loading}
        leaveRequestData={list}
        total={total}
        page={page}
        size={size}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default MainMissedScanPage;
