import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
//
//
export const SocketIOContext = createContext();

//
import Config from 'utils/config';
//
const SocketIOContextProvider = ({ children }) => {
  const socket = io(Config.baseURL);
  useEffect(() => {
    socket.on('connect', () => {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('connect', socket.id);
      }
    });

    //
    return () => {
      socket.off('connect');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  return <SocketIOContext.Provider value={{ socket }}>{children}</SocketIOContext.Provider>;
};

export default SocketIOContextProvider;
