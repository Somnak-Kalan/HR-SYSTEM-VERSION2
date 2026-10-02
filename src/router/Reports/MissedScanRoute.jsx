import React, { Suspense } from 'react';

// lazy load page
const MainMissedScanPage = React.lazy(() => import('../../pages/Reports/MissedScan/Index'));
import PageLoading from '../../components/PageLoading';
const MissedScanRoute = () => {
  const routes = [
    {
      path: '/missed-scan',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainMissedScanPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default MissedScanRoute;
