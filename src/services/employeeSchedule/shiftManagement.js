import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token)
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
  };
};

const Create_Shift_Management = async (payload) => {
  const res = await httpCommon.post('/shift-management/create', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Shift_Management = async (payload) => {
  const res = await httpCommon.post(
    '/shift-management/list',
    payload?.doc || {
      search: '',
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Get_Shift_Management_By_ID = async (payload) => {
  const res = await httpCommon.get(`/shift-management/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_Shift_Management = async (payload) => {
  const res = await httpCommon.put(`/shift-management/${payload.id}`, payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_Shift_Management = async (payload) => {
  const res = await httpCommon.delete(`/shift-management/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const ShiftManagementService = {
  Create_Shift_Management,
  Get_Shift_Management,
  Get_Shift_Management_By_ID,
  Update_Shift_Management,
  Remove_Shift_Management,
};

export default ShiftManagementService;
