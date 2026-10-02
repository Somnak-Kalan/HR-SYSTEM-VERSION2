import { create } from 'zustand';
import AttendanceReportServices from '../../services/reports/attendance_report';
const cache = new Map();
const CACHE_LIMIT = 20;

const setCache = (key, value) => {
  cache.set(key, value);
  if (cache.size > CACHE_LIMIT) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
};
export const useAttendanceReportStore = create((set, get) => {
  let reqSeq = 0;
  let controller = null;

  const run = async (key, fn) => {
    if (key && cache.has(key)) {
      set({ reports: cache.get(key), loading: false, error: null });
      return;
    }

    reqSeq += 1;
    const seq = reqSeq;

    try {
      controller?.abort?.();
    } catch (_) {}
    controller = new AbortController();

    set({ loading: true, error: null });

    try {
      const data = await fn(controller.signal);
      if (seq !== reqSeq) return;

      const reports = Array.isArray(data?.data) ? data.data : [];
      set({ reports, loading: false, error: null });
      if (key) setCache(key, reports);
    } catch (error) {
      if (seq !== reqSeq) return;
      set({ loading: false, error });
    }
  };

  return {
    reports: [],
    loading: false,
    error: null,
    clear: () => set({ reports: [], error: null, loading: false }),
    /**
     *  fetchRange = FULL MONTH
     */
    fetchRange: async ({ doc1, access_token }) => {
      const doc = { search: doc1?.search, employee_id: doc1?.employee_id };
      if (doc.search === undefined) return;
      set({ loading: true, error: null });
      try {
        const res = await AttendanceReportServices.Search_Attendance_By_Select_Range({ doc, access_token });
        const reports = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
        set({ reports, loading: false, error: null });
      } catch (error) {
        set({ loading: false, error });
      } finally {
        set({ loading: false, error: null });
      }
    },
    /**
     * fetchMonth = FLEXIBLE (25→24)
     * doc.search = [from,to]
     */
    fetchMonth: async ({ doc1, access_token }) => {
      const doc = { date_attendance: doc1?.date_attendance, employee_id: doc1?.employee_id };
      set({ loading: true, error: null });
      try {
        const res = await AttendanceReportServices.Search_Month_Attendance_Report({ doc, access_token });

        const reports = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];

        set({ reports, loading: false, error: null });
      } catch (error) {
        set({ loading: false, error });
      } finally {
        set({ loading: false, error: null });
      }
    },
  };
});
