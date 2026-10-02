import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ContentContext = createContext(null);

const ContentProvider = ({ children }) => {
  const [content, setContentState] = useState(null);

  //  stable function (prevents max depth loop)
  const setContent = useCallback((node) => {
    setContentState(node);
  }, []);

  const value = useMemo(() => ({ content, setContent }), [content, setContent]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);

export default ContentProvider;
