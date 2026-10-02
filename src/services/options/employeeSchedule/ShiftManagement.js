import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token =
    payload?.access_token ||
    payload?.token ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    '';

  return String(token)
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '');
};

const getHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
  };
};

const request = async (promise) => {
  const res = await promise;
  return res.data;
};

const Get_Shift_Management_Options = (payload) => {
  return request(
    httpCommon.get('/shift-management/options/list', {
      headers: getHeaders(payload),
    })
  );
};

const ShiftManagementService = {
  Get_Shift_Management_Options,
};

export default ShiftManagementService;
