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

const Get_Province_Otp = (payload) => {
  return request(
    httpCommon.get('/address/province/options', {
      headers: getHeaders(payload),
    })
  );
};

const Get_District_Otp = (payload) => {
  return request(
    httpCommon.get('/address/district/options/' + payload.doc.id, {
      headers: getHeaders(payload),
    })
  );
};

const Get_Commune_Otp = (payload) => {
  return request(
    httpCommon.get('/address/commune/options/' + payload.doc.id, {
      headers: getHeaders(payload),
    })
  );
};

const Get_Village_Otp = (payload) => {
  return request(
    httpCommon.get('/address/village/options/' + payload.doc.id, {
      headers: getHeaders(payload),
    })
  );
};

const AddressOptServices = {
  Get_Province_Otp,
  Get_District_Otp,
  Get_Commune_Otp,
  Get_Village_Otp,
};

export default AddressOptServices;
