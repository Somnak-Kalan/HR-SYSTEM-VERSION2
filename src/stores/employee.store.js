import { create } from 'zustand';
import EmployeeService from '../services/setup/employee';
import EmployeeOptServices from '../services/options/employee';

const getId = (item) => item?.id || item?._id;

const unwrapEmployeeList = (res) => {
  const body = res?.data?.data && !Array.isArray(res.data.data) ? res.data : res;

  if (Array.isArray(body)) {
    return {
      list: body,
      total: body.length,
      page: 1,
      size: body.length || 10,
      totalPage: 1,
    };
  }

  if (Array.isArray(body?.data)) {
    const total = Number(body?.total || body?.pagination?.total || body.data.length);
    const page = Number(body?.page || body?.pagination?.page || 1);
    const size = Number(body?.size || body?.pagination?.size || 10);

    return {
      list: body.data,
      total,
      page,
      size,
      totalPage: Number(body?.totalPage || body?.pagination?.totalPage || Math.ceil(total / size)),
    };
  }

  if (Array.isArray(body?.data?.data)) {
    const total = Number(body?.data?.total || body?.data?.pagination?.total || body.data.data.length);
    const page = Number(body?.data?.page || body?.data?.pagination?.page || 1);
    const size = Number(body?.data?.size || body?.data?.pagination?.size || 10);

    return {
      list: body.data.data,
      total,
      page,
      size,
      totalPage: Number(body?.data?.totalPage || body?.data?.pagination?.totalPage || Math.ceil(total / size)),
    };
  }

  if (Array.isArray(body?.list)) {
    const total = Number(body?.total || body.list.length);
    const page = Number(body?.page || 1);
    const size = Number(body?.size || 10);

    return {
      list: body.list,
      total,
      page,
      size,
      totalPage: Number(body?.totalPage || Math.ceil(total / size)),
    };
  }

  return {
    list: [],
    total: 0,
    page: 1,
    size: 10,
    totalPage: 0,
  };
};

const buildCleanDoc = ({ doc = {}, page, size, search }) => {
  const cleanDoc = {
    ...doc,
    page: Number(doc?.page || page || 1),
    size: Number(doc?.size || size || 10),
    search: String(doc?.search ?? search ?? '').trim(),
  };

  if (!cleanDoc.search) {
    delete cleanDoc.search;
  }

  return cleanDoc;
};

export const useEmployeeStore = create((set, get) => ({
  loading: false,
  employees: [],
  totalEmployees: 0,
  totalPage: 0,
  employeeCache: {},
  lastEmployeesDocKey: '',
  activeEmployeeRequestKey: '',
  selectedEmployee: undefined,

  searchText: '',
  searchValue: '',
  currentPage: 1,
  pageSize: 10,

  employeeOptions: [],
  optionsLoading: false,
  create_loading: false,
  employeesFetchedAt: 0,

  setSelectedEmployee: (emp) => set({ selectedEmployee: emp }),
  setSearchText: (v) => set({ searchText: v }),
  setSearchValue: (v) => set({ searchValue: v }),
  resetSearch: () => set({ searchText: '', searchValue: '', currentPage: 1 }),
  setCurrentPage: (p) => set({ currentPage: Number(p || 1) }),
  setPageSize: (s) => set({ pageSize: Number(s || 10) }),

  clearEmployeeCache: () =>
    set({
      employeeCache: {},
      lastEmployeesDocKey: '',
      employees: [],
      totalEmployees: 0,
      totalPage: 0,
      selectedEmployee: undefined,
    }),

  invalidateEmployeeCache: () =>
    set({
      employeeCache: {},
      lastEmployeesDocKey: '',
    }),

  fetchEmployees: async ({ access_token, doc = {}, force = false }) => {
    if (!access_token) return false;

    const cleanDoc = buildCleanDoc({
      doc,
      page: get().currentPage,
      size: get().pageSize,
      search: get().searchValue,
    });

    const key = JSON.stringify(cleanDoc);
    const { employeeCache } = get();
    const cached = employeeCache?.[key];

    const canUseCache = !force && !cleanDoc.search;

    if (canUseCache && cached) {
      const prev = get().selectedEmployee;

      const nextSelected = prev ? cached.list.find((e) => getId(e) === getId(prev)) || undefined : undefined;

      set({
        employees: cached.list,
        totalEmployees: cached.total || 0,
        totalPage: cached.totalPage || 0,
        currentPage: cached.page || cleanDoc.page,
        pageSize: cached.size || cleanDoc.size,
        lastEmployeesDocKey: key,
        selectedEmployee: nextSelected,
      });

      return true;
    }

    set({
      loading: true,
      activeEmployeeRequestKey: key,
    });

    try {
      const res = await EmployeeService.Get_Employee({
        access_token,
        doc: cleanDoc,
      });

      if (get().activeEmployeeRequestKey !== key) {
        return true;
      }

      const { list, total, page, size, totalPage } = unwrapEmployeeList(res);

      const prev = get().selectedEmployee;

      const nextSelected = prev ? list.find((e) => getId(e) === getId(prev)) || undefined : undefined;

      set((state) => {
        const nextCache = { ...state.employeeCache };

        nextCache[key] = {
          list,
          total,
          page,
          size,
          totalPage,
        };

        return {
          employees: list,
          totalEmployees: total,
          totalPage,
          currentPage: page || cleanDoc.page,
          pageSize: size || cleanDoc.size,
          employeesFetchedAt: Date.now(),
          lastEmployeesDocKey: key,
          selectedEmployee: nextSelected,
          employeeCache: nextCache,
        };
      });

      return true;
    } catch (error) {
      console.log(error);

      if (get().activeEmployeeRequestKey === key) {
        set({
          employees: [],
          totalEmployees: 0,
          totalPage: 0,
        });
      }

      return false;
    } finally {
      if (get().activeEmployeeRequestKey === key) {
        set({ loading: false });
      }
    }
  },

  refetchEmployeesAfterChange: async ({ access_token, doc = {} }) => {
    if (!access_token) return false;

    get().invalidateEmployeeCache();

    const refreshDoc = buildCleanDoc({
      doc,
      page: get().currentPage,
      size: get().pageSize,
      search: get().searchValue,
    });

    return await get().fetchEmployees({
      access_token,
      doc: refreshDoc,
      force: true,
    });
  },

  fetchEmployeeOptions: async ({ access_token }) => {
    if (!access_token) return false;

    set({ optionsLoading: true });

    try {
      const data = await EmployeeOptServices.Get_Employee_Otp({
        access_token,
      });

      const options = Array.isArray(data)
        ? data
            .map((x) => {
              if (typeof x === 'string') {
                return {
                  label: x,
                  value: x,
                };
              }

              if (x?.employee_id) {
                return {
                  label: x.employee_id,
                  value: x.employee_id,
                  main_value: x.id || x._id,
                };
              }

              return null;
            })
            .filter(Boolean)
        : [];

      set({ employeeOptions: options });
      return true;
    } catch (error) {
      console.log(error);
      set({ employeeOptions: [] });
      return false;
    } finally {
      set({ optionsLoading: false });
    }
  },

  searchEmployeeCardId: async ({ access_token, employee_card_id }) => {
    if (!access_token || !employee_card_id) return null;

    try {
      const data = await EmployeeOptServices.Search_Employee_Card_Id({
        access_token,
        doc: {
          employee_card_id,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  updateEmployeeStatus: async ({ access_token, id, status }) => {
    if (!access_token || !id || !status) return false;

    const nextStatus = String(status).toLowerCase();

    if (!['active', 'inactive', 'resign'].includes(nextStatus)) {
      console.log('Invalid employee status:', nextStatus);
      return false;
    }

    try {
      await EmployeeService.Update_Employee_Status({
        access_token,
        doc: {
          id,
          status: nextStatus,
        },
      });

      get().clearEmployeeCache();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  // Keep old function names, but now all use new API
  disableEmployee: async ({ access_token, id }) => {
    return await get().updateEmployeeStatus({
      access_token,
      id,
      status: 'inactive',
    });
  },

  enableEmployee: async ({ access_token, id }) => {
    return await get().updateEmployeeStatus({
      access_token,
      id,
      status: 'active',
    });
  },

  resignEmployee: async ({ access_token, id }) => {
    return await get().updateEmployeeStatus({
      access_token,
      id,
      status: 'resign',
    });
  },

  createEmployee: async ({ access_token, doc, refreshDoc = {} }) => {
    if (!access_token || !doc) return false;

    set({ create_loading: true });

    try {
      await EmployeeService.Create_Employee({
        access_token,
        doc,
      });

      await get().refetchEmployeesAfterChange({
        access_token,
        doc: refreshDoc,
      });

      await get().fetchEmployeeOptions({
        access_token,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      set({ create_loading: false });
    }
  },

  addEmployeeOnlyPersonalInfo: async ({ access_token, doc, refreshDoc = {} }) => {
    if (!access_token || !doc) return false;

    set({ create_loading: true });

    try {
      await EmployeeService.Add_Employee_Only_Personal_Info({
        access_token,
        doc,
      });

      await get().refetchEmployeesAfterChange({
        access_token,
        doc: refreshDoc,
      });

      await get().fetchEmployeeOptions({
        access_token,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      set({ create_loading: false });
    }
  },

  Add_Employee_Only_Personal_Info: async (payload) => {
    return get().addEmployeeOnlyPersonalInfo(payload);
  },
}));
