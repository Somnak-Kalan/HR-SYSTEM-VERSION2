import React, { useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//
import { message } from 'antd';
//
import { publicRoute, authRoute } from './router/Index';
//
import './styles/colors.scss';
//
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { access_token, setPermissions, setIsAdminFn, setMenuSideBar } = useContext(AuthContext);
  //
  const [connection, setConnection] = useState(navigator.onLine);
  //
  const handleOffline = () => {
    setConnection(false);
    messageApi.open({
      key: 'internetStatus',
      type: 'loading',
      content: <b style={{ color: 'red' }}>Error : No internet connections !</b>,
      duration: 0,
      authRoute,
    });
  };
  const handleOnline = () => {
    setConnection(true);
    messageApi.open({
      key: 'internetStatus',
      type: 'success',
      content: <b>Internet connected !</b>,
      duration: 2,
    });
  };
  //
  useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    //
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [connection]);
  const router = createBrowserRouter([...publicRoute(), ...authRoute()]);
  //

  return (
    <React.Fragment>
      {contextHolder}
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </React.Fragment>
  );
};
export default App;
