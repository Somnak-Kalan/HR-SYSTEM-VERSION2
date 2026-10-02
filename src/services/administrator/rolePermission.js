import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token)
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '')
    .trim();
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
    'Content-Type': 'application/json',
  };
};

const Get_Role_List = async (payload) => {
  const res = await httpCommon.post(
    '/group-permission/role/list',
    {
      search: payload?.doc?.search || '',
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Create_Role = async (payload) => {
  const res = await httpCommon.post('/group-permission/role/create', payload?.doc || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Role_By_Id = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  if (!id) {
    throw new Error('Role ID is required');
  }

  const res = await httpCommon.get(`/group-permission/role/list/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_Role = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  if (!id) {
    throw new Error('Role ID is required');
  }

  const res = await httpCommon.put(`/group-permission/role/${id}`, payload?.doc?.formData || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_Role = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  if (!id) {
    throw new Error('Role ID is required');
  }

  const res = await httpCommon.delete(`/group-permission/role/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Role_User_Options = async (payload) => {
  const res = await httpCommon.post('/group-permission/role/user/options', payload?.doc || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

/**
 * Get the selected employee's existing role and permission information.
 *
 * Endpoint:
 * GET /group-permission/role/user-info/:userId
 *
 * @param {Object} payload
 * @param {string} payload.access_token
 * @param {Object} payload.doc
 * @param {string} payload.doc.userId
 * @returns {Promise<Object>}
 */
const Get_Role_User_Info_By_Id = async (payload) => {
  const userId = payload?.doc?.userId || payload?.doc?.id || payload?.doc?._id;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const res = await httpCommon.get(`/group-permission/role/user-info/${userId}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_System_Permission_Options = async (payload) => {
  const res = await httpCommon.get('/system-permission/options', {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Company_Options = async (payload) => {
  const res = await httpCommon.get('/company/options/list', {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Department_Options = async (payload) => {
  const id = payload?.doc?.company || payload?.doc?.companyId || payload?.doc?.id;

  if (!id) {
    throw new Error('Company ID is required');
  }

  const res = await httpCommon.get(`/department/options/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const RolePermissionService = {
  Get_Role_List,
  Create_Role,
  Get_Role_By_Id,
  Update_Role,
  Remove_Role,
  Get_Role_User_Options,
  Get_Role_User_Info_By_Id,
  Get_System_Permission_Options,
  Get_Company_Options,
  Get_Department_Options,
};

export default RolePermissionService;
