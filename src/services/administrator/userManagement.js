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

const getDocumentId = (payload) => {
  return payload?.doc?.id || payload?.doc?._id;
};

const validateId = (id) => {
  if (!id) {
    throw new Error('User ID is required');
  }
};

const Get_User_List = async (payload) => {
  const res = await httpCommon.post(
    '/user-management/list',
    {
      search: payload?.doc?.search || '',
      page: payload?.doc?.page || 1,
      size: payload?.doc?.size || 10,
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Get_User_By_Id = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.get(`/user-management/list/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Create_User = async (payload) => {
  const res = await httpCommon.post('/user-management/create', payload?.doc || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Check_Staff_Code = async (payload) => {
  const res = await httpCommon.post(
    '/user-management/check-staff-code',
    {
      staffCode: payload?.doc?.staffCode || '',
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Check_Username = async (payload) => {
  const res = await httpCommon.post(
    '/user-management/check-username',
    {
      username: payload?.doc?.username || '',
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const Update_User_Info = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.patch(`/user-management/user-info/${id}`, payload?.doc?.formData || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_User_Permission = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.patch(`/user-management/user-permission/${id}`, payload?.doc?.formData || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_User_Password = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.patch(`/user-management/user-password/${id}`, payload?.doc?.formData || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_System_Core = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.patch(`/user-management/system-core/${id}`, payload?.doc?.formData || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_User_From_Core = async (payload) => {
  const id = getDocumentId(payload);

  validateId(id);

  const res = await httpCommon.delete(`/user-management/system-core/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_User_Options = async (payload) => {
  const res = await httpCommon.post('/user-management/options', payload?.doc || {}, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Module_Options = async (payload) => {
  const res = await httpCommon.get('/group-permission/module/options/list', {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Module_Permission = async (payload) => {
  const res = await httpCommon.post(
    '/group-permission/module/permission',
    {
      moduleId: payload?.doc?.moduleId || [],
    },
    {
      headers: getAuthHeaders(payload),
    }
  );

  return res.data;
};

const UserManagementService = {
  Get_User_List,
  Get_User_By_Id,
  Create_User,
  Check_Staff_Code,
  Check_Username,
  Update_User_Info,
  Update_User_Permission,
  Update_User_Password,
  Update_System_Core,
  Remove_User_From_Core,
  Get_User_Options,
  Get_Module_Options,
  Get_Module_Permission,
};

export default UserManagementService;
