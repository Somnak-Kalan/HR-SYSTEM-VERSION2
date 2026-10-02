import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token =
    payload?.access_token ||
    payload?.token ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    '';

  return String(token).replace(/^Bearer\s+/i, '');
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

const Get_Leave_Type_Otp = (payload) => {
  return request(
    httpCommon.get('/leave-type/options/list', {
      headers: getHeaders(payload),
    })
  );
};

const LeaveTypeOptServices = {
  Get_Leave_Type_Otp,
};

export default LeaveTypeOptServices;
