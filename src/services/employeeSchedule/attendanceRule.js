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

const Create_Attendance_Rule = async (payload) => {
  const res = await httpCommon.post('/attendance-rule/create', payload?.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Attendance_Rule = async (payload) => {
  const res = await httpCommon.post(
    '/attendance-rule/list',
    payload?.doc || {
      search: '',
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Get_Attendance_Rule_By_ID = async (payload) => {
  const res = await httpCommon.get(`/attendance-rule/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_Attendance_Rule = async (payload) => {
  const res = await httpCommon.put(`/attendance-rule/${payload.id}`, payload?.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_Attendance_Rule = async (payload) => {
  const res = await httpCommon.delete(`/attendance-rule/${payload.id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const AttendanceRuleService = {
  Create_Attendance_Rule,
  Get_Attendance_Rule,
  Get_Attendance_Rule_By_ID,
  Update_Attendance_Rule,
  Remove_Attendance_Rule,
};

export default AttendanceRuleService;
