import { create } from 'zustand';

import LateService from '../services/reports/lateType';

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

const getId = (item) => {
  return item?._id || item?.id || '';
};

const getRows = (response) => {
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

const createQuery = (doc, state) => ({
  search: doc?.search !== undefined ? String(doc.search || '').trim() : state.filters.search,

  startDate: doc?.startDate !== undefined ? doc.startDate || '' : state.filters.startDate,

  endDate: doc?.endDate !== undefined ? doc.endDate || '' : state.filters.endDate,

  page: Number(doc?.page !== undefined ? doc.page : state.page) || 1,

  size: Number(doc?.size !== undefined ? doc.size : state.size) || 10,
});

export const useLateTypeStore = create((set, get) => ({
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
  actionLoading: false,
  error: '',

  selected: null,
  selectedRowKeys: [],

  current: null,
  currentLoading: false,

  employeeInfo: null,
  employeeInfoLoading: false,

  employeeOptions: [],
  employeeOptionsLoading: false,

  setSelected: (item) => {
    const id = getId(item);

    set({
      selected: item || null,
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
    const query = createQuery(doc, get());

    set({
      loading: true,
      error: '',
      filters: {
        search: query.search,
        startDate: query.startDate,
        endDate: query.endDate,
      },
      page: query.page,
      size: query.size,
    });

    try {
      const response = await LateService.getLateList({
        access_token,
        doc: query,
      });

      if (requestId !== listRequestId) {
        return true;
      }

      const rows = getRows(response);

      set({
        list: rows,
        total: Number(response?.total ?? response?.pagination?.total ?? rows.length),
        page: Number(response?.page ?? response?.pagination?.page ?? query.page),
        size: Number(response?.size ?? response?.pagination?.size ?? query.size),
      });

      const selectedId = getId(get().selected);

      if (selectedId && !rows.some((item) => String(getId(item)) === String(selectedId))) {
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
        error: getErrorMessage(error, 'Cannot get late list'),
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
      const response = await LateService.getEmployeeOptions({
        search: keyword,
        access_token,
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
      const response = await LateService.getEmployeeInfo({
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
      throw new Error('Late request ID is required');
    }

    set({
      current: null,
      employeeInfo: null,
      currentLoading: true,
    });

    try {
      const response = await LateService.getLateById({
        id,
        access_token,
      });

      const current = response?.data || null;

      const employeeInfo = response?.employeeInfo || null;

      if (!current?._id) {
        throw new Error('Late request not found');
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

      throw new Error(getErrorMessage(error, 'Cannot get late request'));
    } finally {
      set({
        currentLoading: false,
      });
    }
  },

  reloadList: async (access_token) => {
    const state = get();

    return state.fetchList({
      access_token,
      doc: {
        ...state.filters,
        page: state.page,
        size: state.size,
      },
    });
  },

  createLate: async ({ access_token, employeeId, permissionDate, reason, status = 'approved' }) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!employeeId) {
      throw new Error('Employee ID is required');
    }

    if (!permissionDate?.length) {
      throw new Error('Late date is required');
    }

    const doc = {
      employeeId,
      num_permission_day: permissionDate.length,
      permission_date: permissionDate,
      reason: String(reason || '').trim(),
      status,
    };

    set({
      actionLoading: true,
    });

    try {
      const response = await LateService.createLate({
        access_token,
        doc,
      });

      await get().reloadList(access_token);

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },

  updateLate: async ({ access_token, id, permissionDate, reason, status }) => {
    const current = get().current;
    const requestId = id || current?._id;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!requestId) {
      throw new Error('Late request ID is required');
    }

    if (!permissionDate?.length) {
      throw new Error('Late date is required');
    }

    const doc = {
      num_permission_day: permissionDate.length,
      permission_date: permissionDate,
      reason: String(reason || '').trim(),
      status: status || current?.status || 'approved',
    };

    set({
      actionLoading: true,
    });

    try {
      const response = await LateService.updateLate({
        id: requestId,
        access_token,
        doc,
      });

      await get().reloadList(access_token);

      get().clearSelection();
      get().clearCurrent();

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },

  removeLate: async ({ access_token, id }) => {
    if (!access_token || !id) {
      throw new Error('Late request ID is required');
    }

    set({
      actionLoading: true,
    });

    try {
      const response = await LateService.removeLate({
        id,
        access_token,
      });

      await get().reloadList(access_token);

      get().clearSelection();

      return response;
    } finally {
      set({
        actionLoading: false,
      });
    }
  },
}));
