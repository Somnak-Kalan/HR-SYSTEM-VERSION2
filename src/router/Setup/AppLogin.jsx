import React, { Suspense } from 'react';
// lazy load the page file
const MainAppLoginPage = React.lazy(() => import('../../pages/SetUp/AppLogin/Index'));
import PageLoading from '../../components/PageLoading';
// import CreateHolidayPage from "../pages/Holiday/Create"
const AppLoginRoutes = () => {
  const routes = [
    {
      path: '/app-login',
      element: (
        <Suspense fallback={<PageLoading />}>
          <MainAppLoginPage />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default AppLoginRoutes;
