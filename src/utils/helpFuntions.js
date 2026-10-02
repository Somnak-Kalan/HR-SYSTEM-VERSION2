import Config from './config';

const encodeFilePath = (path) => {
  return String(path)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .split('/')
    .map((part) => {
      try {
        return encodeURIComponent(decodeURIComponent(part));
      } catch {
        return encodeURIComponent(part);
      }
    })
    .join('/');
};

export const getFile = (path) => {
  if (!path) return null;

  // If path is already full URL
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);

      url.pathname = url.pathname
        .split('/')
        .map((part) => {
          try {
            return encodeURIComponent(decodeURIComponent(part));
          } catch {
            return encodeURIComponent(part);
          }
        })
        .join('/');

      return url.toString();
    } catch {
      return path;
    }
  }

  const baseURL = String(Config.baseURL || '').replace(/\/+$/, '');
  const cleanPath = encodeFilePath(path);

  return `${baseURL}/${cleanPath}`;
};
