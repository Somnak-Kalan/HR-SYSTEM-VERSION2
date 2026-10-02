import React, { Suspense } from 'react';
// lazy load pages
const MainEmployeePage = React.lazy(() => import('../../pages/SetUp/Employee/index'));
const EditEmployeePage = React.lazy(() => import('../../pages/SetUp/Employee/Details/Index'));
import PageLoading from '../../components/PageLoading';
const EmployeeRoutes = () => {
  const routes = [
    {
      path: '/employee',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainEmployeePage />
        </Suspense>
      ),
    },
    {
      path: '/employee/detail/:id',
      element: (
        <Suspense fallback={<PageLoading />}>
          <EditEmployeePage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default EmployeeRoutes;
