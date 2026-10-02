import { create } from 'zustand';
import ShiftManagementService from '../../services/employeeSchedule/shiftManagement';
import AttendanceRuleService from '../../services/employeeSchedule/attendanceRule';
import { useEmployeeScheduleStore } from './employeeSchedule.store';
const defaultListDoc = {
  search: '',
};

const getRowId = (row) => row?._id || row?.id;

const normalizeShift = (item) => {
  if (!item) return null;

  return {
    ...item,
    id: item?._id || item?.id,
    _id: item?._id || item?.id,
    shift_name: item?.shift_name || '',
    attendance_rule_ids: item?.attendance_rule_ids || item?.attendance_rule_id || item?.attendanceRuleIds || [],
    attendance: item?.attendance || {},
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
      : Array.isArray(res?.shifts)
        ? res.shifts
        : Array.isArray(res)
          ? res
          : [];

  return list.map(normalizeShift).filter(Boolean);
};

const normalizeDetail = (res) => {
  const rec = res?.rec || res?.data || res?.shift || res;
  return normalizeShift(rec);
};

export const useShiftManagementStore = create((set, get) => ({
  loading: false,
  btn_loading: false,
  detail_loading: false,

  list: [],
  attendance_rules: [],

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
      selected: normalizeShift(row),
    });
  },

  clearSelection: () => {
    set({
      selectedRowKeys: [],
      selected: null,
    });
  },

  fetchShifts: async ({ access_token, doc = defaultListDoc, force = false }) => {
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

      const res = await ShiftManagementService.Get_Shift_Management({
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

  getShiftById: async ({ access_token, id }) => {
    if (!access_token || !id) return null;

    try {
      set({ detail_loading: true });

      const res = await ShiftManagementService.Get_Shift_Management_By_ID({
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

  fetchAttendanceRules: async ({ access_token }) => {
    if (!access_token) return false;

    try {
      const res = await AttendanceRuleService.Get_Attendance_Rule({
        access_token,
        doc: {
          search: '',
        },
      });

      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      set({
        attendance_rules: rows.map((item) => ({
          ...item,
          id: item?._id || item?.id,
          _id: item?._id || item?.id,
        })),
      });

      return true;
    } catch (e) {
      console.log(e);
      set({ attendance_rules: [] });
      return false;
    }
  },

  createShift: async ({ access_token, doc }) => {
    if (!access_token || !doc) return false;

    try {
      set({ btn_loading: true });

      const res = await ShiftManagementService.Create_Shift_Management({
        access_token,
        doc,
      });

      await get().fetchShifts({
        access_token,
        doc: get().lastListDoc || defaultListDoc,
        force: true,
      });

      await useEmployeeScheduleStore.getState().fetchSchedules({
        access_token,
        doc: {
          search: '',
        },
      });

      return res;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ btn_loading: false });
    }
  },

  updateShift: async ({ access_token, id, doc }) => {
    if (!access_token || !id || !doc) return false;

    try {
      set({ btn_loading: true });

      const res = await ShiftManagementService.Update_Shift_Management({
        access_token,
        id,
        doc,
      });

      await get().fetchShifts({
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

  removeShift: async ({ access_token, id }) => {
    if (!access_token || !id) return false;

    try {
      set({ btn_loading: true });

      const res = await ShiftManagementService.Remove_Shift_Management({
        access_token,
        id,
      });

      await get().fetchShifts({
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
