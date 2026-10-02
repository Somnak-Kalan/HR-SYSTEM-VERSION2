// services/options/department.js
import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return token.replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
    'Content-Type': 'application/json',
  };
};

/*------[Get_Department_By_Id] Department options by company id--------*/
const Get_Department_By_Id = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.get(`/department/options/${id}`, {
      headers: getAuthHeaders(payload),
      params: {
        search: payload?.doc?.search || '',
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Get_Department_Option] All department options--------*/
const Get_Department_Option = async (payload) => {
  try {
    const res = await httpCommon.get('/department/options', {
      headers: getAuthHeaders(payload),
      params: {
        search: payload?.doc?.search || '',
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const DepartmentOptionService = {
  Get_Department_By_Id,
  Get_Department_Option,
};

export default DepartmentOptionService;
