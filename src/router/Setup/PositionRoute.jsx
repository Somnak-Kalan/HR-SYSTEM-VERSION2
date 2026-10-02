import React, { Suspense } from 'react';

// lazy load page
const MainPositionPage = React.lazy(() => import('../../pages/SetUp/position/index'));
import PageLoading from '../../components/PageLoading';
const PositionRoutes = () => {
  const routes = [
    {
      path: '/position',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainPositionPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default PositionRoutes;
