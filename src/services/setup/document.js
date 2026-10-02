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
  };
};

const removeContentTypeForFormData = (data, headers) => {
  // Important: let browser/axios set multipart boundary automatically
  if (headers?.delete) {
    headers.delete('Content-Type');
    headers.delete('content-type');
  } else {
    delete headers['Content-Type'];
    delete headers['content-type'];
  }

  return data;
};

// [Create_Document]
const Create_Document = async (payload) => {
  try {
    const response = await httpCommon.post('/document-file/create', payload.formData, {
      headers: getAuthHeaders(payload),
      transformRequest: [removeContentTypeForFormData],
    });

    return response.data;
  } catch (error) {
    console.error('Error creating document:', error.response?.data || error.message);
    throw error;
  }
};

// [Get_Document]
const Get_Document = async (payload) => {
  try {
    const doc = {
      search: payload?.doc?.search || '',
    };

    const response = await httpCommon.post('/document-file/list', doc, {
      headers: {
        ...getAuthHeaders(payload),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error listing documents:', error.response?.data || error.message);
    throw error;
  }
};

// [Get_Document_By_Id]
const Get_Document_By_Id = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id;

    const response = await httpCommon.get(`/document-file/${id}`, {
      headers: {
        ...getAuthHeaders(payload),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting document by id:', error.response?.data || error.message);
    throw error;
  }
};

// [Update_Document]
const Update_Document = async (payload) => {
  try {
    const id = payload?.id || payload?.doc?.id || payload?.doc?._id;

    const response = await httpCommon.put(`/document-file/${id}`, payload.formData, {
      headers: getAuthHeaders(payload),
      transformRequest: [removeContentTypeForFormData],
    });

    return response.data;
  } catch (error) {
    console.error('Error updating document:', error.response?.data || error.message);
    throw error;
  }
};

// [Remove_Document]
const Remove_Document = async (payload) => {
  try {
    const id = payload?.doc?.id || payload?.doc?._id || payload?.id;

    const response = await httpCommon.delete(`/document-file/${id}`, {
      headers: {
        ...getAuthHeaders(payload),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error removing document:', error.response?.data || error.message);
    throw error;
  }
};

const DocumentService = {
  Create_Document,
  Get_Document,
  Get_Document_By_Id,
  Update_Document,
  Remove_Document,
};

export default DocumentService;
