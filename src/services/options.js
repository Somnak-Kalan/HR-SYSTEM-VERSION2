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

const getModuleOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/setting/module', {
        headers: getAuthHeaders(payload),
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getPermissionOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/setting/permission', {
        headers: getAuthHeaders(payload),
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCompanyOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/company/options/list', {
        headers: getAuthHeaders(payload),
        params: {
          search: payload?.search || '',
        },
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getDepartmentOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get(`/department/options/${payload.id}`, {
        headers: getAuthHeaders(payload),
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getPositionOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get(`/position/options/${payload.id}`, {
        headers: getAuthHeaders(payload),
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getShiftManagementOptions = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/shift-management/options/list', {
        headers: getAuthHeaders(payload),
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const GetLeaveTypeOpt = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/leave-type/options/list', {
        headers: getAuthHeaders(payload),
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const OptionsService = {
  getModuleOptions,
  getPermissionOptions,
  getCompanyOptions,
  getDepartmentOptions,
  getPositionOptions,
  getShiftManagementOptions,
  GetLeaveTypeOpt,
};

export default OptionsService;
