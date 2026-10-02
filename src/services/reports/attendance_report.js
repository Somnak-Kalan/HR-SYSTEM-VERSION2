import httpCommon from 'utils/http-common';
const post = async (url, payload) => {
  const { doc, access_token } = payload || {};
  const res = await httpCommon.post(url, doc, {
    headers: { token: access_token },
  });
  return res.data;
};
const Fetch_Attendance_Report = async (payload) => {
  return post('/hr/attendance_report', payload);
};
const Search_Month_Attendance_Report = async (payload) => {
  return post('/hr/attendance_report', payload);
};
// FLEXIBLE / DATE RANGE
const Search_Attendance_By_Select_Range = async (payload) => {
  return post('/hr/attendance_date_range', payload);
};

const AttendanceReportServices = {
  Fetch_Attendance_Report,
  Search_Month_Attendance_Report,
  Search_Attendance_By_Select_Range,
};

export default AttendanceReportServices;
