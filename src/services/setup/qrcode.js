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

const Get_QR_Code = async (payload) => {
  const res = await httpCommon.post('/qr-code/list', payload?.doc || { search: '' }, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_QR_Code_By_ID = async (payload) => {
  const res = await httpCommon.get(`/qr-code/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Add_QR_Code = async (payload) => {
  const res = await httpCommon.post('/qr-code/create', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_QR = async (payload) => {
  const res = await httpCommon.put(`/qr-code/${payload.id}`, payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_QR = async (payload) => {
  const res = await httpCommon.delete(`/qr-code/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const QRCodeServices = {
  Get_QR_Code,
  Get_QR_Code_By_ID,
  Add_QR_Code,
  Update_QR,
  Remove_QR,
};

export default QRCodeServices;
