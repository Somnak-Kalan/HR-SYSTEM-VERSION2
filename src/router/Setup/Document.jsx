import React, { Suspense } from 'react';

// lazy load pages
const DocumentListPage = React.lazy(() => import('../../pages/SetUp/Document/Index'));
const DocumentDetail = React.lazy(() => import('../../pages/SetUp/Document/Detail/Detail'));
import PageLoading from '../../components/PageLoading';
const DocumentRoutes = () => {
  const routes = [
    {
      path: '/Document',
      element: (
        <Suspense fallback={<PageLoading />}>
          <DocumentListPage />
        </Suspense>
      ),
    },
    {
      path: '/Document/detail',
      element: (
        <Suspense fallback={<PageLoading />}>
          <DocumentDetail />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default DocumentRoutes;
