import React, { Suspense } from 'react';

const Administrator = React.lazy(() => import('pages/administrator/Administrator'));

import PageLoading from '../../components/PageLoading';

const Page = () => (
  <Suspense fallback={<PageLoading />}>
    <Administrator />
  </Suspense>
);

const AdministratorRoutes = () => {
  const routes = [
    {
      path: 'administrator',
      element: <Page />,
    },
    {
      path: 'administrator/user',
      element: <Page />,
    },
    {
      path: 'administrator/user/add',
      element: <Page />,
    },
    {
      path: 'administrator/user/edit/:id',
      element: <Page />,
    },
    {
      path: 'administrator/role',
      element: <Page />,
    },
    {
      path: 'administrator/role/add',
      element: <Page />,
    },
    {
      path: 'administrator/role/edit/:id',
      element: <Page />,
    },
    {
      path: 'administrator/module',
      element: <Page />,
    },
    {
      path: 'administrator/module/add',
      element: <Page />,
    },
    {
      path: 'administrator/module/edit/:id',
      element: <Page />,
    },
  ];

  return routes;
};

export default AdministratorRoutes;
