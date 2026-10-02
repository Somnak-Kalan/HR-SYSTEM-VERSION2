// opts/department/
import httpCommon from 'utils/http-common';
/*------[Get_Position] List Position--------*/
const Get_Position_By_Id = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/hr/opts/position/' + payload.doc.id, {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
/*------end [Get_Position] List Position--------*/
/*------[Get_Position] List Position--------*/
const Get_Position_Otp = (payload) => {
  return new Promise((resolve, reject) => {
    httpCommon
      .get('/hr/opts/position', {
        headers: { token: payload.access_token },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.error('Error:', error); // Log error
        if (error.response && error.response.status === 401) {
          reject(new Error('You are not authenticated!'));
        } else {
          reject(error);
        }
      });
  });
};

/*------end [Get_Position] List Position--------*/

//
const PositionOptionService = {
  Get_Position_By_Id,
  Get_Position_Otp,
};
//
export default PositionOptionService;
