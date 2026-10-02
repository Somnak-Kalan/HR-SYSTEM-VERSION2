import React, { Suspense } from 'react';

// lazy load page
const MainLeavePage = React.lazy(() => import('../../pages/SetUp/LeaveType/index'));
import PageLoading from '../../components/PageLoading';
const LeaveTypeRoutes = () => {
  const routes = [
    {
      path: '/leave-type',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainLeavePage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default LeaveTypeRoutes;
