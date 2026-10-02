import axios from 'axios';
//
import Config from './config';

const httpCommon = axios.create({
  baseURL: Config.baseURLHR,
  // baseURL: 'http://localhost:8800/',
  // withCredentials: true, // req with cookies
  headers: {
    'Content-type': 'application/json',
  },
});
//
export default httpCommon;
