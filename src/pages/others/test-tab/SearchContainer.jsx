import React, { useEffect } from 'react';

const SearchContainer = () => {
  useEffect(() => {
    console.log('SearchContainer');
  }, []);
  return <h1>SearchContainer</h1>;
};

export default SearchContainer;
