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
    token: accessToken,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

const Get_Module_List = async (payload) => {
  const res = await httpCommon.post(
    '/group-permission/module/list',
    { search: payload?.doc?.search || '' },
    { headers: getAuthHeaders(payload) }
  );

  return res.data;
};

const Create_Module = async (payload) => {
  const res = await httpCommon.post('/group-permission/module/create', payload.doc, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Get_Module_By_Id = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  const res = await httpCommon.get(`/group-permission/module/list/${id}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Update_Module = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  const res = await httpCommon.put(`/group-permission/module/${id}`, payload.doc.formData, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const Remove_Module = async (payload) => {
  const id = payload?.doc?.id || payload?.doc?._id;

  const res = await httpCommon.delete(`/group-permission/module/${id}`, {
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
  const companyId = payload?.doc?.company || payload?.doc?.companyId || payload?.doc?.id;

  const res = await httpCommon.get(`/department/options/${companyId}`, {
    headers: getAuthHeaders(payload),
  });

  return res.data;
};

const ModulePermissionService = {
  Get_Module_List,
  Create_Module,
  Get_Module_By_Id,
  Update_Module,
  Remove_Module,
  Get_System_Permission_Options,
  Get_Company_Options,
  Get_Department_Options,
};

export default ModulePermissionService;
