import httpCommon from 'utils/http-common';

const getAccessToken = (payload) => {
  const token = payload?.access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

  return token.replace('Bearer ', '');
};

const getAuthHeaders = (payload) => {
  const accessToken = getAccessToken(payload);

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

//
const Create_Company = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .post('/company/create', payload.doc, {
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

/*------[Update_Company] Edit Company--------*/
const Update_Company = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .put('/company/' + payload.doc.id, payload.doc?.formData, {
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
/*------end [Update_Company] Edit Company--------*/

/*------[Get_Company] List Company--------*/
const Get_Company = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .post('/company/list', payload?.doc || {}, {
        headers: getAuthHeaders(payload),
      })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
/*------end [Get_Company] List Company--------*/

/*------[Remove_Company] update to inactive---------------*/
const Remove_Company = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .delete('/company/' + payload.doc.id, {
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
/*------end [Remove_Company] update to inactive---------------*/

//
const CompanyService = {
  Create_Company,
  Update_Company,
  Remove_Company,
  Get_Company,
};
//
export default CompanyService;
