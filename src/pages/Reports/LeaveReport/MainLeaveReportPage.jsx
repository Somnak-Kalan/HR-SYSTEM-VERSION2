
// =====================================================
// MAIN LEAVE REPORT PAGE
// =====================================================
const MOCK_LEAVE_DATA = [
  {
    _id: 'mock-001',
    employeeId: 'VTS-001',
    fullName: 'ស៊ន គីម',
    department: 'Accounting',
    position: 'Account-LCL',
    leaveType: 'Annual Leave',
    from: '2026-09-07',
    to: '2026-09-08',
    day: 1.5,
    reason: 'Busy',
    requestedBy: 'គីម សុវណ្ណ',
    requestedDate: '2026-09-05',
    status: 'approved',
  },
  {
    _id: 'mock-002',
    employeeId: 'VTS-002',
    fullName: 'វ៉ន សុវណ្ណ',
    department: 'Accounting',
    position: 'Account-LCL',
    leaveType: 'Day Off',
    from: '2026-09-10',
    to: '2026-09-10',
    day: 1,
    reason: 'Day-off',
    requestedBy: 'គីម សុវណ្ណ',
    requestedDate: '2026-09-08',
    status: 'pending',
  },
  {
    _id: 'mock-003',
    employeeId: 'VTS-036',
    fullName: 'ម៉េង ចាន់ធី',
    department: 'Customer services',
    position: 'Cashier',
    leaveType: 'Unpaid',
    from: '2026-09-14',
    to: '2026-09-14',
    day: 0.5,
    reason: 'Not Well',
    requestedBy: 'ម៉េង ចាន់ធី',
    requestedDate: '2026-09-13',
    status: 'approved',
  },
  {
    _id: 'mock-004',
    employeeId: 'VTS-036',
    fullName: 'ម៉េង ចាន់ធី',
    department: 'Customer services',
    position: 'Cashier',
    leaveType: 'Absent',
    from: '2026-09-15',
    to: '2026-09-15',
    day: 0.5,
    reason: '',
    requestedBy: 'ម៉េង ចាន់ធី',
    requestedDate: '2026-09-15',
    status: 'rejected',
  },
  {
    _id: 'mock-005',
    employeeId: 'VTS-010',
    fullName: 'ឡៅ ចាន់ភិរុណ',
    department: 'Information Technology',
    position: 'Senior Developer',
    leaveType: 'Annual Leave',
    from: '2026-09-17',
    to: '2026-09-18',
    day: 2,
    reason: 'Personal leave',
    requestedBy: 'ឡៅ ចាន់ភិរុណ',
    requestedDate: '2026-09-16',
    status: 'pending',
  },
];

// =====================================================
// TEMPORARY FAKE DATA MODE
// true  = Edit uses the selected MOCK_LEAVE_DATA row directly.
// false = Edit loads detail from API with fetchById.
// =====================================================
const USE_FAKE_DATA = true;

import {
  useOutletContext,
  useNavigate,
} from 'react-router-dom';

import {
  Card,
  Breadcrumb,
  message,
  Button,
  Modal,
} from 'antd';

import {
  HomeOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import dayjs from 'dayjs';

import GroupBtn from 'components/GroupBtn';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';

import { useLeaveReportStore } from '../../../stores/Reports/leaveReport.store';

import LeaveReportTabs from './components/LeaveReportTabs';
import LeaveReportFilters from './components/LeaveReportFilters';
import LeaveReportTable from './components/LeaveReportTable';

import LeaveRequestModal from './modal/LeaveRequestModal';
import './LeaveType.scss'
// =====================================================
// HELPERS
// =====================================================

const getStatusRequest = (session) => {
  const value = String(session || '')
    .trim()
    .toLowerCase();

  if (value === 'morning') {
    return 'morning';
  }

  if (value === 'afternoon') {
    return 'afternoon';
  }

  return 'full';
};

// =====================================================
// CONVERT MODAL ROWS TO API PERMISSION DATE
// =====================================================

const buildPermissionDates = (rows = []) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const result = new Map();

  rows.forEach((row) => {
    const startValue =
      row?.date ||
      row?.from;

    const endValue =
      row?.date ||
      row?.to ||
      row?.from;

    if (!startValue || !endValue) {
      return;
    }

    let startDate = dayjs(startValue).startOf('day');

    const endDate = dayjs(endValue).startOf('day');

    if (
      !startDate.isValid() ||
      !endDate.isValid() ||
      endDate.isBefore(startDate)
    ) {
      return;
    }

    while (
      startDate.isBefore(endDate, 'day') ||
      startDate.isSame(endDate, 'day')
    ) {
      const date = startDate.format('YYYY-MM-DD');

      result.set(date, {
        date,

        day: startDate.format('dddd'),

        status_request: getStatusRequest(
          row?.session
        ),
      });

      startDate = startDate.add(1, 'day');
    }
  });

  return Array.from(result.values());
};

// =====================================================
// MAIN LEAVE REPORT PAGE
// =====================================================

const MainLeaveReportPage = () => {
  // =====================================================
  // CONTEXT
  // =====================================================

  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const {
    username,
    access_token,
  } = useContext(AuthContext);

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [open, setOpen] = useState(false);

  const [openUpdate, setOpenUpdate] =
    useState(false);

  const [
    selectedRow,
    setSelectedRow,
  ] = useState(undefined);

  // =====================================================
  // LEAVE REPORT UI STATE
  // =====================================================

  const [activeTab, setActiveTab] =
    useState('leave');

  const [filters, setFilters] = useState({
    fullMonth: true,

    startDate: dayjs().startOf('month'),

    endDate: dayjs().endOf('month'),

    employee: '',
  });

  // =====================================================
  // PREVENT DUPLICATE REFRESH
  // =====================================================

  const afterSaveRequestRef =
    useRef(false);

  // =====================================================
  // STORE
  // =====================================================

  const list =
    useLeaveReportStore(
      (state) => state.list
    );

  const current =
    useLeaveReportStore(
      (state) => state.current
    );

  const total =
    useLeaveReportStore(
      (state) => state.total
    );

  const page =
    useLeaveReportStore(
      (state) => state.page
    );

  const size =
    useLeaveReportStore(
      (state) => state.size
    );

  const loadingList =
    useLeaveReportStore(
      (state) => state.loadingList
    );

  const setAuth =
    useLeaveReportStore(
      (state) => state.setAuth
    );

  const fetchList =
    useLeaveReportStore(
      (state) => state.fetchList
    );

  const fetchById =
    useLeaveReportStore(
      (state) => state.fetchById
    );

  const createLeave =
    useLeaveReportStore(
      (state) => state.createLeave
    );

  const updateLeave =
    useLeaveReportStore(
      (state) => state.updateLeave
    );

  const removeLeave =
    useLeaveReportStore(
      (state) => state.removeLeave
    );

  const clearCurrent =
    useLeaveReportStore(
      (state) => state.clearCurrent
    );

  // =====================================================
  // NORMALIZE LIST
  // =====================================================

  const leaveData = useMemo(() => {
    if (!Array.isArray(list)) {
      return [];
    }

    return list;
  }, [list]);

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredData = useMemo(() => {
    let result = [...MOCK_LEAVE_DATA];

    // =================================================
    // EMPLOYEE SEARCH
    // =================================================

    const employeeKeyword = String(
      filters?.employee || ''
    )
      .trim()
      .toLowerCase();

    if (employeeKeyword) {
      result = result.filter((item) => {
        const employeeId = String(
          item?.employeeId ||
          item?.employee_id ||
          ''
        ).toLowerCase();

        const fullName = String(
          item?.fullName ||
          item?.full_name ||
          item?.employeeName ||
          item?.employee_name ||
          ''
        ).toLowerCase();

        return (
          employeeId.includes(employeeKeyword) ||
          fullName.includes(employeeKeyword)
        );
      });
    }

    // =================================================
    // PENDING
    // =================================================

    if (activeTab === 'pending') {
      result = result.filter(
        (item) =>
          item?.status === 'pending'
      );
    }

    // =================================================
    // WAITING HR
    // =================================================

    if (activeTab === 'hr') {
      result = result.filter(
        (item) =>
          item?.status === 'waiting_hr'
      );
    }

    return result;
  }, [
    leaveData,
    filters?.employee,
    activeTab,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount = useMemo(() => {
    return leaveData.filter(
      (item) =>
        item?.status === 'pending'
    ).length;
  }, [leaveData]);

  const hrCount = useMemo(() => {
    return leaveData.filter(
      (item) =>
        item?.status === 'waiting_hr'
    ).length;
  }, [leaveData]);

  // =====================================================
  // MESSAGE
  // =====================================================

  const success = useCallback(
    (content) => {
      message.success({
        content,
      });
    },
    []
  );

  const warning = useCallback(
    (content) => {
      message.warning({
        content,
      });
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!access_token) {
      return;
    }

    setAuth({
      access_token,
      username,
    });

    fetchList({
      access_token,

      search: '',

      startDate: dayjs()
        .startOf('month')
        .format('YYYY-MM-DD'),

      endDate: dayjs()
        .endOf('month')
        .format('YYYY-MM-DD'),

      page: 1,

      size: 10,
    });
  }, [
    access_token,
    username,
    setAuth,
    fetchList,
  ]);

  // =====================================================
  // TAB CHANGE
  // =====================================================

  const handleTabChange = useCallback(
    (value) => {
      setSelectedRow(undefined);

      setActiveTab(value);
    },
    []
  );

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = useCallback(
    (nextFilters) => {
      setSelectedRow(undefined);

      setFilters(nextFilters);
    },
    []
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = useCallback(
    async (values) => {
      setSelectedRow(undefined);

      const nextFilters = {
        ...filters,
        ...values,
      };

      setFilters(nextFilters);

      try {
        await fetchList({
          access_token,

          search:
            values?.search ||
            values?.employee ||
            '',

          startDate:
            values?.startDate
              ? dayjs(
                values.startDate
              ).format('YYYY-MM-DD')
              : undefined,

          endDate:
            values?.endDate
              ? dayjs(
                values.endDate
              ).format('YYYY-MM-DD')
              : undefined,

          page: 1,

          size,
        });
      } catch (error) {
        console.error(
          'Search leave report error:',
          error
        );

        warning(
          error?.message ||
          'Cannot search leave report'
        );
      }
    },
    [
      access_token,
      fetchList,
      filters,
      size,
      warning,
    ]
  );

  // =====================================================
  // PAGINATION
  // =====================================================

  const handlePageChange = useCallback(
    async (
      nextPage,
      nextSize
    ) => {
      setSelectedRow(undefined);

      try {
        await fetchList({
          access_token,

          page: nextPage,

          size: nextSize,
        });
      } catch (error) {
        console.error(
          'Pagination error:',
          error
        );
      }
    },
    [
      access_token,
      fetchList,
    ]
  );

  // =====================================================
  // ROW SELECT
  // =====================================================

  const handleRowSelect = useCallback(
    (record) => {
      setSelectedRow(record);
    },
    []
  );

  // =====================================================
  // AFTER CREATE / UPDATE
  // =====================================================

  const handleAfterSave = useCallback(
    async () => {
      if (
        afterSaveRequestRef.current
      ) {
        return;
      }

      afterSaveRequestRef.current =
        true;

      try {
        setSelectedRow(undefined);

        clearCurrent();

        await fetchList({
          access_token,

          force: true,
        });
      } finally {
        afterSaveRequestRef.current =
          false;
      }
    },
    [
      access_token,
      clearCurrent,
      fetchList,
    ]
  );

  // =====================================================
  // OPEN CREATE
  // =====================================================

  const handleOpenCreate = useCallback(
    () => {
      clearCurrent();

      setSelectedRow(undefined);

      setOpen(true);
    },
    [clearCurrent]
  );

  // =====================================================
  // CLOSE CREATE
  // =====================================================

  const handleCloseCreate = useCallback(
    () => {
      setOpen(false);

      clearCurrent();
    },
    [clearCurrent]
  );

  // =====================================================
  // CREATE SUBMIT
  // =====================================================

  const handleCreateSubmit = useCallback(
    async (values) => {
      try {
        if (!values?.employeeId) {
          warning(
            'Employee is required'
          );

          return;
        }

        if (!values?.leaveType) {
          warning(
            'Leave type is required'
          );

          return;
        }

        const permissionDate =
          buildPermissionDates(
            values?.rows
          );

        if (!permissionDate.length) {
          warning(
            'Please select leave date'
          );

          return;
        }

        const payload = {
          employeeId:
            values.employeeId,

          permissionDate,

          leaveType:
            values.leaveType,

          reason:
            values.reason || '',

          status: 'approved',
        };

        console.log(
          'CREATE LEAVE PAYLOAD:',
          payload
        );

        await createLeave(
          payload
        );

        success(
          'Add leave request success'
        );

        setOpen(false);

        await handleAfterSave();
      } catch (error) {
        console.error(
          'Create leave request error:',
          error
        );

        warning(
          error?.message ||
          'Add leave request failed'
        );
      }
    },
    [
      createLeave,
      success,
      warning,
      handleAfterSave,
    ]
  );

  // =====================================================
  // OPEN UPDATE
  // =====================================================
  const handleOpenUpdate = useCallback(
    async (record) => {
      const targetRow =
        record?._id ||
          record?.id
          ? record
          : selectedRow;

      const id =
        targetRow?._id ||
        targetRow?.id;

      if (!id) {
        warning(
          'Please select a leave request first'
        );

        return;
      }

      // =================================================
      // FAKE DATA MODE
      // =================================================
      // Do not request detail from API.
      // Use the selected row from MOCK_LEAVE_DATA directly.
      if (USE_FAKE_DATA) {
        clearCurrent();

        setSelectedRow(
          targetRow
        );

        setOpenUpdate(true);

        return;
      }

      try {
        setSelectedRow(
          targetRow
        );

        clearCurrent();

        // API REQUEST WHEN CLICK EDIT
        await fetchById(id);

        setOpenUpdate(true);
      } catch (error) {
        console.error(
          'Get leave request detail error:',
          error
        );

        warning(
          error?.message ||
          'Cannot get leave request detail'
        );
      }
    },
    [
      selectedRow,
      fetchById,
      clearCurrent,
      warning,
    ]
  );
  // const handleOpenUpdate = useCallback(
  //   async (record) => {
  //     const targetRow =
  //       record?._id ||
  //         record?.id
  //         ? record
  //         : selectedRow;

  //     const id =
  //       targetRow?._id ||
  //       targetRow?.id;

  //     if (!id) {
  //       warning(
  //         'Please select a leave request first'
  //       );

  //       return;
  //     }

  //     try {
  //       setSelectedRow(
  //         targetRow
  //       );

  //       clearCurrent();

  //       await fetchById(id);

  //       setOpenUpdate(true);
  //     } catch (error) {
  //       console.error(
  //         'Get leave request detail error:',
  //         error
  //       );

  //       warning(
  //         error?.message ||
  //         'Cannot get leave request detail'
  //       );
  //     }
  //   },
  //   [
  //     selectedRow,
  //     fetchById,
  //     clearCurrent,
  //     warning,
  //   ]
  // );

  // =====================================================
  // CLOSE UPDATE
  // =====================================================

  const handleCloseUpdate = useCallback(
    () => {
      setOpenUpdate(false);

      clearCurrent();
    },
    [clearCurrent]
  );

  // =====================================================
  // UPDATE SUBMIT
  // =====================================================

  const handleUpdateSubmit = useCallback(
    async (values) => {
      try {
        const id =
          current?._id ||
          current?.id ||
          selectedRow?._id ||
          selectedRow?.id;

        if (!id) {
          warning(
            'Leave request ID is missing'
          );

          return;
        }

        if (!values?.leaveType) {
          warning(
            'Leave type is required'
          );

          return;
        }

        const permissionDate =
          buildPermissionDates(
            values?.rows
          );

        if (!permissionDate.length) {
          warning(
            'Please select leave date'
          );

          return;
        }

        const payload = {
          id,

          leaveType:
            values.leaveType,

          permissionDate,

          reason:
            values.reason || '',

          status:
            current?.status ||
            selectedRow?.status ||
            'pending',
        };

        console.log(
          'UPDATE LEAVE PAYLOAD:',
          payload
        );

        await updateLeave(
          payload
        );

        success(
          'Update leave request success'
        );

        setOpenUpdate(false);

        await handleAfterSave();
      } catch (error) {
        console.error(
          'Update leave request error:',
          error
        );

        warning(
          error?.message ||
          'Update leave request failed'
        );
      }
    },
    [
      current,
      selectedRow,
      updateLeave,
      success,
      warning,
      handleAfterSave,
    ]
  );

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = useCallback(
    (record) => {
      const targetRow =
        record?._id ||
          record?.id
          ? record
          : selectedRow;

      const id =
        targetRow?._id ||
        targetRow?.id;

      if (!id) {
        warning(
          'Please select a leave request first'
        );

        return;
      }

      Modal.confirm({
        title: 'Confirm',

        content:
          'Are you sure you want to delete this leave request?',

        okText: 'Delete',

        cancelText: 'Cancel',

        okButtonProps: {
          danger: true,
        },

        className:
          'custom-message-modal-confirm',

        onOk: async () => {
          try {
            await removeLeave(id);

            setSelectedRow(
              undefined
            );

            clearCurrent();

            await fetchList({
              access_token,

              force: true,
            });

            success(
              'Remove success'
            );
          } catch (error) {
            console.error(
              'Remove leave error:',
              error
            );

            warning(
              error?.message ||
              'Remove fail'
            );
          }
        },
      });
    },
    [
      selectedRow,
      access_token,
      removeLeave,
      clearCurrent,
      fetchList,
      success,
      warning,
    ]
  );

  // =====================================================
  // HEADER / BREADCRUMB
  // =====================================================

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={
            collapsed
          }
          editBtn={
            !!selectedRow
          }
          showEditBtn
          onEditBtnClick={
            handleOpenUpdate
          }
          deleteBtn={
            !!selectedRow
          }
          showDeleteBtn
          onDeleteBtnClick={
            handleDelete
          }
        />

        <Breadcrumb
          items={[
            {
              title: (
                <HomeOutlined
                  onClick={() =>
                    navigate('/')
                  }
                  className="cursor-pointer"
                />
              ),
            },

            {
              title:
                'leave report',
            },
          ]}
        />
      </div>
    );
  }, [
    setContent,
    collapsed,
    selectedRow,
    navigate,
    handleOpenUpdate,
    handleDelete,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card
      title="LEAVE REPORT"
      styles={{
        body: {
          padding: '3px',
        },
      }}
      extra={
        <Button
          type="primary"
          onClick={
            handleOpenCreate
          }
          style={{
            background:
              '#1677ff',
          }}
          className="cursor-pointer text-white"
        >
          <UserAddOutlined />

          Add Request Leave
        </Button>
      }
    >
      {/* =================================================
          TABS
      ================================================= */}

      <LeaveReportTabs
        activeTab={
          activeTab
        }
        onChange={
          handleTabChange
        }
        pendingCount={
          pendingCount
        }
        hrCount={
          hrCount
        }
      />

      {/* =================================================
          FILTERS
      ================================================= */}

      <LeaveReportFilters
        filters={
          filters
        }
        setFilters={
          handleFilterChange
        }
        onSearch={
          handleSearch
        }
      />

      {/* =================================================
          TABLE
      ================================================= */}

      <LeaveReportTable
        data={
          filteredData
        }
        loading={
          loadingList
        }
        selectedRow={
          selectedRow
        }
        onSelectRow={
          handleRowSelect
        }
        onRowClick={
          handleRowSelect
        }
        onEdit={
          handleOpenUpdate
        }
        onDelete={
          handleDelete
        }
        currentPage={
          page
        }
        pageSize={
          size
        }
        total={
          total
        }
        onPageChange={
          handlePageChange
        }
      />

      {/* =================================================
          CREATE REQUEST
      ================================================= */}

      <LeaveRequestModal
        open={
          open
        }
        mode="create"
        request={null}
        onClose={
          handleCloseCreate
        }
        onSubmit={
          handleCreateSubmit
        }
      />

      {/* =================================================
          UPDATE REQUEST
      ================================================= */}

      <LeaveRequestModal
        open={
          openUpdate
        }
        mode="edit"
        request={
          USE_FAKE_DATA
            ? selectedRow
            : current ||
            selectedRow
        }
        onClose={
          handleCloseUpdate
        }
        onSubmit={
          handleUpdateSubmit
        }
      />
    </Card>
  );
};

export default MainLeaveReportPage;