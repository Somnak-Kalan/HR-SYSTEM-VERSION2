import { create } from 'zustand';
import DepartmentService from '../services/setup/department';

const clean = (value) => {
  if (value === '' || value === 'undefined' || value === 'null' || value === null || value === undefined) {
    return '';
  }

  return value;
};

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.docs)) return res.docs;
  if (Array.isArray(res?.data?.docs)) return res.data.docs;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;

  // Extra support for department employee API response
  if (Array.isArray(res?.employees)) return res.employees;
  if (Array.isArray(res?.data?.employees)) return res.data.employees;
  if (Array.isArray(res?.employee)) return res.employee;
  if (Array.isArray(res?.data?.employee)) return res.data.employee;
  if (Array.isArray(res?.departmentEmployees)) return res.departmentEmployees;
  if (Array.isArray(res?.data?.departmentEmployees)) {
    return res.data.departmentEmployees;
  }

  return [];
};

const toObject = (res) => {
  if (!res) return null;

  if (res?.data?.data && typeof res.data.data === 'object') {
    return res.data.data;
  }

  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }

  if (typeof res === 'object' && !Array.isArray(res)) {
    return res;
  }

  return null;
};

const buildDeptEmployeeCacheKey = ({ deptId, search }) => {
  return `${deptId || ''}__${String(search || '')
    .trim()
    .toLowerCase()}`;
};

export const useDepartmentStore = create((set, get) => ({
  department: [],
  departmentLoading: false,
  departmentFetchedAt: null,
  departmentQuery: {
    search: '',
  },

  departmentById: null,
  departmentByIdLoading: false,

  departmentEmployees: [],
  employeesLoading: false,

  // cache by department + search
  departmentEmployeesByDept: {},
  employeesFetchedAtByDept: {},
  departmentEmployeesQuery: {
    deptId: '',
    search: '',
  },

  error: null,

  Get_Department: async ({ access_token, doc = {}, force = false }) => {
    const search = String(doc?.search || '').trim();

    const { department, departmentQuery } = get();
    const sameSearch = departmentQuery?.search === search;

    if (!force && sameSearch && Array.isArray(department) && department.length > 0) {
      return {
        data: department,
        fromCache: true,
      };
    }

    try {
      set({
        departmentLoading: true,
        error: null,
        departmentQuery: {
          search,
        },
      });

      const res = await DepartmentService.Get_Department({
        access_token,
        doc: {
          search,
        },
      });

      const list = toArray(res);

      set({
        department: list,
        departmentFetchedAt: Date.now(),
        departmentLoading: false,
      });

      return res;
    } catch (error) {
      set({
        departmentLoading: false,
        error,
      });

      throw error;
    }
  },

  Get_Department_By_Id: async ({ doc, access_token }) => {
    try {
      const id = doc?.id || doc?._id;

      if (!id) {
        throw new Error('Department id is required');
      }

      set({
        departmentByIdLoading: true,
        departmentById: null,
        error: null,
      });

      const res = await DepartmentService.Get_Department_By_Id({
        doc: {
          id,
        },
        access_token,
      });

      const data = toObject(res);

      set({
        departmentById: data,
        departmentByIdLoading: false,
      });

      return data;
    } catch (error) {
      set({
        departmentByIdLoading: false,
        error,
      });

      throw error;
    }
  },

  Fetch_List_Employee_By_Department: async ({ doc, access_token, force = false }) => {
    const deptId = doc?.id || doc?._id;

    const search = String(clean(doc?.search) || '').trim();

    if (!deptId) {
      throw new Error('Department id is required');
    }

    const cacheKey = buildDeptEmployeeCacheKey({
      deptId,

      search,
    });

    const { departmentEmployeesByDept } = get();

    // ============================
    // CACHE
    // ============================

    if (
      !force &&
      Array.isArray(departmentEmployeesByDept?.[cacheKey]) &&
      departmentEmployeesByDept[cacheKey].length > 0
    ) {
      set({
        departmentEmployees: departmentEmployeesByDept[cacheKey],

        departmentEmployeesQuery: {
          deptId,

          search,
        },
      });

      return {
        data: departmentEmployeesByDept[cacheKey],

        fromCache: true,
      };
    }

    try {
      set({
        employeesLoading: true,

        error: null,

        departmentEmployeesQuery: {
          deptId,

          search,
        },
      });

      // ============================
      // API CALL
      // ============================

      const res = await DepartmentService.Fetch_List_Employee_By_Department({
        doc: {
          ...doc,

          id: deptId,

          search,
        },

        access_token,
      });

      console.log('EMPLOYEE API RESPONSE:', res);

      // ============================
      // GET DEPARTMENT INFO
      // ============================

      const departmentInfo = res?.department || null;

      // ============================
      // GET EMPLOYEE LIST
      // ============================

      const list = Array.isArray(res?.data) ? res.data : [];

      // ============================
      // SAVE STORE
      // ============================

      set((state) => ({
        departmentEmployees: list,

        departmentEmployeeDepartment: departmentInfo,

        departmentEmployeesByDept: {
          ...state.departmentEmployeesByDept,

          [cacheKey]: list,
        },

        employeesFetchedAtByDept: {
          ...state.employeesFetchedAtByDept,

          [cacheKey]: Date.now(),
        },

        employeesLoading: false,
      }));

      return res;
    } catch (error) {
      set({
        employeesLoading: false,

        error,
      });

      throw error;
    }
  },
  Create_Department: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const res = await DepartmentService.Create_Department({
        doc,
        access_token,
      });

      if (res) {
        const currentQuery = get().departmentQuery || { search: '' };

        await get().Get_Department({
          access_token,
          doc: currentQuery,
          force: true,
        });
      }

      return res;
    } catch (error) {
      set({
        error,
      });

      throw error;
    }
  },

  Update_Department: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const res = await DepartmentService.Update_Department({
        doc,
        access_token,
      });

      if (res) {
        const currentQuery = get().departmentQuery || { search: '' };

        await get().Get_Department({
          access_token,
          doc: currentQuery,
          force: true,
        });

        const deptId = doc?.id || doc?._id;

        if (deptId) {
          set((state) => {
            const newEmployeesByDept = { ...state.departmentEmployeesByDept };
            const newFetchedAtByDept = { ...state.employeesFetchedAtByDept };

            Object.keys(newEmployeesByDept).forEach((key) => {
              if (key.startsWith(`${deptId}__`)) {
                delete newEmployeesByDept[key];
              }
            });

            Object.keys(newFetchedAtByDept).forEach((key) => {
              if (key.startsWith(`${deptId}__`)) {
                delete newFetchedAtByDept[key];
              }
            });

            return {
              departmentEmployeesByDept: newEmployeesByDept,
              employeesFetchedAtByDept: newFetchedAtByDept,
            };
          });
        }
      }

      return res;
    } catch (error) {
      set({
        error,
      });

      throw error;
    }
  },
  Update_Department_Leave_Type: async ({ doc, access_token }) => {
    try {
      const res = await DepartmentService.Update_Department_Leave_Type({
        doc,
        access_token,
      });

      // refresh current department employee detail
      await get().Fetch_List_Employee_By_Department({
        doc: {
          id: doc.id,
        },

        access_token,

        force: true,
      });

      set({
        employeesLoading: false,
      });

      return res;
    } catch (error) {
      throw error;
    }
  },
  Remove_Department: async ({ doc, access_token }) => {
    try {
      set({
        error: null,
      });

      const deptId = doc?.id || doc?._id;

      const res = await DepartmentService.Remove_Department({
        doc: {
          ...doc,
          id: deptId,
        },
        access_token,
      });

      if (res) {
        const currentQuery = get().departmentQuery || { search: '' };

        await get().Get_Department({
          access_token,
          doc: currentQuery,
          force: true,
        });

        if (deptId) {
          set((state) => {
            const newEmployeesByDept = { ...state.departmentEmployeesByDept };
            const newFetchedAtByDept = { ...state.employeesFetchedAtByDept };

            Object.keys(newEmployeesByDept).forEach((key) => {
              if (key.startsWith(`${deptId}__`)) {
                delete newEmployeesByDept[key];
              }
            });

            Object.keys(newFetchedAtByDept).forEach((key) => {
              if (key.startsWith(`${deptId}__`)) {
                delete newFetchedAtByDept[key];
              }
            });

            return {
              departmentEmployees: [],
              departmentEmployeesByDept: newEmployeesByDept,
              employeesFetchedAtByDept: newFetchedAtByDept,
            };
          });
        }
      }

      return res;
    } catch (error) {
      set({
        error,
      });
      throw error;
    }
  },

  Clear_Department_Cache: () => {
    set({
      department: [],
      departmentById: null,
      departmentEmployees: [],
      departmentEmployeesByDept: {},
      employeesFetchedAtByDept: {},
      departmentFetchedAt: null,
      departmentQuery: {
        search: '',
      },
      departmentEmployeesQuery: {
        deptId: '',
        search: '',
      },
      error: null,
    });
  },
}));
