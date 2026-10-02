import React, { Suspense } from 'react';

// lazy load page
const MainQrCodePage = React.lazy(() => import('../../pages/SetUp/QrCode'));
import PageLoading from '../../components/PageLoading';
const QrCodeRoutes = () => {
  const routes = [
    {
      path: '/qr-code',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainQrCodePage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default QrCodeRoutes;
