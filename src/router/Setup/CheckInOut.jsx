import React, { Suspense } from 'react';

const MainCheckInOutPage = React.lazy(() =>
    import('../../pages/SetUp/CheckInOut/Index')
);

import PageLoading from '../../components/PageLoading';


const CheckInOutRoutes = () => {

    return [

        {
            path: '/check-in-out',
            element: (
                <Suspense fallback={<PageLoading />}>
                    <MainCheckInOutPage />
                </Suspense>
            ),
        },

        {
            path: '/check-in-out/:tab',
            element: (
                <Suspense fallback={<PageLoading />}>
                    <MainCheckInOutPage />
                </Suspense>
            ),
        },

    ];

};


export default CheckInOutRoutes;