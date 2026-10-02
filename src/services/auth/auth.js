import httpCommon from 'utils/http-common';

const login = (payload) => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    httpCommon
      .post('/auth/login', {
        username: payload.username,
        password: payload.password,
      })
      .then((res) => {
        if (res && res.data && res.data.msg) {
          reject(res.data);
        } else {
          // eslint-disable-next-line no-undef
          localStorage.setItem('user_info', JSON.stringify(res.data));
          resolve(res.data);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console, no-undef
        // console.log(err)
        reject(err.response.data);
      });
  });
};

const logout = () => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    localStorage.removeItem('user_info');
    localStorage.removeItem('permissions');
    localStorage.removeItem('isAdmin');
    resolve('logout');
  });
};

const AuthService = {
  login,
  logout,
};

export default AuthService;
