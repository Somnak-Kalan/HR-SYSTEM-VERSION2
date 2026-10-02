import React from 'react';

const Attendance =
  React.lazy(() =>
    import(
      '../../pages/Reports/AttendanceList/Attendance'
    ),
  );

const Detail =
  React.lazy(() =>
    import(
      '../../pages/Reports/AttendanceList/AttD/Detail'
    ),
  );

import PageLoading from '../../components/PageLoading';

const AttendanceListRoutes =
  () => {
    return [
      {
        path: '/attendance-list',

        element: (
          <React.Suspense
            fallback={
              <PageLoading />
            }
          >
            <Attendance />
          </React.Suspense>
        ),
      },

      {
        path:
          '/attendance-list/detail/:id',

        element: (
          <React.Suspense
            fallback={
              <PageLoading />
            }
          >
            <Detail />
          </React.Suspense>
        ),
      },
    ];
  };

export default AttendanceListRoutes;