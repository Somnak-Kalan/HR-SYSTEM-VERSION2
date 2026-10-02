import React, { Suspense } from 'react';

// lazy load page
const MainLeaveReportPage = React.lazy(() => import('../../pages/Reports/LeaveReport/MainLeaveReportPage'));
import PageLoading from '../../components/PageLoading';
const LeaveReportsRoutes = () => {
  const routes = [
    {
      path: '/leave-report',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainLeaveReportPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default LeaveReportsRoutes;
