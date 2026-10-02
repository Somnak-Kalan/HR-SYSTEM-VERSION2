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

const Get_User = async (payload) => {
  const res = await httpCommon.post(
    '/app-login/list',
    payload?.doc || {
      search: '',
      page: 1,
      size: 10,
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Register = async (payload) => {
  const res = await httpCommon.post('/hr/register', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_Status = async (payload) => {
  const res = await httpCommon.patch(`/app-login/update-user-status/${payload?.doc.id}`, payload.doc?.formData, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Change_Password = async (payload) => {
  const res = await httpCommon.patch(`/app-login/set-new-password/${payload.doc?.id}`, payload.doc?.formData, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Reset_Device_ID = async (payload) => {
  const res = await httpCommon.get(`/app-login/reset-device/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Delete_AppLogin = async (payload) => {
  const res = await httpCommon.delete(`/app-login/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const AppLoginService = {
  Register,
  Update_Status,
  Change_Password,
  Get_User,
  Reset_Device_ID,
  Delete_AppLogin,
};

export default AppLoginService;
