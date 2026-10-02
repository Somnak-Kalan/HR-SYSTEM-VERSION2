import { create } from 'zustand';
import AttendanceRuleService from '../../services/employeeSchedule/attendanceRule';

const defaultListDoc = {
  search: '',
};

const getRowId = (row) => row?._id || row?.id;

const normalizeAttendanceRule = (item) => {
  if (!item) return null;

  return {
    ...item,
    id: item?._id || item?.id,
    _id: item?._id || item?.id,
    attendance_rule_name: item?.attendance_rule_name || '',
    time_control: item?.time_control || 'scan_in',
    duration: item?.duration ?? 0,
    round_off_control: item?.round_off_control || 'round_off',
    break_time: item?.break_time || {},
    type: item?.type || 'normal',
    status: item?.status,
    createdAt: item?.createdAt || item?.created_at,
    updatedAt: item?.updatedAt || item?.updated_at,
  };
};

const normalizeList = (res) => {
  const list = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.rows)
      ? res.rows
      : Array.isArray(res?.rules)
        ? res.rules
        : Array.isArray(res)
          ? res
          : [];

  return list.map(normalizeAttendanceRule).filter(Boolean);
};

const normalizeDetail = (res) => {
  const rec = res?.rec || res?.data || res?.rule || res;
  return normalizeAttendanceRule(rec);
};

export const useAttendanceRuleStore = create((set, get) => ({
  loading: false,
  btn_loading: false,
  detail_loading: false,

  list: [],
  selectedRowKeys: [],
  selected: null,

  lastListDoc: defaultListDoc,
  lastListDocKey: '',

  setSelectedRowKeys: (keys) => {
    set({
      selectedRowKeys: Array.isArray(keys) ? keys : [],
    });
  },

  setSelected: (row) => {
    set({
      selected: normalizeAttendanceRule(row),
    });
  },

  clearSelection: () => {
    set({
      selectedRowKeys: [],
      selected: null,
    });
  },

  fetchAttendanceRules: async ({ access_token, doc = defaultListDoc, force = false }) => {
    if (!access_token) return false;

    const listDoc = {
      ...defaultListDoc,
      ...(doc || {}),
    };

    const key = JSON.stringify(listDoc);
    const { lastListDocKey } = get();

    if (!force && lastListDocKey === key) {
      return true;
    }

    try {
      set({
        loading: true,
        lastListDoc: listDoc,
        lastListDocKey: key,
      });

      const res = await AttendanceRuleService.Get_Attendance_Rule({
        access_token,
        doc: listDoc,
      });

      const rows = normalizeList(res);

      set({
        list: rows,
      });

      const selectedId = getRowId(get().selected);

      if (selectedId && !rows.some((row) => getRowId(row) === selectedId)) {
        get().clearSelection();
      }

      return true;
    } catch (e) {
      console.log(e);
      set({ list: [] });
      get().clearSelection();
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getAttendanceRuleById: async ({ access_token, id }) => {
    if (!access_token || !id) return null;

    try {
      set({ detail_loading: true });

      const res = await AttendanceRuleService.Get_Attendance_Rule_By_ID({
        access_token,
        id,
      });

      const rec = normalizeDetail(res);

      if (rec) {
        set({
          selected: rec,
          selectedRowKeys: [getRowId(rec)],
        });
      }

      return rec;
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      set({ detail_loading: false });
    }
  },

  createAttendanceRule: async ({ access_token, doc }) => {
    if (!access_token || !doc) return false;

    try {
      set({ btn_loading: true });

      const res = await AttendanceRuleService.Create_Attendance_Rule({
        access_token,
        doc,
      });

      await get().fetchAttendanceRules({
        access_token,
        doc: get().lastListDoc || defaultListDoc,
        force: true,
      });

      return res;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  updateAttendanceRule: async ({ access_token, id, doc }) => {
    if (!access_token || !id || !doc) return false;

    try {
      set({ btn_loading: true });

      const res = await AttendanceRuleService.Update_Attendance_Rule({
        access_token,
        id,
        doc,
      });

      await get().fetchAttendanceRules({
        access_token,
        doc: get().lastListDoc || defaultListDoc,
        force: true,
      });

      get().clearSelection();

      return res;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  removeAttendanceRule: async ({ access_token, id }) => {
    if (!access_token || !id) return false;

    try {
      set({ btn_loading: true });

      const res = await AttendanceRuleService.Remove_Attendance_Rule({
        access_token,
        id,
      });

      await get().fetchAttendanceRules({
        access_token,
        doc: get().lastListDoc || defaultListDoc,
        force: true,
      });

      get().clearSelection();

      return res || true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },
}));
