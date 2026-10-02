import httpCommon from 'utils/http-common';

//
const getUserList = (payload) => {
  //
  return new Promise((resolve, reject) => {
    const path = payload.userId ? `/auth/users?uid=${payload.userId}` : '/auth/users';
    //
    httpCommon
      .get(path, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const getUser = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get(`/auth/users?uid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        // console.log(res)
        resolve(res.data[0] || {});
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const createUser = (payload) => {
  //
  return new Promise((resolve, reject) => {
    httpCommon
      .post('/auth/register', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        // console.log(res)
        resolve(res.data.msg);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const updateUserInfo = (payload) => {
  return new Promise((resolve, reject) => {
    // console.log(res)
    httpCommon
      .put('/auth/update_user_info', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        // console.log(res)
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const updateUserPermission = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .put('/auth/update_user_permission', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const updateUserPassword = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .put('/auth/update_user_password', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const removeUser = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .delete(`/auth/delete_user?uid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const getModule = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get(`/setting/module?mid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((result) => {
        // console.log(result)
        resolve(result.data[0]);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const createModule = (payload) => {
  //
  return new Promise((resolve, reject) => {
    //
    httpCommon
      .post('/setting/set_module', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const updateModule = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .put('/setting/update_module', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const removeModule = (payload) => {
  return new Promise((resolve, reject) => {
    // console.log(res)
    httpCommon
      .delete(`/setting/delete_module?mid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const getRoleList = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/setting/role', {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        // console.log(res)
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const getRole = (payload) => {
  return new Promise((resolve, reject) => {
    // console.log(res)
    httpCommon
      .get(`/setting/role?rid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data[0] || {});
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const createRole = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .post('/setting/set_role', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const updateRole = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .put('/setting/update_role', payload.doc, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const removeRole = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .delete(`/setting/delete_role?rid=${payload.id}`, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        reject(error);
      });
  });
};
//
const AdminService = {
  getUserList,
  getUser,
  createUser,
  updateUserInfo,
  updateUserPermission,
  updateUserPassword,
  removeUser,
  //
  getModule,
  createModule,
  updateModule,
  removeModule,
  //
  getRoleList,
  getRole,
  createRole,
  updateRole,
  removeRole,
};
export default AdminService;
