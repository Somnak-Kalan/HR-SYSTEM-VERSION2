// src/pages/ErrorPage.jsx
import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const msg = String(error?.message || error || '');
  const isChunkError =
    msg.includes('Failed to fetch dynamically imported module') || msg.includes('Importing a module script failed');

  return (
    <div style={{ padding: 24 }}>
      <Result
        status="error"
        title={isChunkError ? 'Page failed to load (Offline or Network issue)' : 'Something went wrong'}
        subTitle={
          isChunkError
            ? 'You may be offline or the connection is unstable. Please check internet and reload.'
            : msg || 'Unexpected error'
        }
        extra={[
          <Button key="reload" onClick={() => window.location.reload()}>
            Reload
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            Go Home
          </Button>,
          <Button key="login" onClick={() => navigate('/login')}>
            Login
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorPage;
