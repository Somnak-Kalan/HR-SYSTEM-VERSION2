import { create } from 'zustand';

import MissedScanServices from '../../services/reports/missed_scan';

let listRequestId = 0;
let employeeRequestId = 0;

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getRecordId = (record) => {
  return record?._id || record?.id || '';
};

const getListData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
};

const calculateTotalDays = (dates) => {
  if (!Array.isArray(dates)) {
    return 0;
  }

  return dates.reduce((total, item) => {
    if (item?.status_request === 'morning' || item?.status_request === 'afternoon') {
      return total + 0.5;
    }

    return total + 1;
  }, 0);
};

const createListQuery = (doc, state) => {
  return {
    search: doc?.search !== undefined ? String(doc.search || '').trim() : state.filters.search,

    startDate: doc?.startDate !== undefined ? doc.startDate || '' : state.filters.startDate,

    endDate: doc?.endDate !== undefined ? doc.endDate || '' : state.filters.endDate,

    page: Number(doc?.page !== undefined ? doc.page : state.page) || 1,

    size: Number(doc?.size !== undefined ? doc.size : state.size) || 10,
  };
};

export const useMissScanStore = create((set, get) => ({
  list: [],
  total: 0,
  page: 1,
  size: 10,

  filters: {
    search: '',
    startDate: '',
    endDate: '',
  },

  loading: false,
  listError: '',
  actionLoading: false,

  selected: null,
  selectedRowKeys: [],

  current: null,
  currentLoading: false,

  employeeInfo: null,
  employeeInfoLoading: false,

  employeeOptions: [],
  employeeOptionsLoading: false,

  setSelected: (record) => {
    const id = getRecordId(record);

    set({
      selected: record || null,

      selectedRowKeys: id ? [id] : [],
    });
  },

  clearSelection: () => {
    set({
      selected: null,
      selectedRowKeys: [],
    });
  },

  clearCurrent: () => {
    set({
      current: null,
      employeeInfo: null,
    });
  },

  clearEmployeeContext: () => {
    set({
      employeeInfo: null,
      employeeOptions: [],
      employeeInfoLoading: false,
      employeeOptionsLoading: false,
    });
  },

  fetchList: async ({ access_token, doc = {} }) => {
    if (!access_token) {
      return false;
    }

    const requestId = ++listRequestId;

    const state = get();

    const query = createListQuery(doc, state);

    set({
      loading: true,
      listError: '',

      filters: {
        search: query.search,
        startDate: query.startDate,
        endDate: query.endDate,
      },

      page: query.page,
      size: query.size,
    });

    try {
      const response = await MissedScanServices.Fetch_Request_Missed_Scan_List({
        access_token,
        doc: query,
      });

      if (requestId !== listRequestId) {
        return true;
      }

      const rows = getListData(response);

      const total = Number(response?.total ?? response?.pagination?.total ?? rows.length);

      const page = Number(response?.page ?? response?.pagination?.page ?? query.page);

      const size = Number(response?.size ?? response?.pagination?.size ?? query.size);

      set({
        list: rows,
        total,
        page,
        size,
      });

      const selectedId = getRecordId(get().selected);

      if (
        selectedId &&
        !rows.some((record) => {
          return String(getRecordId(record)) === String(selectedId);
        })
      ) {
        get().clearSelection();
      }

      return true;
    } catch (error) {
      if (requestId !== listRequestId) {
        return false;
      }

      set({
        list: [],
        total: 0,

        listError: getErrorMessage(error, 'Cannot get missed scan list'),
      });

      get().clearSelection();

      return false;
    } finally {
      if (requestId === listRequestId) {
        set({
          loading: false,
        });
      }
    }
  },

  fetchEmployeeOptions: async (search, access_token) => {
    const keyword = String(search || '').trim();

    if (!access_token || !keyword) {
      set({
        employeeOptions: [],
        employeeOptionsLoading: false,
      });

      return [];
    }

    const requestId = ++employeeRequestId;

    set({
      employeeOptionsLoading: true,
    });

    try {
      const response = await MissedScanServices.Get_Employee_Options({
        access_token,
        search: keyword,
      });

      if (requestId !== employeeRequestId) {
        return [];
      }

      const options = Array.isArray(response?.data) ? response.data : [];

      set({
        employeeOptions: options,
      });

      return options;
    } catch (error) {
      if (requestId === employeeRequestId) {
        set({
          employeeOptions: [],
        });
      }

      return [];
    } finally {
      if (requestId === employeeRequestId) {
        set({
          employeeOptionsLoading: false,
        });
      }
    }
  },

  fetchEmployeeInfo: async (employeeId, access_token) => {
    if (!access_token || !employeeId) {
      throw new Error('Employee ID is required');
    }

    set({
      employeeInfo: null,
      employeeInfoLoading: true,
    });

    try {
      const response = await MissedScanServices.Get_Employee_Info({
        employeeId,
        access_token,
      });

      const employeeInfo = response?.data || null;

      if (!employeeInfo?._id) {
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

  fetchById: async (id, access_token) => {
    if (!access_token || !id) {
      throw new Error('Missed scan ID is required');
    }

    set({
      current: null,
      employeeInfo: null,
      currentLoading: true,
    });

    try {
      const response = await MissedScanServices.Get_Missed_Scan_By_ID({
        id,
        access_token,
      });

      const current = response?.data || null;

      const employeeInfo = response?.employeeInfo || null;

      if (!current?._id) {
        throw new Error('Missed scan request not found');
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

      throw new Error(getErrorMessage(error, 'Cannot get missed scan request'));
    } finally {
      set({
        currentLoading: false,
      });
    }
  },

  addMiss: async ({ access_token, employeeId, permissionDate, reason, status = 'approved' }) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    if (!Array.isArray(permissionDate) || permissionDate.length === 0) {
      throw new Error('Request date is required');
    }

    const doc = {
      employeeId,

      num_permission_day: calculateTotalDays(permissionDate),

      permission_date: permissionDate,

      reason: String(reason || '').trim(),

      status,
    };

    set({
      actionLoading: true,
    });

    try {
      const response = await MissedScanServices.Add_Missed_Scan({
        access_token,
        doc,
      });

      const state = get();

      await state.fetchList({
        access_token,

        doc: {
          ...state.filters,
          page: state.page,
          size: state.size,
        },
      });

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },

  updateMiss: async ({ access_token, id, permissionDate, reason, status }) => {
    const state = get();

    const requestId = id || state.current?._id;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!requestId) {
      throw new Error('Missed scan ID is required');
    }

    if (!Array.isArray(permissionDate) || permissionDate.length === 0) {
      throw new Error('Request date is required');
    }

    const doc = {
      num_permission_day: calculateTotalDays(permissionDate),

      permission_date: permissionDate,

      reason: String(reason || '').trim(),

      status: status || state.current?.status || 'approved',
    };

    set({
      actionLoading: true,
    });

    try {
      const response = await MissedScanServices.Update_Missed_Scan({
        id: requestId,
        access_token,
        doc,
      });

      const nextState = get();

      await nextState.fetchList({
        access_token,

        doc: {
          ...nextState.filters,
          page: nextState.page,
          size: nextState.size,
        },
      });

      nextState.clearSelection();
      nextState.clearCurrent();

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },

  removeMiss: async ({ access_token, id }) => {
    if (!access_token || !id) {
      throw new Error('Missed scan ID is required');
    }

    set({
      actionLoading: true,
    });

    try {
      const response = await MissedScanServices.Remove_Missed_Scan({
        id,
        access_token,
      });

      const state = get();

      await state.fetchList({
        access_token,

        doc: {
          ...state.filters,
          page: state.page,
          size: state.size,
        },
      });

      state.clearSelection();

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },
}));
