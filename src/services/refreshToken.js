import httpCommon from 'utils/http-common';
//
const RefreshToken = (access_token) => {
  // console.log('old', access_token)
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/auth/refresh-token', {}, { headers: { token: access_token } })
      .then((res) => {
        resolve(res.data);
        // console.log('new', res.data.access_token)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        // window.location.href = '/logout'
        reject(err);
      });
  });
};

//
export default RefreshToken;
