import React, { Suspense } from 'react';

// lazy load pages
const MainAttendanceReport = React.lazy(() => import('../../pages/Reports/AttendanceReport/Index'));
import PageLoading from '../../components/PageLoading';
const AttendanceReportRoutes = () => {
  const routes = [
    {
      path: '/attendance-report',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainAttendanceReport />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default AttendanceReportRoutes;
