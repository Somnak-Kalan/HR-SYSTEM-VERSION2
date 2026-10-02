import Config from './config';

const joinUrl = (baseURL, path) => {
  if (!path) return '';

  // if already full URL
  if (String(path).startsWith('http://') || String(path).startsWith('https://')) {
    return path;
  }

  const base = String(baseURL || '').replace(/\/+$/, '');
  const cleanPath = String(path).replace(/^\/+/, '');

  return `${base}/${cleanPath}`;
};

export const getFile = (path) => {
  return joinUrl(Config.baseURL, path);
};

export const getFileImageWithBaseUrl = (path) => {
  return joinUrl(Config.baseURL, path);
};

// use this if backend serves static folder without /public
export const getFileWithoutPublic = (path) => {
  const cleanPath = String(path || '').replace(/^public\/?/, '');
  return joinUrl(Config.baseURLHR, cleanPath);
};
