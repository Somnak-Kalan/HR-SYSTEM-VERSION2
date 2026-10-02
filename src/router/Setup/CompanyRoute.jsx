import React, { Suspense } from 'react';

// lazy load pages
const MainCompanyPage = React.lazy(() => import('../../pages/SetUp/Company/index'));
import PageLoading from '../../components/PageLoading';
const CompanyRoutes = () => {
  const routes = [
    {
      path: '/company',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainCompanyPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default CompanyRoutes;
