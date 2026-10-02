import React from 'react';

import { Button } from 'antd';

import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { capitalize } from 'lodash';

const renderDate = (value) => {
    if (!value) return '';

    return dayjs(value).format('YYYY-MM-DD');
};

const renderProbation = (value) => {
    let color = '#22c55e';

    if (value === 'Failed') color = '#ef4444';

    if (value === 'Probation') color = '#f59e0b';

    return (
        <button
            style={{
                background: color,

                border: 'none',

                color: '#fff',

                borderRadius: 5,

                padding: '2px 10px',

                fontSize: 12,
            }}
        >
            {value}
        </button>
    );
};

export const buildResignColumns = () => {
    return [
        // NO

        {
            title: 'No',

            key: 'no',

            width: 55,

            align: 'center',

            render: (_, __, index) => index + 1,
        },

        // ID

        {
            title: 'ID',

            dataIndex: 'employee_id',

            key: 'employee_id',

            width: 110,

            align: 'center',

            render: (text, record) => (
                <Link
                    to={`/employee/detail/${record?.id}`}

                    target="_blank"
                >
                    <Button
                        type="link"

                        size="small"
                    >
                        {text}
                    </Button>
                </Link>
            ),
        },

        // NAME

        {
            title: 'Name',

            dataIndex: 'name',

            width: 180,

            render: (_, record) => (
                <Link
                    to={`/employee/detail/${record?.id}`}

                    target="_blank"

                    style={{
                        textDecoration: 'none',
                    }}
                >
                    <div>
                        <div
                            style={{
                                color: '#045cff',

                                fontWeight: 600,

                                fontSize: 13,
                            }}
                        >
                            {record?.name}
                        </div>

                        <div
                            style={{
                                color: '#8c8c8c',

                                fontSize: 12,
                            }}
                        >
                            {record?.name_latin}
                        </div>
                    </div>
                </Link>
            ),
        },

        // Gender

        {
            title: 'Gender',

            dataIndex: 'gender',

            width: 90,

            align: 'center',

            render: (v) => capitalize(v || ''),
        },

        // Company

        {
            title: 'Company',

            dataIndex: 'company',

            width: 190,

            align: 'center',
        },

        // Department

        {
            title: 'Department',

            dataIndex: 'department',

            width: 200,

            align: 'center',
        },

        // Position

        {
            title: 'Position',

            dataIndex: 'position',

            width: 180,

            align: 'center',
        },

        // Joining Date

        {
            title: 'Joining Date',

            dataIndex: 'join_date',

            width: 130,

            align: 'center',

            render: renderDate,
        },

        // Probation Date

        {
            title: 'Probation Date',

            dataIndex: 'probation_date',

            width: 140,

            align: 'center',

            render: renderDate,
        },

        // Probation

        {
            title: 'Probation',

            dataIndex: 'passed_probation',

            width: 130,

            align: 'center',

            render: renderProbation,
        },

        // DOB

        {
            title: 'Date Of Birth',

            dataIndex: 'dob',

            width: 150,

            align: 'center',

            render: renderDate,
        },

        // Phone

        {
            title: 'Phone Number',

            dataIndex: 'phone_number',

            width: 140,

            align: 'center',
        },

        // Resignation

        {
            title: 'Resignation',

            dataIndex: 'resignation_date',

            width: 150,

            align: 'center',

            fixed: 'right',

            render: renderDate,
        },
    ];
};
