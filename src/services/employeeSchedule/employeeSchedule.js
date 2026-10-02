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

const List_Employee_Schedule = async (payload) => {
  const doc = {
    search: payload?.doc?.search || '',
  };

  return request(
    httpCommon.post('/assign-shift/list', doc, {
      headers: getHeaders(payload),
    })
  );
};

const List_Employee_Schedule_Detail = async (payload) => {
  const id = payload?.id || payload?.doc?.id || payload?.doc?._id;

  const doc = {
    search: payload?.doc?.search || '',
  };

  return request(
    httpCommon.post('/assign-shift/list/' + id, doc, {
      headers: getHeaders(payload),
    })
  );
};

const Apply_Shift_To_Dept = async ({ doc, access_token }) => {
  return request(
    httpCommon.post('/assign-shift/department', doc, {
      headers: getHeaders({ access_token }),
    })
  );
};

const Apply_Shift_Mgmt_To_Employee = async ({ doc, access_token }) => {
  return request(
    httpCommon.post('/assign-shift/employee', doc, {
      headers: getHeaders({ access_token }),
    })
  );
};

const EmployeeSchedule = {
  List_Employee_Schedule,
  List_Employee_Schedule_Detail,
  Apply_Shift_To_Dept,
  Apply_Shift_Mgmt_To_Employee,
};

export default EmployeeSchedule;
