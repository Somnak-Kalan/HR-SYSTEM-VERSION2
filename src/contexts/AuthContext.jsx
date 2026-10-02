import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const parseLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Cannot parse localStorage key: ${key}`, error);
    return defaultValue;
  }
};

const cleanToken = (token) => {
  return String(token || '')
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '')
    .trim();
};

const AuthContextProvider = ({ children }) => {
  const [access_token, setAccessToken] = useState(() => {
    const token = cleanToken(localStorage.getItem('token'));
    return token ? `Bearer ${token}` : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => Boolean(parseLocalStorage('isAdmin', false)));

  const [menuBar, setMenuBar] = useState(() => parseLocalStorage('menu_sidebar', []));

  const [permissions, setPermissionsState] = useState(() => parseLocalStorage('permissions', []));

  const [userInfo, setUserInfo] = useState(() => parseLocalStorage('user_info', {}));

  const getAccessToken = () => {
    const token = cleanToken(localStorage.getItem('token'));
    return token ? `Bearer ${token}` : null;
  };

  const setAccessTokenFn = (token) => {
    const cleanedToken = cleanToken(token);

    if (!cleanedToken) {
      localStorage.removeItem('token');
      setAccessToken(null);
      return;
    }

    const bearerToken = `Bearer ${cleanedToken}`;

    localStorage.setItem('token', bearerToken);
    setAccessToken(bearerToken);
  };

  const setPermissions = (permissionList) => {
    const safePermissions = Array.isArray(permissionList) ? permissionList : [];

    setPermissionsState(safePermissions);

    localStorage.setItem('permissions', JSON.stringify(safePermissions));
  };

  const setMenuSideBar = (menu) => {
    const safeMenu = Array.isArray(menu) ? menu : [];

    setMenuBar(safeMenu);

    localStorage.setItem('menu_sidebar', JSON.stringify(safeMenu));
  };

  const setIsAdminFn = (value) => {
    const adminValue = Boolean(value);

    setIsAdmin(adminValue);

    localStorage.setItem('isAdmin', JSON.stringify(adminValue));
  };

  const setUserInfoFn = (user) => {
    /*
     * Store only safe fields.
     * Never store password or password hash in localStorage.
     */
    const safeUser = {
      _id: user?._id || null,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      gender: user?.gender || '',
      staffCode: user?.staffCode || '',
      roleId: user?.roleId || null,
      moduleId: Array.isArray(user?.moduleId) ? user.moduleId : [],
      status: user?.status || '',
      isAdmin: Boolean(user?.isAdmin),
    };

    setUserInfo(safeUser);

    localStorage.setItem('user_info', JSON.stringify(safeUser));
  };

  const getPermissions = () => {
    return permissions.length ? permissions : false;
  };

  const getUsername = () => {
    return userInfo?.username || 'user';
  };

  const checkPermission = (code) => {
    if (code === 'vts_dev' && process.env.NODE_ENV === 'development') {
      return true;
    }

    return permissions.includes(code);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('permissions');
    localStorage.removeItem('menu_sidebar');
    localStorage.removeItem('isAdmin');

    // Remove old duplicate keys if they exist
    localStorage.removeItem('is_admin');
    localStorage.removeItem('permission');
    localStorage.removeItem('user');

    setAccessToken(null);
    setIsAdmin(false);
    setMenuBar([]);
    setPermissionsState([]);
    setUserInfo({});
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue) {
        setAccessToken(null);
      }

      if (event.key === 'menu_sidebar') {
        setMenuBar(parseLocalStorage('menu_sidebar', []));
      }

      if (event.key === 'permissions') {
        setPermissionsState(parseLocalStorage('permissions', []));
      }

      if (event.key === 'isAdmin') {
        setIsAdmin(Boolean(parseLocalStorage('isAdmin', false)));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const isLoginPage = window.location.pathname.includes('/login');

    if (!access_token && !isLoginPage) {
      window.location.href = '/login';
    }
  }, [access_token]);

  return (
    <AuthContext.Provider
      value={{
        access_token,
        isAdmin,
        menuBar,
        permissions,
        userInfo,

        username: getUsername(),

        checkPermission,
        getPermissions,
        getAccessToken,

        setPermissions,
        setAccessTokenFn,
        setIsAdminFn,
        setUserInfoFn,
        setMenuSideBar,
        removeToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
