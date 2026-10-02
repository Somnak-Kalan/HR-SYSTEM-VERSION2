import { create } from 'zustand';
import RolePermissionService from '../../services/administrator/rolePermission';

const normalizeId = (item) => {
  if (!item) return undefined;

  const value = typeof item === 'object' ? item._id || item.id || item.value : item;

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return String(value);
};

const toArray = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.list)) {
    return response.list;
  }

  if (Array.isArray(response?.data?.list)) {
    return response.data.list;
  }

  if (Array.isArray(response?.rows)) {
    return response.rows;
  }

  if (Array.isArray(response?.data?.rows)) {
    return response.data.rows;
  }

  return [];
};

const toObject = (response) => {
  if (response?.data?.data && typeof response.data.data === 'object') {
    return Array.isArray(response.data.data) ? response.data.data[0] || null : response.data.data;
  }

  if (response?.data && typeof response.data === 'object') {
    return Array.isArray(response.data) ? response.data[0] || null : response.data;
  }

  if (response && typeof response === 'object') {
    return Array.isArray(response) ? response[0] || null : response;
  }

  return null;
};

/**
 * Get permission IDs from the employee information response.
 *
 * Expected API response:
 *
 * {
 *   data: {
 *     permissions: [
 *       'permissionId1',
 *       'permissionId2'
 *     ]
 *   }
 * }
 */
const getUserPermissionIds = (response) => {
  const permissions = response?.data?.permissions;

  if (!Array.isArray(permissions)) {
    return [];
  }

  return [...new Set(permissions.map(normalizeId).filter(Boolean))];
};

export const useRolePermissionStore = create((set) => ({
  roles: [],
  roleDetail: null,

  roleLoading: false,
  roleDetailLoading: false,
  roleSaving: false,
  roleDeleting: false,

  permissionGroups: [],
  companyOptions: [],
  departmentOptions: [],
  userOptions: [],

  /*
   * Information and permissions belonging to
   * the currently selected employee.
   */
  userPermissionInfo: null,
  userPermissionIds: [],
  userPermissionUserId: null,
  userPermissionLoading: false,

  optionLoading: false,
  error: null,

  Fetch_Role_List: async ({ access_token, doc = {} }) => {
    try {
      set({
        roleLoading: true,
        error: null,
      });

      const response = await RolePermissionService.Get_Role_List({
        access_token,
        doc,
      });

      set({
        roles: toArray(response),
        roleLoading: false,
      });

      return response;
    } catch (error) {
      set({
        roleLoading: false,
        error,
      });

      throw error;
    }
  },

  Get_Role_By_Id: async ({ access_token, doc = {} }) => {
    try {
      set({
        roleDetailLoading: true,
        roleDetail: null,
        error: null,
      });

      const response = await RolePermissionService.Get_Role_By_Id({
        access_token,
        doc,
      });

      const role = toObject(response);

      set({
        roleDetail: role,
        roleDetailLoading: false,
      });

      return role;
    } catch (error) {
      set({
        roleDetailLoading: false,
        error,
      });

      throw error;
    }
  },

  Create_Role: async ({ access_token, doc = {} }) => {
    try {
      set({
        roleSaving: true,
        error: null,
      });

      const response = await RolePermissionService.Create_Role({
        access_token,
        doc,
      });

      set({
        roleSaving: false,
      });

      return response;
    } catch (error) {
      set({
        roleSaving: false,
        error,
      });

      throw error;
    }
  },

  Update_Role: async ({ access_token, doc = {} }) => {
    try {
      set({
        roleSaving: true,
        error: null,
      });

      const response = await RolePermissionService.Update_Role({
        access_token,
        doc,
      });

      set({
        roleSaving: false,
      });

      return response;
    } catch (error) {
      set({
        roleSaving: false,
        error,
      });

      throw error;
    }
  },

  Remove_Role: async ({ access_token, doc = {} }) => {
    try {
      set({
        roleDeleting: true,
        error: null,
      });

      const response = await RolePermissionService.Remove_Role({
        access_token,
        doc,
      });

      set({
        roleDeleting: false,
      });

      return response;
    } catch (error) {
      set({
        roleDeleting: false,
        error,
      });

      throw error;
    }
  },

  Fetch_Role_User_Options: async ({ access_token, doc = {} }) => {
    try {
      set({
        optionLoading: true,
        error: null,
      });

      const response = await RolePermissionService.Get_Role_User_Options({
        access_token,
        doc,
      });

      set({
        userOptions: toArray(response),
        optionLoading: false,
      });

      return response;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  /**
   * Get the permissions already owned by an employee.
   *
   * These permission IDs will be passed to PermissionPanel
   * and displayed as checked and disabled.
   */
  Fetch_Role_User_Info_By_Id: async ({ access_token, doc = {} }) => {
    const userId = normalizeId(doc.userId || doc.id || doc._id);

    if (!userId) {
      set({
        userPermissionInfo: null,
        userPermissionIds: [],
        userPermissionUserId: null,
        userPermissionLoading: false,
      });

      return {
        userInfo: null,
        permissionIds: [],
      };
    }

    try {
      set({
        userPermissionInfo: null,
        userPermissionIds: [],
        userPermissionUserId: userId,
        userPermissionLoading: true,
        error: null,
      });

      const response = await RolePermissionService.Get_Role_User_Info_By_Id({
        access_token,
        doc: {
          userId,
        },
      });

      /*
       * response.data contains the employee information.
       * response.data.permissions contains permission IDs.
       */
      const userInfo = toObject(response);
      const permissionIds = getUserPermissionIds(response);

      /*
       * Ignore an old API response when the developer
       * selects another employee before this request finishes.
       */
      set((state) => {
        if (state.userPermissionUserId !== userId) {
          return {};
        }

        return {
          userPermissionInfo: userInfo,
          userPermissionIds: permissionIds,
          userPermissionLoading: false,
        };
      });

      return {
        userInfo,
        permissionIds,
      };
    } catch (error) {
      set((state) => {
        if (state.userPermissionUserId !== userId) {
          return {};
        }

        return {
          userPermissionInfo: null,
          userPermissionIds: [],
          userPermissionLoading: false,
          error,
        };
      });

      throw error;
    }
  },

  Fetch_System_Permission_Options: async ({ access_token }) => {
    try {
      set({
        optionLoading: true,
        error: null,
      });

      const response = await RolePermissionService.Get_System_Permission_Options({
        access_token,
      });

      set({
        permissionGroups: toArray(response),
        optionLoading: false,
      });

      return response;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  Fetch_Company_Options: async ({ access_token }) => {
    try {
      set({
        optionLoading: true,
        error: null,
      });

      const response = await RolePermissionService.Get_Company_Options({
        access_token,
      });

      set({
        companyOptions: toArray(response),
        optionLoading: false,
      });

      return response;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  Fetch_Department_Options: async ({ access_token, doc = {} }) => {
    try {
      set({
        optionLoading: true,
        departmentOptions: [],
        error: null,
      });

      const response = await RolePermissionService.Get_Department_Options({
        access_token,
        doc,
      });

      set({
        departmentOptions: toArray(response),
        optionLoading: false,
      });

      return response;
    } catch (error) {
      set({
        optionLoading: false,
        error,
      });

      throw error;
    }
  },

  Clear_Role_Detail: () => {
    set({
      roleDetail: null,
    });
  },

  Clear_Department_Options: () => {
    set({
      departmentOptions: [],
    });
  },

  Clear_User_Permission_Info: () => {
    set({
      userPermissionInfo: null,
      userPermissionIds: [],
      userPermissionUserId: null,
      userPermissionLoading: false,
    });
  },
}));
