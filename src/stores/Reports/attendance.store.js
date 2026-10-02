import { create } from 'zustand';
import dayjs from 'dayjs';

import AttendanceListServices from '../../services/reports/attendance_list';

const getDateRange = (data) => {
  const range = data?.date_attendance || data?.search || null;

  if (!Array.isArray(range) || range.length !== 2) {
    return [null, null];
  }

  return [range[0] || null, range[1] || null];
};

const removeEmptyValues = (data) => {
  return Object.fromEntries(
    Object.entries(data || {}).filter(([, value]) => value !== null && value !== undefined && value !== '')
  );
};

const buildListDoc = (data) => {
  const [startDate, endDate] = getDateRange(data);

  return removeEmptyValues({
    employeeId: data?.employeeId || data?.employee_id || data?.id || null,

    departmentId: data?.departmentId || data?.department_id || null,

    startDate,
    endDate,
  });
};

const buildDetailDoc = (filter) => {
  const range = Array.isArray(filter) ? filter : filter?.date_attendance || filter?.search;

  if (!Array.isArray(range) || range.length !== 2) {
    return {};
  }

  return removeEmptyValues({
    startDate: range[0] || null,

    endDate: range[1] || null,
  });
};

const makeListCacheKey = (filterMonth, pageSize) => {
  const [startDate, endDate] = getDateRange(filterMonth);

  const employeeId = filterMonth?.employeeId || filterMonth?.employee_id || filterMonth?.id || '';

  const departmentId = filterMonth?.departmentId || filterMonth?.department_id || '';

  const mode = filterMonth?.mode || '';

  return [
    `start=${startDate || ''}`,
    `end=${endDate || ''}`,
    `employee=${employeeId}`,
    `department=${departmentId}`,
    `mode=${mode}`,
    `pageSize=${pageSize}`,
  ].join('|');
};

const getMonthLabel = (filter) => {
  const [startDate, endDate] = getDateRange(filter);

  if (!startDate || !endDate) {
    return '';
  }

  const start = dayjs(startDate);

  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return '';
  }

  if (start.format('YYYY-MM') === end.format('YYYY-MM')) {
    return start.format('MMMM YYYY');
  }

  return `${start.format('MMM YYYY')}` + ` To ` + `${end.format('MMM YYYY')}`;
};

const normalizeDailyRow = (row) => {
  const hasOldValue = row?.value !== undefined && row?.value !== null && row?.value !== '';

  const value = hasOldValue ? row.value : row?.note || '';

  const reason = row?.reason !== undefined ? row.reason : hasOldValue ? row?.note || '' : '';

  return {
    ...row,

    id: row?.id || `${row?.employeeCode || ''}-${row?.date || ''}`,

    raw_note: row?.raw_note || row?.note || '',

    value: value === '1/2' ? 'AL1/2' : value,
    note: reason,
    reason,

    date_leave: Array.isArray(row?.date_leave) ? row.date_leave : [],

    date_miss: Array.isArray(row?.date_miss) ? row.date_miss : [],
  };
};

const calculateCount = (days) => {
  const result = {
    count_a: 0,
    count_al: 0,
    count_ul: 0,
    count_ms: 0,
    count_l: 0,
  };

  days.forEach((item) => {
    if (item?.value === 'A') {
      result.count_a += 1;
    }

    if (item?.value === 'L') {
      result.count_l += 1;
    }

    if (item?.value === 'UL') {
      result.count_ul += 1;
    }

    if (item?.value === 'AL') {
      const status = item?.date_leave?.[0]?.status_request;

      if (status === 'afternoon' || status === 'morning') {
        result.count_al += 0.5;
      } else {
        result.count_al += 1;
      }
    }

    if (item?.value === 'MS') {
      const status = item?.date_miss?.[0]?.status_request;

      if (status === 'full day') {
        result.count_ms += 2;
      } else {
        result.count_ms += 1;
      }
    }
  });

  return result;
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};

const normalizeCount = (count, days) => {
  const calculated = calculateCount(days);

  return {
    count_a: toNumber(count?.absent ?? count?.count_a, calculated.count_a),

    count_al: toNumber(count?.al ?? count?.count_al, calculated.count_al),

    count_ul: toNumber(count?.unpaid_leave ?? count?.ul ?? count?.count_ul, calculated.count_ul),

    count_ms: toNumber(count?.miss_scan ?? count?.count_ms, calculated.count_ms),

    count_l: toNumber(count?.late ?? count?.count_l, calculated.count_l),
  };
};

const getOldFullName = (info) => {
  return [info?.first_name || '', info?.last_name || ''].filter(Boolean).join(' ').trim();
};

const normalizeListRow = (item, index, month) => {
  const oldInfo = item?.info || {};

  const employeeId = item?.employee_id || oldInfo?.employee_id || '';

  const name = item?.name || oldInfo?.name || getOldFullName(oldInfo);

  const nameLatin = item?.nameLatin || oldInfo?.nameLatin || '';

  return {
    ...item,

    id: item?.id || item?._id || `${employeeId}-${index}`,

    _id: item?._id || item?.id || '',

    info: {
      ...oldInfo,
      employee_id: employeeId,

      first_name: item?.name || oldInfo?.first_name || oldInfo?.name || '',

      last_name: oldInfo?.last_name || '',

      name,
      nameLatin,
    },

    department_name: item?.department_name || item?.department || '',

    position_name: item?.position_name || item?.position || '',

    month: item?.month || month || '',

    miss_scan: item?.miss_scan ?? item?.missed_scan ?? 0,

    working_days: item?.working_days ?? 0,

    late: item?.late ?? 0,

    day_off: item?.day_off ?? 0,

    al: item?.al ?? 0,

    unpaid_leave: item?.unpaid_leave ?? 0,

    total: item?.total ?? 0,
  };
};

const normalizeExportEmployee = (item, department) => {
  const oldInfo = item?.info || {};

  const employeeId = item?.employee_id || oldInfo?.employee_id || '';

  const name = item?.name || oldInfo?.name || getOldFullName(oldInfo);

  const nameLatin = item?.nameLatin || oldInfo?.nameLatin || '';

  const days = Array.isArray(item?.days) ? item.days.map(normalizeDailyRow) : [];

  return {
    ...item,

    id: item?.id || item?._id || employeeId,

    _id: item?._id || item?.id || '',

    employee_id: employeeId,

    name,
    nameLatin,

    info: {
      ...oldInfo,
      employee_id: employeeId,

      first_name: item?.name || oldInfo?.first_name || oldInfo?.name || '',

      last_name: oldInfo?.last_name || '',

      name,
      nameLatin,
    },

    days,

    department_name: item?.department_name || item?.department || department || '',
  };
};

export const useAttendanceStore = create((set, get) => ({
  attendanceList: [],
  exportAttendance: [],

  listLoading: false,
  exportLoading: false,

  clickAgain: false,

  listCacheKey: null,
  exportCacheKey: null,

  exportDepartment: '',

  detailLoading: false,
  detail: null,
  dataExport: [],

  totalCount: {
    count_a: 0,
    count_al: 0,
    count_ul: 0,
    count_ms: 0,
    count_l: 0,
  },

  error: null,

  setTotalCount: (payload) =>
    set({
      totalCount: payload,
    }),

  clearDetail: () =>
    set({
      detail: null,
      dataExport: [],
    }),

  clearExportAttendance: () =>
    set({
      exportAttendance: [],
      exportCacheKey: null,
      exportDepartment: '',
    }),

  clearListCache: () =>
    set({
      listCacheKey: null,
    }),

  clearExportCache: () =>
    set({
      exportCacheKey: null,
      exportAttendance: [],
      exportDepartment: '',
    }),

  fetchAttendanceList: async ({ filterMonth, pageSize = 10, access_token, force = false }) => {
    const key = makeListCacheKey(filterMonth, pageSize);

    const { listCacheKey, attendanceList } = get();

    if (!force && listCacheKey === key && Array.isArray(attendanceList) && attendanceList.length > 0) {
      return {
        data: attendanceList,
        fromCache: true,
      };
    }

    set({
      listLoading: true,
      clickAgain: true,
      error: null,
    });

    try {
      const doc = buildListDoc(filterMonth);

      const response = await AttendanceListServices.Fetch_Attendance_List({
        doc,
        access_token,
      });

      const month = getMonthLabel(filterMonth);

      const list = Array.isArray(response?.data)
        ? response.data.map((item, index) => normalizeListRow(item, index, month))
        : [];

      set({
        attendanceList: list,

        listCacheKey: key,

        error: null,
      });

      return {
        ...response,
        data: list,
      };
    } catch (error) {
      set({
        attendanceList: [],
        listCacheKey: null,
        error,
      });

      throw error;
    } finally {
      set({
        listLoading: false,
        clickAgain: false,
      });
    }
  },

  fetchDailyReport: async ({ filter, employee_id, access_token, department = '' }) => {
    set({
      detailLoading: true,
      clickAgain: true,
      error: null,
    });

    try {
      const doc = buildDetailDoc(filter);

      const response = await AttendanceListServices.Fetch_Daily_Attendance_Report({
        doc,
        employee_id,
        access_token,
      });

      const days = Array.isArray(response?.data) ? response.data.map(normalizeDailyRow) : [];

      const firstDay = days?.[0] || {};

      const info = {
        _id: employee_id,

        employee_id: firstDay?.employeeCode || '',

        first_name: firstDay?.name || '',

        last_name: '',

        name: firstDay?.name || '',

        nameLatin: firstDay?.nameLatin || '',
      };

      const count = normalizeCount(response?.count, days);

      const detail =
        days.length > 0
          ? {
              id: employee_id,

              _id: employee_id,

              info,
              days,
              count,

              department_name: response?.department || department || '',
            }
          : null;

      const detailExport = detail
        ? [
            {
              ...detail,

              employee_id: info.employee_id,

              name: info.name,

              nameLatin: info.nameLatin,
            },
          ]
        : [];

      set({
        detail,
        dataExport: detailExport,

        totalCount: count,

        error: null,
      });

      return {
        ...response,
        data: days,
        count,
      };
    } catch (error) {
      set({
        detail: null,
        dataExport: [],

        totalCount: {
          count_a: 0,
          count_al: 0,
          count_ul: 0,
          count_ms: 0,
          count_l: 0,
        },

        error,
      });

      throw error;
    } finally {
      set({
        detailLoading: false,
        clickAgain: false,
      });
    }
  },

  exportAttendanceList: async ({ filterMonth, pageSize = 10, access_token, force = false }) => {
    const key = makeListCacheKey(filterMonth, pageSize);

    const { exportCacheKey, exportAttendance } = get();

    if (!force && exportCacheKey === key && Array.isArray(exportAttendance) && exportAttendance.length > 0) {
      return {
        data: exportAttendance,

        department: get().exportDepartment,

        fromCache: true,
      };
    }

    set({
      exportLoading: true,
      clickAgain: true,
      error: null,
    });

    try {
      const doc = buildListDoc(filterMonth);

      const response = await AttendanceListServices.Export_Attendance_List({
        doc,
        access_token,
      });

      const department = response?.department || filterMonth?.departmentLabel || '';

      const list = Array.isArray(response?.data)
        ? response.data.map((item) => normalizeExportEmployee(item, department))
        : [];

      set({
        exportAttendance: list,

        exportDepartment: department,

        exportCacheKey: key,

        error: null,
      });

      return {
        ...response,
        data: list,
        department,
      };
    } catch (error) {
      set({
        exportAttendance: [],
        exportDepartment: '',
        exportCacheKey: null,
        error,
      });

      throw error;
    } finally {
      set({
        exportLoading: false,
        clickAgain: false,
      });
    }
  },
}));
