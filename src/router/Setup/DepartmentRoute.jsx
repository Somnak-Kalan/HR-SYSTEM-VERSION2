import React, { Suspense } from 'react';

// lazy load pages
const MainDepartmentPage = React.lazy(() => import('../../pages/SetUp/Department/index'));
import PageLoading from '../../components/PageLoading';
const DepartmentRoutes = () => {
  const routes = [
    {
      path: '/department',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainDepartmentPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default DepartmentRoutes;
