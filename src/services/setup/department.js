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

/*------[Create_Department] Add Department--------*/
const Create_Department = async (payload) => {
  try {
    const res = await httpCommon.post('/department/create', payload.doc, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Get_Department_By_Id] Get Department By Id--------*/
const Get_Department_By_Id = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.get(`/department/${id}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Update_Department] Edit Department--------*/
const Update_Department = async (payload) => {
  try {
    console.log(payload, 'somnak now');

    const id = payload?.doc?.id || payload?.doc?._id;
    const res = await httpCommon.put(`/department/${id}`, payload.doc?.doc, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Get_Department] List Department With Search--------*/
const Get_Department = async (payload) => {
  try {
    const doc = {
      search: payload?.doc?.search || '',
    };

    const res = await httpCommon.post('/department/list', doc, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Remove_Department] Remove Department--------*/
const Remove_Department = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.delete(`/department/${id}`, {
      headers: getAuthHeaders(payload),
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/*------[Fetch_List_Employee_By_Department]--------*/
const Fetch_List_Employee_By_Department = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.post(
      `/department/list/${id}`,
      {
        search: payload?.doc?.search || '',
      },
      {
        headers: getAuthHeaders(payload),
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
// ================================
// Update Department Leave Type
// ================================

const Update_Department_Leave_Type = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const res = await httpCommon.put(
      `/department/${id}/leave-type`,

      {
        leaveTypeIds: payload?.doc?.leaveTypeIds || [],
      },

      {
        headers: getAuthHeaders(payload),
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

const DepartmentService = {
  Create_Department,
  Get_Department_By_Id,
  Update_Department,
  Remove_Department,
  Get_Department,
  Fetch_List_Employee_By_Department,
  Update_Department_Leave_Type,
};

export default DepartmentService;
