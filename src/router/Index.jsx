import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
// layout
import ContentLayout from '@/layouts/ContentLayout';
//
// public
const Login = React.lazy(() => import('pages/Authentication/Login'));
const Logout = React.lazy(() => import('pages/Authentication/Logout'));
// const Login_default = React.lazy(() => import('pages/Authentication/Login_default'))
// protected (lazy)

const Dashboard = React.lazy(() => import('pages/Dashboard/Dashboard'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
// const Forbidden = React.lazy(() => import('../pages/'))

//routes
import TestRoute from './TestRoute';
//end routes
// *-------------------ROUTES--------------------*//
import ProtectedRoute from './ProtectedRoute';
import DepartmentRoutes from './Setup/DepartmentRoute';
import HolidayRoutes from './Setup/HolidayRoute';
import QrCodeRoutes from './Setup/QrCodeRoute';
import EmployeeScheduleRoute from './EmployeeSchedule/EmployeeScheduleRoute';
import EmployeeRoutes from './Setup/EmployeeRoute';
import PositionRoutes from './Setup/PositionRoute';
import CompanyRoutes from './Setup/CompanyRoute';
import AttendanceListRoutes from './Reports/AttendanceListRoute';
import AttendanceReportRoutes from './Reports/AttendanceReportRoute';
import LeaveReportsRoutes from './Reports/LeaveReportRoute';
import LeaveTypeRoutes from './Setup/LeaveTypeRoute';
import AppLoginRoutes from './Setup/AppLogin';
import MissedScanRoute from './Reports/MissedScanRoute';
import DocumentRoutes from './Setup/Document';
import CheckInOutRoutes from './Setup/CheckInOut';
import LateRoutes from './Setup/Late';
//REPORTS
import ReportRoutes from './Reports/MainReport';
import AdministratorRoutes from './Administrator/Administrator';
//REPORTS
// *------------------END ROUTES-------------------*//
import ErrorPage from '@/pages/ErrorPage';
import PageLoading from '../components/PageLoading';
const ErrorPages = (node) => node;

//
//
//
const publicRoute = () => {
  const routes = [
    {
      path: '/login',
      errorElement: ErrorPages(<ErrorPage />),
      element: (
        <Suspense fallback={<PageLoading />}>
          <Login />
        </Suspense>
      ),
    },

    {
      path: '/logout',
      errorElement: ErrorPages(<ErrorPage />),
      element: <Logout />,
    },
  ];
  return routes;
};

const authRoute = () => {
  const routes = [
    {
      path: '/',
      errorElement: ErrorPages(<ErrorPage />),
      element: (
        <ProtectedRoute>
          <ContentLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '404',
          element: (
            <Suspense fallback={<PageLoading />}>
              <NotFound />
            </Suspense>
          ),
        },
        {
          path: 'dashboard',
          element: (
            <Suspense fallback={<PageLoading />}>
              <Dashboard />
            </Suspense>
          ),
        },

        ...TestRoute(),
        ...EmployeeScheduleRoute(),
        ...CompanyRoutes(),
        ...DepartmentRoutes(),
        ...EmployeeRoutes(),
        ...HolidayRoutes(),
        ...PositionRoutes(),
        ...QrCodeRoutes(),
        ...AppLoginRoutes(),
        ...LeaveTypeRoutes(),
        ...CheckInOutRoutes(),
        ...LateRoutes(),
        ...DocumentRoutes(),
        ...AttendanceListRoutes(),
        ...AttendanceReportRoutes(),
        ...LeaveReportsRoutes(),
        ...MissedScanRoute(),
        ...ReportRoutes(),
        ...AdministratorRoutes(),

        {
          path: '*',
          element: <Navigate to="/404" replace />,
        },
      ],
    },
  ];

  return routes;
};
export { publicRoute, authRoute };
