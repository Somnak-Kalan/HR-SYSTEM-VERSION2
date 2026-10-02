import { create } from 'zustand';
import dayjs from 'dayjs';

import LeaveReportServices from 'services/reports/leaveReport';

const DEFAULT_FILTERS = {
  search: '',
  startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
  endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
};

const pendingListRequests = new Map();

let lastListRequestKey = '';
let lastListRequestTime = 0;

const LIST_REQUEST_DEDUPE_TIME = 1000;

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const calculateTotalDays = (permissionDate) => {
  if (!Array.isArray(permissionDate)) {
    return 0;
  }

  return permissionDate.reduce((total, item) => {
    if (item?.status_request === 'morning' || item?.status_request === 'afternoon') {
      return total + 0.5;
    }

    return total + 1;
  }, 0);
};

const getEmployeeOptionId = (employee) => {
  return employee?._id || employee?.id || employee?.employeeObjectId || employee?.employee_id || '';
};

const getEmployeeCode = (employee) => {
  return employee?.employeeId || employee?.employee_id || employee?.code || '';
};

export const useLeaveReportStore = create((set, get) => ({
  access_token: '',
  username: '',

  list: [],
  total: 0,
  page: 1,
  size: 10,

  filters: {
    ...DEFAULT_FILTERS,
  },

  loadingList: false,
  listError: '',

  current: null,
  currentLoading: false,

  employeeInfo: null,
  employeeInfoLoading: false,
  employeeOptions: [],

  buttonLoading: false,

  date_leave_request: [],
  permission_days: 0,

  setAuth: ({ access_token, username }) => {
    set({
      access_token: access_token || '',
      username: username || '',
    });
  },

  clearCurrent: () => {
    set({
      current: null,
      employeeInfo: null,
      employeeOptions: [],
    });
  },

  clearEmployeeContext: () => {
    set({
      employeeInfo: null,
      employeeOptions: [],
      employeeInfoLoading: false,
      date_leave_request: [],
      permission_days: 0,
    });
  },

  resetEmployeeContext: () => {
    get().clearEmployeeContext();
  },

  fetchList: async (params = {}) => {
    const { access_token, filters, page, size } = get();

    const accessToken = params.access_token || access_token;

    if (!accessToken) {
      return false;
    }

    const force = params.force === true;

    const nextFilters = {
      search: params.search !== undefined ? String(params.search || '').trim() : filters.search,

      startDate: params.startDate !== undefined ? params.startDate : filters.startDate,

      endDate: params.endDate !== undefined ? params.endDate : filters.endDate,
    };

    const nextPage = params.page !== undefined ? Number(params.page) : page;

    const nextSize = params.size !== undefined ? Number(params.size) : size;

    const doc = {
      search: nextFilters.search,
      startDate: nextFilters.startDate || DEFAULT_FILTERS.startDate,
      endDate: nextFilters.endDate || DEFAULT_FILTERS.endDate,
      page: nextPage || 1,
      size: nextSize || 10,
    };

    const requestKey = JSON.stringify({
      accessToken,
      search: doc.search,
      startDate: doc.startDate,
      endDate: doc.endDate,
      page: doc.page,
      size: doc.size,
    });

    const pendingRequest = pendingListRequests.get(requestKey);

    if (pendingRequest) {
      return pendingRequest;
    }

    const now = Date.now();

    if (!force && lastListRequestKey === requestKey && now - lastListRequestTime < LIST_REQUEST_DEDUPE_TIME) {
      return true;
    }

    set({
      loadingList: true,
      listError: '',
      filters: nextFilters,
      page: doc.page,
      size: doc.size,
    });

    const request = (async () => {
      try {
        const response = await LeaveReportServices.Get_Leave_List({
          access_token: accessToken,
          doc,
        });

        set({
          list: Array.isArray(response?.data) ? response.data : [],

          total: Number(response?.total || 0),

          page: Number(response?.page || doc.page),

          size: Number(response?.size || doc.size),
        });

        lastListRequestKey = requestKey;

        lastListRequestTime = Date.now();

        return true;
      } catch (error) {
        if (error?.response?.status === 404) {
          set({
            list: [],
            total: 0,
            listError: '',
          });

          lastListRequestKey = requestKey;

          lastListRequestTime = Date.now();

          return true;
        }

        set({
          list: [],
          total: 0,
          listError: getErrorMessage(error, 'Cannot get leave list'),
        });

        return false;
      } finally {
        pendingListRequests.delete(requestKey);

        if (pendingListRequests.size === 0) {
          set({
            loadingList: false,
          });
        }
      }
    })();

    pendingListRequests.set(requestKey, request);

    return request;
  },

  searchByVtsCode: async (value) => {
    if (typeof value === 'string') {
      return get().fetchList({
        search: value,
        page: 1,
      });
    }

    return get().fetchList({
      search: value?.search || value?.employee_id || '',

      startDate: value?.startDate || get().filters.startDate,

      endDate: value?.endDate || get().filters.endDate,

      page: 1,
    });
  },

  fetchEmployeeOptions: async (search) => {
    const { access_token } = get();

    const keyword = String(search || '')
      .trim()
      .toUpperCase();

    if (!access_token || !keyword) {
      set({
        employeeOptions: [],
      });

      return [];
    }

    try {
      const response = await LeaveReportServices.Get_Employee_Options({
        search: keyword,
        access_token,
      });

      const options = Array.isArray(response?.data) ? response.data : [];

      set({
        employeeOptions: options,
      });

      return options;
    } catch (error) {
      console.error('Get employee options error:', getErrorMessage(error, 'Cannot get employees'));

      set({
        employeeOptions: [],
      });

      return [];
    }
  },

  fetchEmployeeInfo: async (employeeId) => {
    const { access_token } = get();

    if (!access_token || !employeeId) {
      throw new Error('Employee ID is required');
    }

    set({
      employeeInfoLoading: true,
    });

    try {
      const response = await LeaveReportServices.Get_Employee_Info({
        employeeId,
        access_token,
      });

      const employeeInfo = response?.data || null;

      if (!employeeInfo) {
        throw new Error('Employee not found');
      }

      set({
        employeeInfo,
      });

      return employeeInfo;
    } catch (error) {
      set({
        employeeInfo: null,
      });

      throw new Error(getErrorMessage(error, 'Employee not found'));
    } finally {
      set({
        employeeInfoLoading: false,
      });
    }
  },

  findEmployeeByCode: async (search) => {
    const keyword = String(search || '')
      .trim()
      .toUpperCase();

    if (!keyword) {
      throw new Error('Employee ID is required');
    }

    get().clearEmployeeContext();

    set({
      employeeInfoLoading: true,
    });

    try {
      const employees = await get().fetchEmployeeOptions(keyword);

      const employee =
        employees.find((item) => {
          return String(getEmployeeCode(item)).toUpperCase() === keyword;
        }) || employees[0];

      const employeeId = getEmployeeOptionId(employee);

      if (!employeeId) {
        throw new Error('Employee not found');
      }

      return await get().fetchEmployeeInfo(employeeId);
    } finally {
      set({
        employeeInfoLoading: false,
      });
    }
  },

  fetchEmployeeCard: async (employeeCode) => {
    return get().findEmployeeByCode(employeeCode);
  },

  fetchById: async (id) => {
    const { access_token } = get();

    if (!access_token || !id) {
      throw new Error('Leave request ID is required');
    }

    set({
      currentLoading: true,
      current: null,
      employeeInfo: null,
    });

    try {
      const response = await LeaveReportServices.Get_Leave_By_ID({
        id,
        access_token,
      });

      const current = response?.data || null;

      const employeeInfo = response?.employeeInfo || null;

      if (!current?._id) {
        throw new Error('Leave request not found');
      }

      set({
        current,
        employeeInfo,
      });

      return current;
    } catch (error) {
      set({
        current: null,
        employeeInfo: null,
      });

      throw new Error(getErrorMessage(error, 'Cannot get leave request'));
    } finally {
      set({
        currentLoading: false,
      });
    }
  },

  createLeave: async ({ employeeId, leaveType, permissionDate, reason, status = 'pending' }) => {
    const { access_token } = get();

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    if (!leaveType) {
      throw new Error('Leave type is required');
    }

    if (!Array.isArray(permissionDate) || !permissionDate.length) {
      throw new Error('Leave date is required');
    }

    const doc = {
      employeeId,

      num_permission_day: calculateTotalDays(permissionDate),

      permission_date: permissionDate,

      reason: String(reason || '').trim(),

      status,
      leaveType,
    };

    set({
      buttonLoading: true,
    });

    try {
      return await LeaveReportServices.Create_Leave({
        access_token,
        doc,
      });
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  updateLeave: async ({ id, leaveType, permissionDate, reason, status }) => {
    const { access_token, current } = get();

    const leaveId = id || current?._id;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!leaveId) {
      throw new Error('Leave request ID is required');
    }

    if (!leaveType) {
      throw new Error('Leave type is required');
    }

    if (!Array.isArray(permissionDate) || !permissionDate.length) {
      throw new Error('Leave date is required');
    }

    const doc = {
      num_permission_day: calculateTotalDays(permissionDate),

      permission_date: permissionDate,

      reason: String(reason || '').trim(),

      status: status || current?.status || 'pending',

      leaveType,
    };

    set({
      buttonLoading: true,
    });

    try {
      return await LeaveReportServices.Update_Leave({
        id: leaveId,
        access_token,
        doc,
      });
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  removeLeave: async (value) => {
    const { access_token } = get();

    const id = typeof value === 'object' ? value?._id || value?.id : value;

    if (!id) {
      throw new Error('Leave request ID is required');
    }

    return LeaveReportServices.Remove_Leave({
      id,
      access_token,
    });
  },
}));
