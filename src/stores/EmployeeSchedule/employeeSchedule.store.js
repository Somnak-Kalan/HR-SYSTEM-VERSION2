import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import EmployeeScheduleService from '../../services/employeeSchedule/employeeSchedule';

const defaultScheduleDoc = {
  search: '',
};

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.employees)) return res.employees;
  if (Array.isArray(res?.employee)) return res.employee;
  if (Array.isArray(res?.employee_list)) return res.employee_list;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.rows)) return res.rows;

  return [];
};

const normalizeSchedule = (item) => {
  if (!item) return null;

  const id = item?._id || item?.id || item?.shift_management_id;

  return {
    ...item,
    id,
    _id: item?._id || id,
    shift_management_id: item?.shift_management_id || id,
    shift_name: item?.shift_name || item?.label || '-',
    employee:
      item?.employee ??
      item?.employee_count ??
      item?.total_employee ??
      item?.employees?.length ??
      item?.employee_list?.length ??
      item?.data?.length ??
      0,
    employees: Array.isArray(item?.employees)
      ? item.employees
      : Array.isArray(item?.employee_list)
        ? item.employee_list
        : Array.isArray(item?.data)
          ? item.data
          : [],
  };
};

const normalizeScheduleDetail = (res) => {
  const rows = toArray(res);

  const base =
    res?.data && !Array.isArray(res.data) && typeof res.data === 'object'
      ? res.data
      : res && !Array.isArray(res) && typeof res === 'object'
        ? res
        : {};

  return {
    ...base,
    data: rows,
    employees: rows,
    employee: rows.length,
    total_employee: rows.length,
  };
};

export const useEmployeeScheduleStore = create(
  devtools((set, get) => ({
    schedules: [],
    selectedSchedule: null,

    loading: false,
    detailLoading: false,
    btn_loading: false,
    error: null,

    lastScheduleDoc: defaultScheduleDoc,

    fetchSchedules: async (payload) => {
      const access_token = typeof payload === 'string' ? payload : payload?.access_token;

      const doc = typeof payload === 'object' ? payload?.doc || defaultScheduleDoc : defaultScheduleDoc;

      if (!access_token) return false;

      set({
        loading: true,
        error: null,
        lastScheduleDoc: doc,
      });

      try {
        const res = await EmployeeScheduleService.List_Employee_Schedule({
          access_token,
          doc,
        });

        const rows = toArray(res).map(normalizeSchedule).filter(Boolean);

        set({
          schedules: rows,
          loading: false,
        });

        return rows;
      } catch (e) {
        console.log(e);

        set({
          loading: false,
          error: e,
          schedules: [],
        });

        return false;
      }
    },

    fetchScheduleDetail: async ({ access_token, id, doc = { search: '' } }) => {
      if (!access_token || !id) return null;

      set({
        detailLoading: true,
        error: null,
      });

      try {
        const res = await EmployeeScheduleService.List_Employee_Schedule_Detail({
          access_token,
          id,
          doc,
        });

        const data = normalizeScheduleDetail(res);

        set({
          selectedSchedule: data,
        });

        return data;
      } catch (e) {
        console.log(e);

        set({
          error: e,
        });

        return null;
      } finally {
        set({
          detailLoading: false,
        });
      }
    },

    applyShiftToDept: async ({ department_id, shift_management_id, user }, access_token) => {
      if (!department_id || !shift_management_id || !access_token) return false;

      const doc = {
        department_id,
        shift_management_id,
      };

      if (user) {
        doc.user = user;
      }

      try {
        set({
          btn_loading: true,
          error: null,
        });

        const res = await EmployeeScheduleService.Apply_Shift_To_Dept({
          doc,
          access_token,
        });

        await get().fetchSchedules({
          access_token,
          doc: get().lastScheduleDoc || defaultScheduleDoc,
        });

        return res || true;
      } catch (e) {
        console.log(e);

        set({
          error: e,
        });

        return false;
      } finally {
        set({
          btn_loading: false,
        });
      }
    },

    applyShiftToEmployee: async ({ employee_id, shift_management_id, user }, access_token) => {
      if (!employee_id || !shift_management_id || !access_token) return false;

      const doc = {
        employee_id,
        shift_management_id,
      };

      if (user) {
        doc.user = user;
      }

      try {
        set({
          btn_loading: true,
          error: null,
        });

        const res = await EmployeeScheduleService.Apply_Shift_Mgmt_To_Employee({
          doc,
          access_token,
        });

        await get().fetchSchedules({
          access_token,
          doc: get().lastScheduleDoc || defaultScheduleDoc,
        });

        return res || true;
      } catch (e) {
        console.log(e);

        set({
          error: e,
        });

        return false;
      } finally {
        set({
          btn_loading: false,
        });
      }
    },
  }))
);
