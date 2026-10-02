import { create } from 'zustand';
import UserManagementService from '../../services/administrator/userManagement';

const getId = (item) => {
  if (!item) return undefined;

  if (typeof item === 'object') {
    return item._id || item.id || item.value;
  }

  return item;
};

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) {
    return res.data.data;
  }
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) {
    return res.data.list;
  }
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.rows)) {
    return res.data.rows;
  }

  return [];
};

const toObject = (res) => {
  if (res?.data?.data && typeof res.data.data === 'object') {
    return Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
  }

  if (res?.data && typeof res.data === 'object') {
    return Array.isArray(res.data) ? res.data[0] : res.data;
  }

  if (res && typeof res === 'object') {
    return Array.isArray(res) ? res[0] : res;
  }

  return null;
};

const getTotal = (res) => {
  return (
    res?.total ||
    res?.data?.total ||
    res?.pagination?.total ||
    res?.data?.pagination?.total ||
    res?.count ||
    res?.data?.count ||
    0
  );
};

export const useUserManagementStore = create((set) => ({
  users: [],
  userDetail: null,

  userLoading: false,
  userDetailLoading: false,
  userSaving: false,
  userChecking: false,
  userRemovingCore: false,

  userOptions: [],
  moduleOptions: [],
  modulePermissionGroups: [],

  userTotal: 0,
  optionLoading: false,
  modulePermissionLoading: false,
  error: null,

  Fetch_User_List: async ({ access_token, doc = {} }) => {
    try {
      set({
        userLoading: true,
        error: null,
      });

      const res = await UserManagementService.Get_User_List({
        access_token,
        doc,
      });

      set({
        users: toArray(res),
        userTotal: getTotal(res),
        userLoading: false,
      });

      return res;
    } catch (error) {
      set({
        userLoading: false,
        error,
      });

      throw error;
    }
  },

  Get_User_By_Id: async ({ access_token, doc = {} }) => {
    try {
      set({
        userDetailLoading: true,
        userDetail: null,
        error: null,
      });

      const res = await UserManagementService.Get_User_By_Id({
        access_token,
        doc,
      });

      const data = toObject(res);

      set({
        userDetail: data,
        userDetailLoading: false,
      });

      return data;
    } catch (error) {
      set({
        userDetailLoading: false,
        error,
      });

      throw error;
    }
  },

  Create_User: async ({ access_token, doc = {} }) => {
    try {
      set({
        userSaving: true,
        error: null,
      });

      const res = await UserManagementService.Create_User({
        access_token,
        doc,
      });

      set({
        userSaving: false,
      });

      return res;
    } catch (error) {
      set({
        userSaving: false,
        error,
      });

      throw error;
    }
  },

  Check_Staff_Code: async ({ access_token, doc = {} }) => {
    try {
      set({
        userChecking: true,
        error: null,
      });

      const res = await UserManagementService.Check_Staff_Code({
        access_token,
        doc,
      });

      set({
        userChecking: false,
      });

      return res;
    } catch (error) {
      set({
        userChecking: false,
        error,
      });

      throw error;
    }
  },

  Check_Username: async ({ access_token, doc = {} }) => {
    try {
      set({
        userChecking: true,
        error: null,
      });

      const res = await UserManagementService.Check_Username({
        access_token,
        doc,
      });

      set({
        userChecking: false,
      });

      return res;
    } catch (error) {
      set({
        userChecking: false,
        error,
      });

      throw error;
    }
  },

  Update_User_Info: async ({ access_token, doc = {} }) => {
    try {
      set({
        userSaving: true,
        error: null,
      });

      const res = await UserManagementService.Update_User_Info({
        access_token,
        doc,
      });

      set({
        userSaving: false,
      });

      return res;
    } catch (error) {
      set({
        userSaving: false,
        error,
      });

      throw error;
    }
  },

  Update_User_Permission: async ({ access_token, doc = {} }) => {
    try {
      set({
        userSaving: true,
        error: null,
      });

      const res = await UserManagementService.Update_User_Permission({
        access_token,
        doc,
      });

      set({
        userSaving: false,
      });

      return res;
    } catch (error) {
      set({
        userSaving: false,
        error,
      });

      throw error;
    }
  },

  Update_User_Password: async ({ access_token, doc = {} }) => {
    try {
      set({
        userSaving: true,
        error: null,
      });

      const res = await UserManagementService.Update_User_Password({
        access_token,
        doc,
      });

      set({
        userSaving: false,
      });

      return res;
    } catch (error) {
      set({
        userSaving: false,
        error,
      });

      throw error;
    }
  },

  Update_System_Core: async ({ access_token, doc = {} }) => {
    try {
      set({
        userSaving: true,
        error: null,
      });

      const res = await UserManagementService.Update_System_Core({
        access_token,
        doc,
      });

      set({
        userSaving: false,
      });

      return res;
    } catch (error) {
      set({
        userSaving: false,
        error,
      });

      throw error;
    }
  },

  Remove_User_From_Core: async ({ access_token, doc = {} }) => {
    const userId = doc?.id || doc?._id;

    try {
      set({
        userRemovingCore: true,
        error: null,
      });

      const res = await UserManagementService.Remove_User_From_Core({
        access_token,
        doc,
      });

      set((state) => ({
        userRemovingCore: false,

        users: state.users.map((user) => {
          if (String(getId(user)) !== String(userId)) {
            return user;
          }

          return {
            ...user,
            systemCore: false,
            moduleId: [],
            modules: [],
            permissionModules: [],
          };
        }),

        userDetail:
          state.userDetail && String(getId(state.userDetail)) === String(userId)
            ? {
                ...state.userDetail,
                systemCore: false,
                moduleId: [],
                modules: [],
                permissionModules: [],
              }
            : state.userDetail,
      }));

      return res;
    } catch (error) {
      set({
        userRemovingCore: false,
        error,
      });

      throw error;
    }
  },

  Fetch_User_Options: async ({ access_token, doc = {} }) => {
    try {
      set({
        optionLoading: true,
        error: null,
      });

      const res = await UserManagementService.Get_User_Options({
        access_token,
        doc,
      });

      set({
        userOptions: toArray(res),
        optionLoading: false,
      });

      return res;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  Fetch_Module_Options: async ({ access_token }) => {
    try {
      set({
        optionLoading: true,
        error: null,
      });

      const res = await UserManagementService.Get_Module_Options({
        access_token,
      });

      set({
        moduleOptions: toArray(res),
        optionLoading: false,
      });

      return res;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  Fetch_Module_Permission: async ({ access_token, doc = {} }) => {
    try {
      set({
        modulePermissionLoading: true,
        modulePermissionGroups: [],
        error: null,
      });

      const res = await UserManagementService.Get_Module_Permission({
        access_token,
        doc,
      });

      set({
        modulePermissionGroups: toArray(res),
        modulePermissionLoading: false,
      });

      return res;
    } catch (error) {
      set({
        modulePermissionLoading: false,
        error,
      });

      throw error;
    }
  },

  Clear_User_Detail: () => {
    set({
      userDetail: null,
    });
  },

  Clear_Module_Permission: () => {
    set({
      modulePermissionGroups: [],
    });
  },
}));
