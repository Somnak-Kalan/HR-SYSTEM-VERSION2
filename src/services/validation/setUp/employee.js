import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return token.replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const Validate_Create_Employee_Card_id = async (payload) => {
  const res = await httpCommon.post('/employee/check', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Validate_Update_Employee_Card_id = async (payload) => {
  const res = await httpCommon.post('/employee/check', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const ValidationEmployees = {
  Validate_Create_Employee_Card_id,
  Validate_Update_Employee_Card_id,
};

export default ValidationEmployees;
