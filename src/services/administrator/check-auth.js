import httpCommon from 'utils/http-common';
//
const getUserInfoWhenRefreshPage = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/auth/check_token', { headers: { token: payload } })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//
const CheckAuth = { getUserInfoWhenRefreshPage };
export default CheckAuth;
