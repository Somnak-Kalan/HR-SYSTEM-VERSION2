import { useNavigate, useOutletContext } from 'react-router-dom';

import { Breadcrumb, Button, Card, Col, Form, Input, Modal, Row, Table, Tag, message } from 'antd';

import { HomeOutlined, SearchOutlined, UserAddOutlined, EditOutlined } from '@ant-design/icons';

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import GroupBtn from 'components/GroupBtn';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useLeaveTypeStore } from '../../../stores/leaveType.store';

import AddLeaveType from './modal/AddLeaveType';
import UpdateLeaveType from './modal/UpdateLeaveType';
import ApplyLeaveTypeModal from './modal/ApplyLeaveTypeModal';
import ViewLeaveTypeModal from './modal/ViewLeaveTypeModal';

// =====================================================
// HELPERS
// =====================================================

const getRowId = (item) => {
  return item?._id || item?.id || '';
};

// =====================================================
// FORMAT ENTITLEMENT
// =====================================================

const getEntitlementText = (record) => {
  const entitlementType = record?.rulesSet?.entitlementType?.toLowerCase();

  const daysPerYear = Number(record?.rulesSet?.daysPerYear || 0);

  const daysPerMonth = Number(record?.rulesSet?.daysPerMonth || 0);

  // As requested
  if (entitlementType === 'as-requested') {
    return 'As Requested';
  }

  // Fixed
  if (entitlementType === 'fixed') {
    if (daysPerMonth > 0) {
      return `${daysPerMonth} days/mo`;
    }

    if (daysPerYear > 0) {
      return `${daysPerYear} days/yr`;
    }

    return '0 days';
  }

  // Accrual
  if (entitlementType === 'accrual') {
    const values = [];

    if (daysPerYear > 0) {
      values.push(`${daysPerYear} days/yr`);
    }

    if (daysPerMonth > 0) {
      values.push(`${daysPerMonth} days/mo`);
    }

    if (values.length) {
      return values.join(' · ');
    }

    return '0 days';
  }

  // Fallback
  if (daysPerYear > 0 && daysPerMonth > 0) {
    return `${daysPerYear} days/yr · ${daysPerMonth} days/mo`;
  }

  if (daysPerYear > 0) {
    return `${daysPerYear} days/yr`;
  }

  if (daysPerMonth > 0) {
    return `${daysPerMonth} days/mo`;
  }

  return 'As Requested';
};

// =====================================================
// FORMAT ENTITLEMENT TYPE
// =====================================================

const formatEntitlementType = (value) => {
  if (!value) return '-';

  const map = {
    accrual: 'Accrual',
    fixed: 'Fixed',
    'as-requested': 'As Requested',
  };

  return map[value.toLowerCase()] || value;
};

// =====================================================
// FORMAT GRANT CONDITION
// =====================================================

const formatGrantCondition = (value) => {
  if (!value) return 'Immediate';

  const map = {
    immediate: 'Immediate',
    'after-probation': 'After Probation',
    'after-one-year': 'After 1 Year',
  };

  return map[value.toLowerCase()] || value;
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// =====================================================
// GET USER NAME
// =====================================================

const getUserName = (user) => {
  if (!user || !Object.keys(user).length) {
    return '-';
  }

  const fullName = [user?.username].filter(Boolean).join(' ').trim();

  return fullName || user?.username || user?.staffCode || '-';
};

// =====================================================
// GET APPLICABLE DATA
// =====================================================

const getApplicableItems = (record) => {
  const departments = Array.isArray(record?.departmentData)
    ? record.departmentData.map((item) => item?.departments).filter(Boolean)
    : [];

  const employees = Array.isArray(record?.employeeData)
    ? record.employeeData
      .map((item) => {
        if (item?.nameLatin) {
          return item.nameLatin;
        }

        if (item?.name) {
          return item.name;
        }

        if (item?.code) {
          return item.code;
        }

        return null;
      })
      .filter(Boolean)
    : [];

  return [...departments, ...employees];
};

// =====================================================
// PAGE
// =====================================================

const MainLeaveTypePage = () => {
  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const { username, access_token } = useContext(AuthContext);

  // =====================================================
  // FORM
  // =====================================================

  const [formAdd] = Form.useForm();

  const [formUpdate] = Form.useForm();

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [openAdd, setOpenAdd] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  const [openApply, setOpenApply] = useState(false);

  const [openView, setOpenView] = useState(false);

  const [applyLeaveTypeId, setApplyLeaveTypeId] = useState(null);

  const [copyData, setCopyData] = useState(null);

  // =====================================================
  // SEARCH / PAGINATION
  // =====================================================

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const searchTimerRef = useRef(null);

  // =====================================================
  // STORE
  // =====================================================

  const list = useLeaveTypeStore((state) => state.list);

  const loading = useLeaveTypeStore((state) => state.loading);

  const buttonLoading = useLeaveTypeStore((state) => state.buttonLoading);

  const selected = useLeaveTypeStore((state) => state.selected);

  const selectedRowKeys = useLeaveTypeStore((state) => state.selectedRowKeys);

  const fetchLeaveTypes = useLeaveTypeStore((state) => state.fetchLeaveTypes);

  const fetchLeaveTypeById = useLeaveTypeStore((state) => state.fetchLeaveTypeById);

  const removeLeaveType = useLeaveTypeStore((state) => state.removeLeaveType);

  const setSelected = useLeaveTypeStore((state) => state.setSelected);

  const clearSelection = useLeaveTypeStore((state) => state.clearSelection);

  const selectedId = getRowId(selected);

  // =====================================================
  // MESSAGE
  // =====================================================

  const [modal, modalContextHolder] = Modal.useModal();

  const [messageApi, messageContextHolder] = message.useMessage();

  // =====================================================
  // MESSAGE HELPERS
  // =====================================================

  const success = useCallback(
    (content) => {
      messageApi.success({
        content,
      });
    },
    [messageApi]
  );

  const warning = useCallback(
    (content) => {
      messageApi.warning({
        content,
      });
    },
    [messageApi]
  );

  // =====================================================
  // FETCH LIST
  // =====================================================

  const fetchList = useCallback(
    async (searchText = '') => {
      if (!access_token) return;

      try {
        await fetchLeaveTypes({
          access_token,
          search: searchText || '',
        });
      } catch (error) {
        warning(error?.message || 'Cannot get leave types');
      }
    },
    [access_token, fetchLeaveTypes, warning]
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchList('');
  }, [fetchList]);

  // =====================================================
  // CLEAR SEARCH TIMER
  // =====================================================

  useEffect(() => {
    return () => {
      clearTimeout(searchTimerRef.current);
    };
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    setCurrentPage(1);

    clearSelection();

    clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(() => {
      fetchList(value);
    }, 350);
  };

  // =====================================================
  // TABLE DATA
  // =====================================================

  const tableData = useMemo(() => {
    if (!Array.isArray(list)) {
      return [];
    }

    return list;
  }, [list]);

  // =====================================================
  // PAGINATION DATA
  // =====================================================

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return tableData.slice(start, start + pageSize);
  }, [tableData, currentPage]);

  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = useMemo(
    () => [
      // -------------------------------------------------
      // NO
      // -------------------------------------------------

      {
        title: 'No',

        width: 50,

        align: 'center',

        render: (_, __, index) => {
          return (currentPage - 1) * pageSize + index + 1;
        },
      },

      // -------------------------------------------------
      // LEAVE TYPE NAME
      // -------------------------------------------------

      {
        title: 'Leave Type Name',

        width: 250,

        render: (_, record) => (
          <div className="py-1">
            <div className="font-semibold text-gray-800">{record?.leave_type_name_kh || '-'}</div>

            <div className="text-sm text-gray-600">{record?.leave_type_name || '-'}</div>
          </div>
        ),
      },

      // -------------------------------------------------
      // ENTITLEMENT
      // -------------------------------------------------

      {
        title: 'Entitlement(សិទ្ធិឈប់សម្រាក)',

        width: 200,

        render: (_, record) => <span className="text-gray-700">{getEntitlementText(record)}</span>,
      },

      // -------------------------------------------------
      // LEAVE TYPE
      // -------------------------------------------------

      {
        title: 'Leave Type',

        dataIndex: 'leave_type',

        width: 130,

        render: (value) => <span className="text-gray-700">{value || '-'}</span>,
      },

      // -------------------------------------------------
      // GRANT CONDITION
      // -------------------------------------------------
      {
        title: 'Grant Condition',

        width: 150,

        render: (_, record) => {
          const condition = record?.rulesSet?.grantCondition?.toLowerCase();

          const colorMap = {
            'after-one-year': {
              background: '#F3E8FF',
              color: '#8200DB',
            },

            'after-probation': {
              background: '#DBEAFE',
              color: '#1447E6',
            },

            immediate: {
              background: '#DCFCE7',
              color: '#008236',
            },
          };

          const colors = colorMap[condition] || colorMap.immediate;

          return (
            <Tag
              style={{
                borderRadius: 20,
                padding: '3px 12px',
                border: 'none',
                background: colors.background,
                color: colors.color,
                fontSize: 13,
              }}
            >
              {formatGrantCondition(record?.rulesSet?.grantCondition)}
            </Tag>
          );
        },
      },
      // -------------------------------------------------
      // DESCRIPTION
      // -------------------------------------------------

      {
        title: 'Description',

        width: 160,

        render: (_, record) => <span className="text-gray-700">{record?.description || '-'}</span>,
      },

      // -------------------------------------------------
      // PUBLISH DATE
      // -------------------------------------------------

      {
        title: 'Publish date',

        width: 150,

        render: (_, record) => {
          const isActive = record?.status?.toLowerCase() === 'active';

          return (
            <div>
              <Tag
                style={{
                  background: isActive ? '#dcfce7' : '#e5e7eb',

                  color: isActive ? '#15803d' : '#4b5563',

                  border: 'none',

                  borderRadius: 20,

                  padding: '2px 12px',

                  fontSize: 13,
                }}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Tag>

              <div className="mt-1 text-sm text-gray-600">{formatDate(record?.publicDate)}</div>
            </div>
          );
        },
      },

      // -------------------------------------------------
      // APPLICABLE
      // -------------------------------------------------

      {
        title: 'Applicable',

        width: 250,

        render: (_, record) => {
          const applicable = getApplicableItems(record);

          if (!applicable.length) {
            return <span className="text-gray-400">-</span>;
          }

          const visibleItems = applicable.slice(0, 2);

          const remaining = applicable.length - 2;

          return (
            <div className="flex flex-wrap gap-1">
              {visibleItems.map((item, index) => (
                <Tag
                  key={`${item}-${index}`}
                  style={{
                    margin: 0,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 5,
                    color: '#374151',
                    fontSize: 13,
                    padding: '3px 8px',
                  }}
                >
                  {item}
                </Tag>
              ))}

              {remaining > 0 && (
                <Tag
                  style={{
                    margin: 0,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 5,
                    color: '#374151',
                    fontSize: 13,
                    padding: '3px 8px',
                  }}
                >
                  +{remaining}
                </Tag>
              )}
            </div>
          );
        },
      },

      // -------------------------------------------------
      // CREATED
      // -------------------------------------------------

      {
        title: 'Created',

        width: 150,

        render: (_, record) => (
          <div>
            <div className="text-gray-700">{getUserName(record?.createdByDoc)}</div>

            <div className="mt-1 text-sm text-gray-500">{formatDate(record?.createdAt)}</div>
          </div>
        ),
      },

      // -------------------------------------------------
      // UPDATED
      // -------------------------------------------------

      {
        title: 'Updated',

        width: 150,

        render: (_, record) => (
          <div>
            <div className="text-gray-700">{getUserName(record?.updatedByDoc)}</div>

            <div className="mt-1 text-sm text-gray-500">{formatDate(record?.updatedAt)}</div>
          </div>
        ),
      },
    ],
    [currentPage]
  );

  // =====================================================
  // ROW SELECTION
  // =====================================================

  const rowSelection = {
    type: 'radio',

    selectedRowKeys,

    onChange: (_, selectedRows) => {
      setSelected(selectedRows?.[0] || null);
    },
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleRemove = useCallback(() => {
    if (!selectedId) {
      warning('Please select leave type first');
      return;
    }

    modal.confirm({
      title: 'Confirm',
      content: 'Confirm to delete this leave type?',
      okText: 'Delete',
      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          await removeLeaveType({
            access_token,
            id: selectedId,
          });
          clearSelection();
          success('Remove success');
        } catch (error) {
          const message = error?.response?.data?.message || error?.message || 'Remove fail';
          warning(message);
        }
      },
    });
  }, [selectedId, access_token, removeLeaveType, modal, success, warning, clearSelection]);

  // =====================================================
  // CONTENT HEADER
  // =====================================================

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={collapsed}

          editBtn={!!selectedId}

          showEditBtn

          onEditBtnClick={() => {
            if (selectedId) {
              setOpenUpdate(true);
            }
          }}

          showCustomBtn

          customButtons={[
            // ===========================================
            // VIEW
            // ===========================================

            {
              text: 'View',

              enabled: !!selectedId,

              icon: <EditOutlined />,

              onClick: () => {
                if (!selected) {
                  warning('Please select leave type first');

                  return;
                }

                setOpenView(true);
              },
            },

            // ===========================================
            // COPY
            // ===========================================

            {
              text: 'Copy & Create New',

              enabled: !!selectedId,

              icon: <EditOutlined />,

              onClick: async () => {
                if (!selectedId) {
                  return;
                }

                try {
                  const detail = await fetchLeaveTypeById({
                    access_token,
                    id: selectedId,
                  });

                  if (detail) {
                    setCopyData(detail);

                    setOpenAdd(true);
                  }
                } catch (error) {
                  warning(error?.message || 'Cannot get leave type detail');
                }
              },
            },
          ]}

          deleteBtn={!!selectedId}

          showDeleteBtn

          onDeleteBtnClick={handleRemove}
        />

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },

            {
              title: 'Leave Type',
            },
          ]}
        />
      </div>
    );
  }, [setContent, collapsed, navigate, selectedId, selected, handleRemove, fetchLeaveTypeById, access_token, warning]);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {messageContextHolder}

      {modalContextHolder}

      <Card
        className="leave-type-card"

        title={<div className="text-base font-semibold">LEAVE TYPE</div>}

        extra={
          <>
            {/* =========================================
                APPLY
            ========================================= */}

            <Button
              type="primary"
              className="mx-2"
              style={{
                background: '#1677ff',
              }}
              onClick={() => {
                if (!selectedId) {
                  warning('Please select leave type first');

                  return;
                }

                setApplyLeaveTypeId(selectedId);

                setOpenApply(true);
              }}
            >
              Apply
            </Button>

            {/* =========================================
                ADD
            ========================================= */}

            <Button
              type="primary"
              style={{
                background: '#1677ff',
              }}
              onClick={() => {
                clearSelection();

                setCopyData(null);

                setOpenAdd(true);
              }}
            >
              <UserAddOutlined />
              &nbsp; Add Leave Type
            </Button>
          </>
        }
      >
        {/* =============================================
            SEARCH
        ============================================= */}

        <Row gutter={16} className="mb-4">
          <Col xs={24} sm={24} md={12} lg={10}>
            <Input
              value={search}
              allowClear
              placeholder="Search by leave type name"
              prefix={
                <SearchOutlined
                  style={{
                    color: '#1677ff',
                    fontSize: 16,
                  }}
                />
              }
              onChange={handleSearchChange}
            />
          </Col>
        </Row>

        {/* =============================================
            ADD MODAL
        ============================================= */}

        <AddLeaveType
          username={username}
          access_token={access_token}
          form={formAdd}
          open_add={openAdd}
          setOpenAdd={setOpenAdd}
          btn_loading={buttonLoading}
          copyData={copyData}
          setCopyData={setCopyData}
        />

        {/* =============================================
            UPDATE MODAL
        ============================================= */}

        <UpdateLeaveType
          propData={selected}
          access_token={access_token}
          open_update={openUpdate}
          setOpenUpdate={setOpenUpdate}
          username={username}
          btn_loading={buttonLoading}
          form={formUpdate}
        />

        {/* =============================================
            APPLY MODAL
        ============================================= */}

        <ApplyLeaveTypeModal
          open={openApply}
          setOpen={(value) => {
            setOpenApply(value);

            if (!value) {
              setApplyLeaveTypeId(null);
            }
          }}
          loading={buttonLoading}
          access_token={access_token}
          leaveTypeId={applyLeaveTypeId}
        />

        {/* =============================================
            VIEW MODAL

            IMPORTANT:
            No API call here.
            Selected row is passed directly.
        ============================================= */}

        <ViewLeaveTypeModal open={openView} setOpen={setOpenView} leaveTypeData={selected} />

        {/* =============================================
            TABLE
        ============================================= */}

        <Table
          rowKey={getRowId}

          rowSelection={rowSelection}

          columns={columns}

          dataSource={pagedData}

          loading={loading}

          bordered

          size="small"

          scroll={{
            x: 1800,
          }}

          pagination={{
            current: currentPage,

            pageSize,

            total: tableData.length,

            showSizeChanger: false,

            // showTotal: (total) => `Total ${total} items`,

            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
        />
      </Card>
    </>
  );
};

export default MainLeaveTypePage;
