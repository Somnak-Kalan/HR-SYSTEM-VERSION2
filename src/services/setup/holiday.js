import httpCommon from 'utils/http-common';

const cleanToken = (token) =>
  String(token || '')
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '');

const getHeaders = (access_token) => {
  const token = cleanToken(access_token);

  return {
    Authorization: `Bearer ${token}`,
    token,
  };
};

const request = async (promise) => {
  const res = await promise;
  return res.data;
};

const Create_Holiday = (payload) => {
  return request(
    httpCommon.post(`/holiday/create`, payload.doc, {
      headers: getHeaders(payload.access_token),
    })
  );
};

const Get_Holiday = (payload) => {
  return request(
    httpCommon.post(
      `/holiday/list`,
      {
        search: payload?.search || '',
        page: payload?.page || 1,
        size: payload?.size || 10,
      },
      {
        headers: getHeaders(payload.access_token),
      }
    )
  );
};

const Get_Holiday_By_Id = (payload) => {
  return request(
    httpCommon.get(`/holiday/${payload.id}`, {
      headers: getHeaders(payload.access_token),
    })
  );
};

const Update_Holiday = (payload) => {
  return request(
    httpCommon.put(`/holiday/${payload.id}`, payload.doc, {
      headers: getHeaders(payload.access_token),
    })
  );
};

const Remove_Holiday = (payload) => {
  return request(
    httpCommon.delete(`/holiday/${payload.id}`, {
      headers: getHeaders(payload.access_token),
    })
  );
};

const HolidayServices = {
  Create_Holiday,
  Get_Holiday,
  Get_Holiday_By_Id,
  Update_Holiday,
  Remove_Holiday,
};

export default HolidayServices;
