import { create } from 'zustand';
import AppLoginService from '../services/setup/appLogin';

const defaultListDoc = {
  search: '',
  page: 1,
  size: 10,
};

const normalizeUsers = (res) => {
  if (Array.isArray(res?.users)) return res.users;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.users)) return res.data.users;
  if (Array.isArray(res)) return res;
  return [];
};

const normalizeTotal = (res) => {
  return Number(
    res?.total ||
      res?.data?.total ||
      res?.pagination?.total ||
      res?.data?.pagination?.total ||
      normalizeUsers(res).length ||
      0
  );
};

const normalizePage = (res) => {
  return Number(res?.page || res?.data?.page || res?.pagination?.page || res?.data?.pagination?.page || 1);
};

const normalizeSize = (res) => {
  return Number(res?.size || res?.data?.size || res?.pagination?.size || res?.data?.pagination?.size || 10);
};

const normalizeTotalPage = (res) => {
  return Number(
    res?.totalPage ||
      res?.data?.totalPage ||
      res?.pagination?.totalPage ||
      res?.data?.pagination?.totalPage ||
      Math.ceil(normalizeTotal(res) / normalizeSize(res)) ||
      1
  );
};

export const useAppLoginStore = create((set, get) => ({
  loading: false,
  btn_loading: false,

  user_list: [],
  totalUsers: 0,
  apiPage: 1,
  apiSize: 10,
  totalPage: 1,

  selectedRowKeys: [],
  selected: null,

  usersFetchedAt: 0,
  lastUsersDocKey: '',

  setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),
  setSelected: (row) => set({ selected: row }),

  fetchUsers: async ({ access_token, doc = defaultListDoc, force = false }) => {
    const listDoc = {
      ...defaultListDoc,
      ...(doc || {}),
    };

    const key = JSON.stringify(listDoc);
    const { user_list, lastUsersDocKey } = get();

    if (!force && lastUsersDocKey === key && Array.isArray(user_list) && user_list.length > 0) {
      return true;
    }

    try {
      set({ loading: true });

      const res = await AppLoginService.Get_User({
        access_token,
        doc: listDoc,
      });

      set({
        user_list: normalizeUsers(res),
        totalUsers: normalizeTotal(res),
        apiPage: normalizePage(res),
        apiSize: normalizeSize(res),
        totalPage: normalizeTotalPage(res),
        usersFetchedAt: Date.now(),
        lastUsersDocKey: key,
      });

      return true;
    } catch (e) {
      console.log(e);
      set({
        user_list: [],
        totalUsers: 0,
        apiPage: 1,
        apiSize: 10,
        totalPage: 1,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  registerUser: async ({ access_token, doc }) => {
    try {
      set({ btn_loading: true });

      await AppLoginService.Register({
        access_token,
        doc,
      });

      await get().fetchUsers({
        access_token,
        doc: defaultListDoc,
        force: true,
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  changePassword: async ({ access_token, doc }) => {
    try {
      set({ btn_loading: true });

      await AppLoginService.Change_Password({
        access_token,
        doc,
      });

      await get().fetchUsers({
        access_token,
        doc: defaultListDoc,
        force: true,
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  updateStatus: async ({ access_token, doc }) => {
    try {
      set({ btn_loading: true });

      await AppLoginService.Update_Status({
        access_token,
        doc,
      });

      await get().fetchUsers({
        access_token,
        doc: defaultListDoc,
        force: true,
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  deleteAppLogin: async ({ access_token, id }) => {
    try {
      set({ btn_loading: true });

      const res = await AppLoginService.Delete_AppLogin({
        access_token,
        id,
      });

      if (res) {
        await get().fetchUsers({
          access_token,
          doc: defaultListDoc,
          force: true,
        });

        set({
          selected: null,
          selectedRowKeys: [],
        });
      }

      return res;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  resetDeviceId: async ({ access_token, id }) => {
    try {
      set({ btn_loading: true });

      const res = await AppLoginService.Reset_Device_ID({
        access_token,
        id,
      });

      await get().fetchUsers({
        access_token,
        doc: defaultListDoc,
        force: true,
      });

      const selected = get().selected;

      if (selected?.id === id || selected?._id === id) {
        set({
          selected: {
            ...selected,
            deviceId: '',
            deviceID: '',
          },
        });
      }

      return res || true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },
}));
