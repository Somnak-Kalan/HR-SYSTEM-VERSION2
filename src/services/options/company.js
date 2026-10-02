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

/*------[Get_Company_Option] List Company With Search--------*/
const Get_Company_Option = async (payload) => {
  try {
    const doc = {
      search: payload?.doc?.search || '',
    };
    const res = await httpCommon.get('/company/options/list', {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

const CompanyOptionService = {
  Get_Company_Option,
};

export default CompanyOptionService;
