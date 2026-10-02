import React, { Suspense } from 'react';

const MainLatePage = React.lazy(() =>
    import('../../pages/SetUp/Late/Index')
);

import PageLoading from '../../components/PageLoading';
const MainLateRoutes = () => {
    return [

        {
            path: '/lates',
            element: (
                <Suspense fallback={<PageLoading />}>
                    <MainLatePage />
                </Suspense>
            ),
        },

        {
            path: '/lates/:tab',
            element: (
                <Suspense fallback={<PageLoading />}>
                    <MainLatePage />
                </Suspense>
            ),
        },

    ];

};


export default MainLateRoutes;