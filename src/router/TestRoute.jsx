import React, { Suspense } from 'react';

// lazy load pages
const Test = React.lazy(() => import('pages/others/Test.jsx'));
const Test1 = React.lazy(() => import('pages/others/Test1'));
const TestTabRoute = React.lazy(() => import('../pages/others/TestTab'));
const TableLcL = React.lazy(() => import('../pages/others/print/container-detail/TableLcL'));
const TableAir = React.lazy(() => import('../pages/others/print/container-detail/TableAir'));
const TableExp = React.lazy(() => import('../pages/others/print/container-detail/TableExp'));

const TestRoute = () => {
  const routes = [
    {
      path: '/test',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Test />
        </Suspense>
      ),
    },
    {
      path: '/test1',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Test1 />
        </Suspense>
      ),
    },
    {
      path: '/test-tab/:keyTab?',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TestTabRoute />
        </Suspense>
      ),
    },
    {
      path: '/print/table-lcl',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TableLcL />
        </Suspense>
      ),
    },
    {
      path: '/print/table-exp',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TableExp />
        </Suspense>
      ),
    },
    {
      path: '/print/table-air',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TableAir />
        </Suspense>
      ),
    },
  ];
  return routes;
};

export default TestRoute;
