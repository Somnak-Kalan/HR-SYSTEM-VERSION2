import httpCommon from 'utils/http-common';

const LATE_BASE = '/late';
const LEAVE_BASE = '/leave';

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

const createLate = async (payload) => {
  const response = await httpCommon.post(`${LATE_BASE}/create`, payload?.doc || {}, getConfig(payload));

  return response.data;
};

const updateLate = async (payload) => {
  const { id, doc } = payload || {};

  if (!id) {
    throw new Error('Late request ID is required');
  }

  const response = await httpCommon.put(`${LATE_BASE}/${id}`, doc || {}, getConfig(payload));

  return response.data;
};

const getLateList = async (payload) => {
  try {
    const response = await httpCommon.post(`${LATE_BASE}/list`, payload?.doc || {}, getConfig(payload));

    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        data: [],
        total: 0,
        page: payload?.doc?.page || 1,
        size: payload?.doc?.size || 10,
      };
    }

    throw error;
  }
};

const getLateById = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Late request ID is required');
  }

  const response = await httpCommon.get(`${LATE_BASE}/list/${id}`, getConfig(payload));

  return response.data;
};

const removeLate = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Late request ID is required');
  }

  const response = await httpCommon.delete(`${LATE_BASE}/${id}`, getConfig(payload));

  return response.data;
};

const getEmployeeInfo = async (payload) => {
  const { employeeId } = payload || {};

  if (!employeeId) {
    throw new Error('Employee ID is required');
  }

  const response = await httpCommon.get(`${LEAVE_BASE}/employee-info/${employeeId}`, getConfig(payload));

  return response.data;
};

const getEmployeeOptions = async (payload) => {
  const response = await httpCommon.post(
    `${LEAVE_BASE}/employee-options`,
    {
      search: String(payload?.search || '').trim(),
    },
    getConfig(payload)
  );

  return response.data;
};

export default {
  createLate,
  updateLate,
  getLateList,
  getLateById,
  removeLate,
  getEmployeeInfo,
  getEmployeeOptions,
};
