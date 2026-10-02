import React from 'react';
import ReactDOM from 'react-dom/client';
//
import App from './App.jsx';
import './index.scss';
import './tailwind.css';
import AuthContextProvider from 'contexts/AuthContext.jsx';
import MessageContextProvider from 'contexts/MessageContext.jsx';
import NotifyContextProvider from 'contexts/NotifyContext.jsx';
import ContentProvider from 'contexts/ContentContext.jsx';

//  Preload login chunk early to reduce spinner on first open
const preloadLogin = () => {
  // Only preload when user is going to login (or root)
  const p = window.location.pathname;
  if (p === '/' || p.startsWith('/login')) {
    import('pages/Authentication/Login');
  }
};
// Use idle time if available, otherwise do it quickly
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(preloadLogin);
} else {
  setTimeout(preloadLogin, 0);
}

// src/main.jsx (top-level)
window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event?.reason?.message || event?.reason || '');
  const isChunkError =
    msg.includes('Failed to fetch dynamically imported module') || msg.includes('Importing a module script failed');

  if (isChunkError) {
    window.location.reload();
  }
});

import { FloatButton } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <NotifyContextProvider>
        <MessageContextProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </MessageContextProvider>
      </NotifyContextProvider>
    </AuthContextProvider>

    <FloatButton.BackTop />
  </React.StrictMode>
);
