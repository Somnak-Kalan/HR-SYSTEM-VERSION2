import React, { Suspense } from 'react';

// lazy load page
const MainHolidayPage = React.lazy(() => import('../../pages/SetUp/Holiday/index'));
import PageLoading from '../../components/PageLoading';
const HolidayRoutes = () => {
  const routes = [
    {
      path: '/holiday',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainHolidayPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default HolidayRoutes;
