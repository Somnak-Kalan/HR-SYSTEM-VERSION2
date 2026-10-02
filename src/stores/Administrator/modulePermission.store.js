import { create } from 'zustand';
import ModulePermissionService from '../../services/administrator/modulePermission';

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;
  return [];
};

const toObject = (res) => {
  if (res?.data?.data && typeof res.data.data === 'object') {
    return res.data.data;
  }

  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }

  if (res && typeof res === 'object' && !Array.isArray(res)) {
    return res;
  }

  return null;
};

export const useModulePermissionStore = create((set) => ({
  modules: [],
  moduleDetail: null,

  moduleLoading: false,
  moduleDetailLoading: false,
  moduleSaving: false,
  moduleDeleting: false,

  permissionGroups: [],
  companyOptions: [],
  departmentOptions: [],
  optionLoading: false,

  error: null,

  Fetch_Module_List: async ({ access_token, doc = {} }) => {
    try {
      set({ moduleLoading: true, error: null });

      const res = await ModulePermissionService.Get_Module_List({
        access_token,
        doc,
      });

      set({
        modules: toArray(res),
        moduleLoading: false,
      });

      return res;
    } catch (error) {
      set({ moduleLoading: false, error });
      throw error;
    }
  },

  Get_Module_By_Id: async ({ access_token, doc = {} }) => {
    try {
      set({ moduleDetailLoading: true, moduleDetail: null, error: null });

      const res = await ModulePermissionService.Get_Module_By_Id({
        access_token,
        doc,
      });

      const data = toObject(res);

      set({
        moduleDetail: data,
        moduleDetailLoading: false,
      });

      return data;
    } catch (error) {
      set({ moduleDetailLoading: false, error });
      throw error;
    }
  },

  Create_Module: async ({ access_token, doc = {} }) => {
    try {
      set({ moduleSaving: true, error: null });

      const res = await ModulePermissionService.Create_Module({
        access_token,
        doc,
      });

      set({ moduleSaving: false });

      return res;
    } catch (error) {
      set({ moduleSaving: false, error });
      throw error;
    }
  },

  Update_Module: async ({ access_token, doc = {} }) => {
    try {
      set({ moduleSaving: true, error: null });

      const res = await ModulePermissionService.Update_Module({
        access_token,
        doc,
      });

      set({ moduleSaving: false });

      return res;
    } catch (error) {
      set({ moduleSaving: false, error });
      throw error;
    }
  },

  Remove_Module: async ({ access_token, doc = {} }) => {
    try {
      set({ moduleDeleting: true, error: null });

      const res = await ModulePermissionService.Remove_Module({
        access_token,
        doc,
      });

      set({ moduleDeleting: false });

      return res;
    } catch (error) {
      set({ moduleDeleting: false, error });
      throw error;
    }
  },

  Fetch_System_Permission_Options: async ({ access_token }) => {
    try {
      set({ optionLoading: true, error: null });

      const res = await ModulePermissionService.Get_System_Permission_Options({
        access_token,
      });

      set({
        permissionGroups: toArray(res),
        optionLoading: false,
      });

      return res;
    } catch (error) {
      set({ optionLoading: false, error });
      throw error;
    }
  },

  Fetch_Company_Options: async ({ access_token }) => {
    try {
      set({ optionLoading: true, error: null });

      const res = await ModulePermissionService.Get_Company_Options({
        access_token,
      });

      set({
        companyOptions: toArray(res),
        optionLoading: false,
      });

      return res;
    } catch (error) {
      set({ optionLoading: false, error });
      throw error;
    }
  },

  Fetch_Department_Options: async ({ access_token, doc = {} }) => {
    try {
      set({ optionLoading: true, departmentOptions: [], error: null });

      const res = await ModulePermissionService.Get_Department_Options({
        access_token,
        doc,
      });

      set({
        departmentOptions: toArray(res),
        optionLoading: false,
      });

      return res;
    } catch (error) {
      set({ optionLoading: false, error });
      throw error;
    }
  },

  Clear_Module_Detail: () => {
    set({ moduleDetail: null });
  },
}));
