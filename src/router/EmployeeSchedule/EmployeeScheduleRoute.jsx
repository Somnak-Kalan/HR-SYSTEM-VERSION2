import React, { Suspense } from 'react';

// Shift Management (lazy)
const ShiftManagement = React.lazy(() => import('pages/EmployeeSchedule/ShiftManagement'));

// Employee Schedule (lazy)
const EmployeeSchedule = React.lazy(() => import('pages/EmployeeSchedule/EmployeeSchedule'));

// Attendance Rule (lazy)
const AttendanceRule = React.lazy(() => import('pages/EmployeeSchedule/AttendanceRule'));
import PageLoading from '../../components/PageLoading';
const EmployeeScheduleRoute = () => {
  const routes = [
    {
      path: '/shift-management',
      element: (
        <Suspense fallback={<PageLoading />}>
          <ShiftManagement />
        </Suspense>
      ),
    },
    {
      path: '/apply-shift',
      element: (
        <Suspense fallback={<PageLoading />}>
          <EmployeeSchedule />
        </Suspense>
      ),
    },
    {
      path: '/attendance-rule',
      element: (
        <Suspense fallback={<PageLoading />}>
          <AttendanceRule />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default EmployeeScheduleRoute;
