import httpCommon from 'utils/http-common';

const LEAVE_BASE = '/leave';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token)
    .trim()
    .replace(/^Bearer\s+/i, '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const getConfig = (payload) => ({
  headers: getAuthHeaders(payload),
});

const Create_Leave = async (payload) => {
  const { doc } = payload || {};

  const response = await httpCommon.post(`${LEAVE_BASE}/create`, doc, getConfig(payload));

  return response.data;
};

const Update_Leave = async (payload) => {
  const { id, doc } = payload || {};

  if (!id) {
    throw new Error('Leave ID is required');
  }

  const response = await httpCommon.put(`${LEAVE_BASE}/${id}`, doc, getConfig(payload));

  return response.data;
};

const Get_Leave_List = async (payload) => {
  const { doc } = payload || {};

  const response = await httpCommon.post(`${LEAVE_BASE}/list`, doc, getConfig(payload));

  return response.data;
};

const Get_Leave_By_ID = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Leave ID is required');
  }

  const response = await httpCommon.get(`${LEAVE_BASE}/list/${id}`, getConfig(payload));

  return response.data;
};

const Remove_Leave = async (payload) => {
  const { id } = payload || {};

  if (!id) {
    throw new Error('Leave ID is required');
  }

  const response = await httpCommon.delete(`${LEAVE_BASE}/${id}`, getConfig(payload));

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
  const { search } = payload || {};

  const response = await httpCommon.post(
    `${LEAVE_BASE}/employee-options`,
    {
      search: String(search || '').trim(),
    },
    getConfig(payload)
  );

  return response.data;
};

export default {
  Create_Leave,
  Update_Leave,
  Get_Leave_List,
  Get_Leave_By_ID,
  Remove_Leave,
  Get_Employee_Info,
  Get_Employee_Options,
};
