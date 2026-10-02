import React, { Suspense } from 'react';

// lazy load page
const MainLatePages = React.lazy(() => import('../../pages/Reports/Late/Index'));
import PageLoading from '../../components/PageLoading';
const LateReportsRoutes = () => {
  const routes = [
    {
      path: '/late',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainLatePages />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default LateReportsRoutes;
