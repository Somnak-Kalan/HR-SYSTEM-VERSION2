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

// [Create_Position]
const Create_Position = async (payload) => {
  try {
    const res = await httpCommon.post('/position/create', payload?.doc || {}, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

// [Get_Position_By_Id]
const Get_Position_By_Id = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.get(`/position/${id}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

// [Update_Position]
const Update_Position = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;
    const formData = payload?.doc?.formData || payload?.doc || {};

    const res = await httpCommon.put(`/position/${id}`, formData, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

// [Get_Position]
const Get_Position = async (payload) => {
  try {
    const doc = {
      search: payload?.doc?.search || '',
      page: payload?.doc?.page || 1,
      size: payload?.doc?.size || 10,
    };

    const res = await httpCommon.post('/position/list', doc, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

// [Remove_Position]
const Remove_Position = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.delete(`/position/${id}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const PositionService = {
  Create_Position,
  Get_Position_By_Id,
  Update_Position,
  Remove_Position,
  Get_Position,
};

export default PositionService;
