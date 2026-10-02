import { useNavigate, useOutletContext } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Modal, Row, message } from 'antd';
import { HomeOutlined, UserAddOutlined } from '@ant-design/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import GroupBtn from 'components/GroupBtn';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useLateTypeStore } from '../../../stores/lateType.store';

import AddLate from './AddLate';
import EditLate from './EditLate';
import FilterLate from './FilterLate';
import LateList from './LateList';

const getId = (item) => {
  return item?._id || item?.id || '';
};

const getDate = (item) => {
  if (Array.isArray(item?.permission_date)) {
    return item.permission_date[0]?.date || '';
  }

  return item?.permission_date || '';
};

const MainLatePage = () => {
  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [openAdd, setOpenAdd] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  const list = useLateTypeStore((state) => state.list);

  const total = useLateTypeStore((state) => state.total);

  const page = useLateTypeStore((state) => state.page);

  const size = useLateTypeStore((state) => state.size);

  const filters = useLateTypeStore((state) => state.filters);

  const loading = useLateTypeStore((state) => state.loading);

  const selected = useLateTypeStore((state) => state.selected);

  const fetchList = useLateTypeStore((state) => state.fetchList);

  const removeLate = useLateTypeStore((state) => state.removeLate);

  const clearSelection = useLateTypeStore((state) => state.clearSelection);

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
    const id = getId(selected);

    if (!id) return;

    const date = getDate(selected);

    Modal.confirm({
      title: 'Delete late request?',

      content: (
        <Row gutter={[4, 4]}>
          <Col span={7}>Employee ID</Col>

          <Col span={1}>:</Col>

          <Col span={16}>{selected?.employeeId || selected?.employee_id || ''}</Col>

          <Col span={7}>Name</Col>

          <Col span={1}>:</Col>

          <Col span={16}>{selected?.name || selected?.full_name || ''}</Col>

          <Col span={7}>Date</Col>

          <Col span={1}>:</Col>

          <Col span={16}>
            <span
              style={{
                color: '#1677ff',
              }}>
              {date ? dayjs(date).format('YYYY-MM-DD') : ''}
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
          await removeLate({
            access_token,
            id,
          });

          message.success('Late request removed successfully');
        } catch (error) {
          message.warning(error?.message || 'Cannot remove late request');
        }
      },
    });
  }, [selected, access_token, removeLate]);

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={collapsed}
          editBtn={!!selected}
          showEditBtn
          onEditBtnClick={() => {
            if (getId(selected)) {
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
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },
            {
              title: 'Late',
            },
          ]}
        />
      </div>
    );
  }, [setContent, collapsed, navigate, selected, handleDelete]);

  return (
    <Card
      title="LATE"
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
          Add Late
        </Button>
      }>
      <FilterLate size={size} onSearch={handleSearch} />

      <AddLate
        open={openAdd}
        setOpen={setOpenAdd}
        access_token={access_token}
        onSaved={() => {
          setOpenAdd(false);
        }}
      />

      <EditLate
        open={openUpdate}
        setOpen={setOpenUpdate}
        id={getId(selected)}
        access_token={access_token}
        onSaved={() => {
          setOpenUpdate(false);
          clearSelection();
        }}
      />

      <LateList loading={loading} data={list} total={total} page={page} size={size} onPageChange={handlePageChange} />
    </Card>
  );
};

export default MainLatePage;
