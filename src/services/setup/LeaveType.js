import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return token.replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
    'Content-Type': 'application/json',
  };
};

const Create_Leave_Type = async (payload) => {
  try {
    const res = await httpCommon.post('/leave-type/create', payload?.doc || {}, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Get_Leave_Type = async (payload) => {
  try {
    const doc = {
      search: payload?.doc?.search || '',
    };

    const res = await httpCommon.post('/leave-type/list', doc, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Get_Leave_Type_By_Id = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.get(`/leave-type/${id}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Update_Leave_Type = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;
    const formData = payload?.doc?.formData || payload?.doc || {};

    const res = await httpCommon.put(`/leave-type/${id}`, formData, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Remove_Leave_Type = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.delete(`/leave-type/${id}`, {
      headers: getAuthHeaders(payload),
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
const Apply_Leave_Type = async (payload) => {
  try {
    const res = await httpCommon.post('/leave-type/apply', payload?.doc || {}, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
const Get_Employee_Options = async (payload) => {
  try {
    const res = await httpCommon.post('/leave-type/employee-options', payload?.doc || {}, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Get_Department_Options = async (payload) => {
  try {
    const res = await httpCommon.post('/leave-type/department-options', payload?.doc || {}, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
const LeaveTypeService = {
  Create_Leave_Type,
  Get_Leave_Type,
  Get_Leave_Type_By_Id,
  Update_Leave_Type,
  Remove_Leave_Type,
  Apply_Leave_Type,
  Get_Employee_Options,
  Get_Department_Options,
};

export default LeaveTypeService;
