import React, { useEffect } from 'react';

const SearchTracking = () => {
  useEffect(() => {
    console.log('SearchTracking');
  }, []);
  return <h1>SearchTracking</h1>;
};

export default SearchTracking;
