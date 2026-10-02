import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return token.replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    token: accessToken,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

const Search_Employee_Card_Id = async (payload) => {
  try {
    const employeeCardId = payload?.doc?.employee_card_id;

    const res = await httpCommon.get(`/hr/opts/employee_id/${employeeCardId}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const Get_Employee_Otp = async (payload) => {
  try {
    const res = await httpCommon.get('/employee/options/list', {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const EmployeeOptServices = {
  Search_Employee_Card_Id,
  Get_Employee_Otp,
};

export default EmployeeOptServices;
