import { create } from 'zustand';

import LeaveTypeService from '../services/setup/LeaveType';

// =========================================================
// HELPERS
// =========================================================

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
  if (typeof item === 'string') {
    return item;
  }

  return item?._id || item?.id || '';
};

const getList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
};

const getDetail = (response) => {
  // API:
  // {
  //   data: {
  //      _id: "...",
  //      ...
  //   }
  // }

  if (response?.data && !Array.isArray(response.data)) {
    return response.data;
  }

  // In case service returns:
  // {
  //   data: {
  //      data: {
  //         _id: "..."
  //      }
  //   }
  // }

  if (response?.data?.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (response && !Array.isArray(response)) {
    return response;
  }

  return null;
};

// =========================================================
// STORE
// =========================================================

export const useLeaveTypeStore = create((set, get) => ({
  // =====================================================
  // LIST
  // =====================================================

  list: [],

  total: 0,

  search: '',

  loading: false,

  buttonLoading: false,

  currentLoading: false,

  error: '',

  // =====================================================
  // OPTIONS
  // =====================================================

  employeeOptions: [],

  departmentOptions: [],

  optionLoading: false,

  // =====================================================
  // CURRENT / SELECTED
  // =====================================================

  current: null,

  selected: null,

  selectedRowKeys: [],

  // =====================================================
  // SELECTION
  // =====================================================

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
    });
  },

  // =====================================================
  // GET LEAVE TYPES
  // =====================================================

  fetchLeaveTypes: async ({ access_token, search, doc } = {}) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    const keyword = String(search ?? doc?.search ?? get().search ?? '').trim();

    set({
      loading: true,
      error: '',
      search: keyword,
    });

    try {
      const response = await LeaveTypeService.Get_Leave_Type({
        access_token,
        doc: {
          search: keyword,
        },
      });

      const list = getList(response);

      set({
        list,
        total: Number(response?.total ?? response?.data?.total ?? list.length),
      });

      // Keep selected row if it still exists
      const selectedId = getId(get().selected);

      if (selectedId) {
        const selected =
          list.find((item) => {
            return String(getId(item)) === String(selectedId);
          }) || null;

        set({
          selected,
          selectedRowKeys: selected ? [getId(selected)] : [],
        });
      }

      return list;
    } catch (error) {
      set({
        list: [],
        total: 0,
        error: getErrorMessage(error, 'Cannot get leave types'),
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // =====================================================
  // GET LEAVE TYPE BY ID
  // =====================================================

  fetchLeaveTypeById: async ({ access_token, id, _id, doc } = {}) => {
    const leaveTypeId = id || _id || doc?.id || doc?._id;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!leaveTypeId) {
      throw new Error('Leave type ID is required');
    }

    set({
      current: null,
      currentLoading: true,
      error: '',
    });

    try {
      console.log('GET LEAVE TYPE BY ID:', leaveTypeId);

      const response = await LeaveTypeService.Get_Leave_Type_By_Id({
        access_token,
        doc: {
          id: leaveTypeId,
        },
      });

      console.log('LEAVE TYPE DETAIL RESPONSE:', response);

      const current = getDetail(response);

      console.log('LEAVE TYPE DETAIL:', current);

      if (!current?._id && !current?.id) {
        throw new Error('Leave type not found');
      }

      set({
        current,
      });

      return current;
    } catch (error) {
      console.error('GET LEAVE TYPE BY ID ERROR:', error);

      set({
        current: null,
        error: getErrorMessage(error, 'Cannot get leave type'),
      });

      throw error;
    } finally {
      set({
        currentLoading: false,
      });
    }
  },

  // =====================================================
  // CREATE
  // =====================================================

  createLeaveType: async ({ access_token, doc } = {}) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!doc) {
      throw new Error('Leave type data is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await LeaveTypeService.Create_Leave_Type({
        access_token,
        doc,
      });

      await get().fetchLeaveTypes({
        access_token,
        search: get().search,
      });

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot create leave type'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  // =====================================================
  // UPDATE
  // =====================================================

  updateLeaveType: async ({ access_token, id, _id, doc, formData } = {}) => {
    const leaveTypeId = id || _id || doc?.id || doc?._id || getId(get().current) || getId(get().selected);

    const updateData = formData || doc?.formData || doc;

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!leaveTypeId) {
      throw new Error('Leave type ID is required');
    }

    if (!updateData) {
      throw new Error('Leave type data is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await LeaveTypeService.Update_Leave_Type({
        access_token,
        doc: {
          id: leaveTypeId,
          formData: updateData,
        },
      });

      await get().fetchLeaveTypes({
        access_token,
        search: get().search,
      });

      get().clearCurrent();
      get().clearSelection();

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot update leave type'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  // =====================================================
  // DELETE
  // =====================================================

  removeLeaveType: async ({ access_token, id, _id, doc } = {}) => {
    const leaveTypeId = id || _id || doc?.id || doc?._id || getId(get().selected);

    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!leaveTypeId) {
      throw new Error('Leave type ID is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await LeaveTypeService.Remove_Leave_Type({
        access_token,
        doc: {
          id: leaveTypeId,
        },
      });

      await get().fetchLeaveTypes({
        access_token,
        search: get().search,
      });

      get().clearCurrent();
      get().clearSelection();

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot remove leave type'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  // =====================================================
  // APPLY LEAVE TYPE
  // =====================================================

  applyLeaveType: async ({ access_token, doc }) => {
    if (!access_token) {
      throw new Error('Access token is missing');
    }

    if (!doc) {
      throw new Error('Apply leave type data is required');
    }

    set({
      buttonLoading: true,
      error: '',
    });

    try {
      const response = await LeaveTypeService.Apply_Leave_Type({
        access_token,
        doc,
      });

      return response;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot apply leave type'),
      });

      throw error;
    } finally {
      set({
        buttonLoading: false,
      });
    }
  },

  // =====================================================
  // EMPLOYEE OPTIONS
  // =====================================================

  fetchEmployeeOptions: async ({ access_token, search = '' }) => {
    try {
      set({
        optionLoading: true,
      });

      const response = await LeaveTypeService.Get_Employee_Options({
        access_token,
        doc: {
          search,
        },
      });

      const list = getList(response);

      set({
        employeeOptions: list,
      });

      return list;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot get employee options'),
      });

      throw error;
    } finally {
      set({
        optionLoading: false,
      });
    }
  },

  // =====================================================
  // DEPARTMENT OPTIONS
  // =====================================================

  fetchDepartmentOptions: async ({ access_token, search = '' }) => {
    try {
      set({
        optionLoading: true,
      });

      const response = await LeaveTypeService.Get_Department_Options({
        access_token,
        doc: {
          search,
        },
      });

      const list = getList(response);

      set({
        departmentOptions: list,
      });

      return list;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Cannot get department options'),
      });

      throw error;
    } finally {
      set({
        optionLoading: false,
      });
    }
  },

  // =====================================================
  // RESET STORE
  // =====================================================

  resetStore: () => {
    set({
      employeeOptions: [],

      departmentOptions: [],

      optionLoading: false,

      list: [],

      total: 0,

      search: '',

      loading: false,

      buttonLoading: false,

      currentLoading: false,

      error: '',

      current: null,

      selected: null,

      selectedRowKeys: [],
    });
  },
}));

export default useLeaveTypeStore;
