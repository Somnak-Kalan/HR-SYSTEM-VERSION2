import { create } from 'zustand';
import HolidayServices from '../services/setup/holiday';

const getId = (item) => item?.id || item?._id;

const normalizeHoliday = (item) => {
  if (!item) return undefined;

  return {
    ...item,
    id: getId(item),
  };
};

const unwrapListResponse = (res) => {
  const list = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res)
        ? res
        : [];

  return {
    list: list.map(normalizeHoliday),
    total: res?.total || res?.data?.total || list.length,
    page: res?.page || res?.data?.page || 1,
    size: res?.size || res?.data?.size || 10,
    totalPage: res?.totalPage || res?.data?.totalPage || 1,
  };
};

const unwrapOne = (res) => {
  if (res?.data?.data && !Array.isArray(res.data.data)) return res.data.data;
  if (res?.data && !Array.isArray(res.data)) return res.data;
  return res;
};

export const useHolidayStore = create((set, get) => ({
  loading: false,
  btn_loading: false,
  detail_loading: false,

  holiday_list: [],
  holiday_detail: undefined,

  selectedRowKeys: [],
  selected: undefined,

  total: 0,
  page: 1,
  size: 10,
  totalPage: 1,

  lastSearch: '',
  holidaysFetchedAt: 0,

  setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),

  setSelected: (row) =>
    set({
      selected: normalizeHoliday(row),
    }),

  clearSelected: () =>
    set({
      selectedRowKeys: [],
      selected: undefined,
      holiday_detail: undefined,
    }),

  fetchHolidays: async ({ access_token, search = '', page = 1, size = 10 }) => {
    if (!access_token) return false;

    set({ loading: true });

    try {
      const res = await HolidayServices.Get_Holiday({
        access_token,
        search,
        page,
        size,
      });

      const data = unwrapListResponse(res);

      set({
        holiday_list: data.list,
        total: data.total,
        page: data.page,
        size: data.size,
        totalPage: data.totalPage,
        lastSearch: search,
        holidaysFetchedAt: Date.now(),
      });

      return true;
    } catch (error) {
      console.log(error);

      set({
        holiday_list: [],
        total: 0,
        page: 1,
        totalPage: 1,
      });

      return false;
    } finally {
      set({ loading: false });
    }
  },

  getHolidayById: async ({ access_token, id }) => {
    if (!access_token || !id) return undefined;

    set({
      detail_loading: true,
      holiday_detail: undefined,
    });

    try {
      const res = await HolidayServices.Get_Holiday_By_Id({
        access_token,
        id,
      });

      const detail = normalizeHoliday(unwrapOne(res));

      set({
        holiday_detail: detail,
      });

      return detail;
    } catch (error) {
      console.log(error);
      return undefined;
    } finally {
      set({ detail_loading: false });
    }
  },

  createHoliday: async ({ access_token, doc }) => {
    if (!access_token || !doc) return false;

    set({ btn_loading: true });

    try {
      await HolidayServices.Create_Holiday({
        doc,
        access_token,
      });

      const { lastSearch, page, size } = get();

      await get().fetchHolidays({
        access_token,
        search: lastSearch,
        page,
        size,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  updateHoliday: async ({ access_token, doc }) => {
    const id = doc?.id;

    if (!access_token || !id) return false;

    const { id: removeId, _id, ...body } = doc;

    set({ btn_loading: true });

    try {
      await HolidayServices.Update_Holiday({
        id,
        doc: body,
        access_token,
      });

      const { lastSearch, page, size } = get();

      await get().fetchHolidays({
        access_token,
        search: lastSearch,
        page,
        size,
      });

      set({
        selectedRowKeys: [],
        selected: undefined,
        holiday_detail: undefined,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  removeHoliday: async ({ access_token, id }) => {
    if (!access_token || !id) return false;

    set({ btn_loading: true });

    try {
      await HolidayServices.Remove_Holiday({
        id,
        access_token,
      });

      const { lastSearch, page, size } = get();

      await get().fetchHolidays({
        access_token,
        search: lastSearch,
        page,
        size,
      });

      set({
        selectedRowKeys: [],
        selected: undefined,
        holiday_detail: undefined,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },
}));
