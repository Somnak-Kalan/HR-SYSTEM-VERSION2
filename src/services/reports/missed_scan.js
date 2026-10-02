import httpCommon from 'utils/http-common';

const MISS_SCAN_BASE = '/miss-scan';
const LEAVE_BASE = '/leave';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token)
    .trim()
    .replace(/^Bearer\s+/i, '');
};

const getConfig = (payload) => {
  const accessToken = getAccessToken(payload);

  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const Add_Missed_Scan = async (payload) => {
  const response = await httpCommon.post(`${MISS_SCAN_BASE}/create`, payload?.doc || {}, getConfig(payload));

  return response.data;
};

const Update_Missed_Scan = async (payload) => {
  const { id, doc } = payload || {};

  if (!id) {
    throw new Error('Missed scan ID is required');
  }

  const response = await httpCommon.put(`${MISS_SCAN_BASE}/${id}`, doc || {}, getConfig(payload));

  return response.data;
};

const Fetch_Request_Missed_Scan_List = async (payload) => {
  try {
    const response = await httpCommon.post(`${MISS_SCAN_BASE}/list`, payload?.doc || {}, getConfig(payload));

    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        data: [],
      };
    }

    throw error;
  }
};

const Get_Missed_Scan_By_ID = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Missed scan ID is required');
  }

  const response = await httpCommon.get(`${MISS_SCAN_BASE}/list/${id}`, getConfig(payload));

  return response.data;
};

const Remove_Missed_Scan = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Missed scan ID is required');
  }

  const response = await httpCommon.delete(`${MISS_SCAN_BASE}/${id}`, getConfig(payload));

  return response.data;
};

const Get_Employee_Info = async (payload) => {
  const { employeeId } = payload || {};

  if (!employeeId) {
    throw new Error('Employee ID is required');
  }

  const response = await httpCommon.get(`${LEAVE_BASE}/employee-info/${employeeId}`, getConfig(payload));

  return response.data;
};

const Get_Employee_Options = async (payload) => {
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
  Add_Missed_Scan,
  Update_Missed_Scan,
  Fetch_Request_Missed_Scan_List,
  Get_Missed_Scan_By_ID,
  Remove_Missed_Scan,
  Get_Employee_Info,
  Get_Employee_Options,
};
