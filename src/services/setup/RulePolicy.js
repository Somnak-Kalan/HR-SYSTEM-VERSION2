import httpCommon from 'utils/http-common';

// =====================================================
// AUTH
// =====================================================

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return String(token).replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
    'Content-Type': 'application/json',
  };
};

// =====================================================
// HELPERS
// =====================================================

const getId = (payload) => payload?.id || payload?._id || payload?.doc?.id || payload?.doc?._id || '';

// =====================================================
// LIST
// =====================================================

const List_Rule_Policy = async ({ access_token, doc = {} } = {}) => {
  const response = await httpCommon.post('/rule-policy/list', doc, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// GET BY ID
// =====================================================

const Get_Rule_Policy_By_Id = async ({ access_token, id, _id } = {}) => {
  const policyId = id || _id;

  if (!policyId) {
    throw new Error('Rule policy ID is required');
  }
  console.log(access_token, 'access_token somnak', policyId);

  const response = await httpCommon.get(`/rule-policy/${policyId}`, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// CREATE
// =====================================================

const Create_Rule_Policy = async ({ access_token, doc } = {}) => {
  const response = await httpCommon.post('/rule-policy/create', doc, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// CHECK POLICY NAME
// =====================================================

const Check_Rule_Policy_Name = async ({ access_token, doc } = {}) => {
  const response = await httpCommon.post('/rule-policy/check-policy-name', doc, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// UPDATE
// =====================================================

const Update_Rule_Policy = async ({ access_token, id, _id, doc } = {}) => {
  const policyId = id || _id || getId(doc);

  if (!policyId) {
    throw new Error('Rule policy ID is required');
  }

  const response = await httpCommon.patch(`/rule-policy/${policyId}`, doc, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// DELETE
// =====================================================

const Remove_Rule_Policy = async ({ access_token, id, _id } = {}) => {
  const policyId = id || _id;

  if (!policyId) {
    throw new Error('Rule policy ID is required');
  }

  const response = await httpCommon.delete(`/rule-policy/${policyId}`, {
    headers: getAuthHeaders({
      access_token,
    }),
  });

  return response.data;
};

// =====================================================
// EXPORT
// =====================================================

const RulePolicyService = {
  List_Rule_Policy,
  Get_Rule_Policy_By_Id,
  Create_Rule_Policy,
  Check_Rule_Policy_Name,
  Update_Rule_Policy,
  Remove_Rule_Policy,
};

export default RulePolicyService;
