import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import httpCommon from 'utils/http-common.js';
import { AuthContext } from 'contexts/AuthContext';

const cleanToken = (token) => {
  return String(token || '')
    .replace(/^Bearer\s+/i, '')
    .replace(/^"|"$/g, '')
    .trim();
};

const ProtectedRoute = ({ children }) => {
  const { access_token, setAccessTokenFn, setMenuSideBar, setPermissions, setIsAdminFn, setUserInfoFn, removeToken } =
    useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const didRunRef = useRef(false);

  useEffect(() => {
    const token = cleanToken(access_token || localStorage.getItem('token') || localStorage.getItem('access_token'));

    if (!token) {
      navigate('/login', {
        state: {
          from: location.pathname,
        },
        replace: true,
      });

      return;
    }

    if (didRunRef.current) {
      return;
    }

    didRunRef.current = true;

    const refreshAuthentication = async () => {
      try {
        const response = await httpCommon.get('/auth/refresh-token', {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response?.data || {};

        const newToken = data.accessToken || data.access_token;

        const newSideBar = data.sideBar;
        const newPermissions = data.permissions;
        const user = data.user;

        if (!newToken) {
          throw new Error('No access token returned from refresh-token API');
        }

        if (!Array.isArray(newSideBar)) {
          throw new Error('Invalid sidebar returned from refresh-token API');
        }

        if (!Array.isArray(newPermissions)) {
          throw new Error('Invalid permissions returned from refresh-token API');
        }

        if (!user || typeof user !== 'object') {
          throw new Error('Invalid user returned from refresh-token API');
        }

        setAccessTokenFn(newToken);
        setMenuSideBar(newSideBar);
        setPermissions(newPermissions);

        // Save only true or false
        setIsAdminFn(user.isAdmin === true);

        // Save sanitized user information
        setUserInfoFn(user);
      } catch (error) {
        console.error('Refresh-token error:', error?.response?.data || error);

        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          removeToken();
          navigate('/login', {
            replace: true,
          });
        }
      }
    };

    refreshAuthentication();
  }, [
    access_token,
    location.pathname,
    navigate,
    removeToken,
    setAccessTokenFn,
    setIsAdminFn,
    setMenuSideBar,
    setPermissions,
    setUserInfoFn,
  ]);

  return <>{children}</>;
};

export default ProtectedRoute;
