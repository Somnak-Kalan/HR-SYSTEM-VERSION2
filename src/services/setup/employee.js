import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token =
    payload?.access_token ||
    payload?.token ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    '';

  return String(token)
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '');
};

const getHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
  };
};

const getMultipartHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${accessToken}`,
    token: accessToken,
  };
};

const request = async (promise) => {
  const res = await promise;
  return res.data;
};

const Create_Employee = (payload) => {
  return request(
    httpCommon.post('/employee/create', payload.doc, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Add_Employee_Only_Personal_Info = (payload) => {
  return request(
    httpCommon.post('/employee/personal_info', payload.doc, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Get_Employee = (payload) => {
  return request(
    httpCommon.post('/employee/list', payload?.doc || {}, {
      headers: getHeaders(payload),
    })
  );
};

const Get_Employee_By_Id = (payload) => {
  return request(
    httpCommon.get('/hr/get_employee/' + payload.doc.id, {
      headers: getHeaders(payload),
    })
  );
};

const Get_Employee_Detail = (payload) => {
  return request(
    httpCommon.get('/employee/list/' + payload.doc.id, {
      headers: getHeaders(payload),
    })
  );
};

const Update_Employee = (payload) => {
  return request(
    httpCommon.put('/hr/update_Employee', payload.doc, {
      headers: getHeaders(payload),
    })
  );
};

// New API: PATCH /employee/update-employee-status/:id
const Update_Employee_Status = (payload) => {
  const id = payload?.doc?.id;
  const status = payload?.doc?.status;

  return request(
    httpCommon.patch(
      `/employee/update-employee-status/${id}`,
      {
        status,
      },
      {
        headers: getHeaders(payload),
      }
    )
  );
};

// Old APIs keep here only if other pages still use them
const Remove_Employee = (payload) => {
  return request(
    httpCommon.put('/hr/remove_employee', payload.doc, {
      headers: getHeaders(payload),
    })
  );
};

const Disable_Employee = (payload) => {
  return request(
    httpCommon.put('/hr/disable_employee', payload.doc, {
      headers: getHeaders(payload),
    })
  );
};

const Enable_Employee = (payload) => {
  return request(
    httpCommon.put('/hr/enable_employee', payload.doc, {
      headers: getHeaders(payload),
    })
  );
};

const Resign_Employee = (payload) => {
  return request(
    httpCommon.put('/hr/resign_employee', payload.doc, {
      headers: getHeaders(payload),
    })
  );
};

const Update_Profile_Image = (payload) => {
  return request(
    httpCommon.patch(`/employee/profile_image/${payload.id}`, payload.doc, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Update_Personal_Info = (payload) => {
  return request(
    httpCommon.patch('/employee/personal_info/' + payload?.doc?.id, payload.doc?.jsonData, {
      headers: getHeaders(payload),
    })
  );
};

const Update_Company_Info = (payload) => {
  return request(
    httpCommon.patch('/employee/company_info/' + payload?.doc?.id, payload.doc?.jsonData, {
      headers: getHeaders(payload),
    })
  );
};

const Update_Other_Info = (payload) => {
  return request(
    httpCommon.patch('/employee/other_info/' + payload?.doc?.id, payload.doc?.jsonData, {
      headers: getHeaders(payload),
    })
  );
};

const Update_Shift_Management = (payload) => {
  return request(
    httpCommon.patch('/employee/shift_management/' + payload.doc.id, payload.doc?.formData, {
      headers: getHeaders(payload),
    })
  );
};

const Update_ID_Card = (payload) => {
  return request(
    httpCommon.patch('/employee/id_card/' + payload.doc.id, payload.doc?.formData, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Update_Employee_CV = (payload) => {
  return request(
    httpCommon.patch('/employee/cv/' + payload.doc.id, payload.doc?.formData, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Update_Drive_License = (payload) => {
  return request(
    httpCommon.patch('/employee/driver_license/' + payload.doc.id, payload.doc?.formData, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Update_Others = (payload) => {
  return request(
    httpCommon.patch('/employee/others/' + payload.doc.id, payload.doc?.formData, {
      headers: getMultipartHeaders(payload),
    })
  );
};

const Update_Employee_Leave_Type = (payload) => {
  return request(
    httpCommon.patch('/employee/leave_type/' + payload.doc.id, payload.doc?.formData, {
      headers: getHeaders(payload),
    })
  );
};

const EmployeeService = {
  Create_Employee,
  Add_Employee_Only_Personal_Info,

  Get_Employee,
  Get_Employee_By_Id,
  Get_Employee_Detail,

  Update_Employee,
  Update_Employee_Status,

  Update_Profile_Image,
  Update_Personal_Info,
  Update_Company_Info,
  Update_Other_Info,
  Update_Shift_Management,

  Update_ID_Card,
  Update_Employee_CV,
  Update_Drive_License,
  Update_Others,
  Update_Employee_Leave_Type,

  Remove_Employee,
  Disable_Employee,
  Enable_Employee,
  Resign_Employee,
};

export default EmployeeService;
