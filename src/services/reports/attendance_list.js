import httpCommon from 'utils/http-common';

const BASE_URL = '/attendance-list';

const getToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token)
    .trim()
    .replace(/^Bearer\s+/i, '');
};

const getConfig = (payload) => {
  const token = getToken(payload);

  if (!token) {
    throw new Error('Access token is missing');
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const get = async (url, payload = {}) => {
  const response = await httpCommon.get(url, getConfig(payload));

  return response.data;
};

const post = async (url, payload = {}) => {
  const doc = payload?.doc || {};

  const response = await httpCommon.post(url, doc, getConfig(payload));

  return response.data;
};

const Get_Department_Options = (payload) => get(`${BASE_URL}/department-options`, payload);

const Get_Employee_Options = (payload) => post(`${BASE_URL}/employee-options`, payload);

const Fetch_Attendance_List = (payload) => post(`${BASE_URL}/list`, payload);

const Export_Attendance_List = (payload) => post(`${BASE_URL}/export`, payload);

const Fetch_Daily_Attendance_Report = (payload) => {
  const { employee_id, ...requestPayload } = payload || {};

  if (!employee_id) {
    throw new Error('Employee ID is missing');
  }

  return post(`${BASE_URL}/list/${employee_id}`, requestPayload);
};

const AttendanceListServices = {
  Get_Department_Options,
  Get_Employee_Options,
  Fetch_Attendance_List,
  Export_Attendance_List,
  Fetch_Daily_Attendance_Report,
};

export default AttendanceListServices;
