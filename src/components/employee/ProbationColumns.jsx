import React from 'react';

import dayjs from 'dayjs';

import { capitalize } from 'lodash';

const renderDate = (value) => {
    if (!value) return '';

    return dayjs(value).format('YYYY-MM-DD');
};

const renderProbationStatus = (record, setOpen) => {

    let buttonColor = "#1677ff";

    let badgeColor = "#1677ff";

    let badgeBg = "#e6f4ff";


    if (record?.color === "red") {

        buttonColor = "#ef4444";

        badgeColor = "#ef4444";

        badgeBg = "#fff1f0";

    }


    if (record?.color === "orange") {

        buttonColor = "#f97316";

        badgeColor = "#f97316";

        badgeBg = "#fff7e6";

    }


    return (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
            }}
        >

            <button
                onClick={() => setOpen(true)}
                style={{
                    background: buttonColor,
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    padding: "3px 12px",
                    fontSize: 12,
                    cursor: "pointer"
                }}
            >

                Set Probation

            </button>


            <span

                onClick={() => setOpen(true)}

                style={{
                    background: badgeBg,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}`,
                    borderRadius: 5,
                    padding: "3px 8px",
                    fontSize: 12,
                    cursor: "pointer"
                }}

            >

                {record?.remaining}

            </span>


        </div>

    );

};

export const buildProbationColumns = (setOpen) => {
    return [

        {
            title: 'No',

            key: 'no',

            width: 55,

            align: 'center',

            render: (_, __, index) => index + 1,
        },

        // Employee

        {
            title: 'Employee',

            dataIndex: 'employee',

            width: 220,

            render: (value) => (
                <div>
                    <div
                        style={{
                            color: '#045cff',

                            fontWeight: 600,

                            fontSize: 13,
                        }}
                    >
                        {value}
                    </div>
                </div>
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

            dataIndex: 'joining_date',

            width: 130,

            align: 'center',

            render: renderDate,
        },

        // Duration

        {
            title: 'Duration',

            dataIndex: 'duration',

            width: 100,

            align: 'center',
        },

        // Probation Due At

        {
            title: 'Probation Date',

            dataIndex: 'probation_due',

            width: 150,

            align: 'center',

            render: (_, record) => {

                let color = "#1677ff";


                if (record?.color === "red") {
                    color = "#ef4444";
                }


                if (record?.color === "orange") {
                    color = "#f97316";
                }


                if (record?.color === "blue") {
                    color = "#1677ff";
                }
                return (

                    <span
                        style={{
                            color,
                            fontWeight: 500,
                        }}
                    >
                        {renderDate(record?.probation_due)}
                    </span>

                );

            },
        },

        // Status

        {
            title: 'Status',

            dataIndex: 'status',

            width: 180,

            align: 'center',

            render: (_, record) => renderProbationStatus(record, setOpen),
        },
    ];
};
