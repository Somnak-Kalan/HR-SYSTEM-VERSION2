import React from 'react';

import { Button, Space } from 'antd';

import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { capitalize } from 'lodash';

const renderDate = (value) => {
  if (!value) return '';

  return dayjs(value).format('YYYY-MM-DD');
};

export const buildEmployeeColumns = ({
  currentPage,
  pageSize,
}) => {
  return [
    // NO

    {
      title: 'No',

      key: 'no',

      width: 55,

      align: 'center',

      fixed: 'left',

      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },

    // ID

    {
      title: 'ID',

      dataIndex: 'employee_id',

      key: 'employee_id',

      width: 110,

      align: 'center',

      fixed: 'left',

      render: (text, record) => (
        <Link
          to={`/employee/detail/${record?.id}`}

          target="_blank"
        >
          <Button
            type="link"

            size="small"
          >
            {text?.toUpperCase()}
          </Button>
        </Link>
      ),
    },

    // NAME

    {
      title: 'Name',

      dataIndex: 'name',

      key: 'name',

      width: 180,

      fixed: 'left',

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

                fontSize: 13,

                fontWeight: 600,

                whiteSpace: 'nowrap',

                overflow: 'hidden',

                textOverflow: 'ellipsis',
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

      render: (v) => (v ? capitalize(v) : ''),
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

    // Pass Probation

    {
      title: 'Probation',

      dataIndex: 'passed_probation',

      width: 140,

      align: 'center',

      render: (v) => (
        <Space>
          {v === 'Passed' ? (
            <button
              style={{
                background: '#22c55e',

                color: '#fff',

                border: 'none',

                borderRadius: 5,

                padding: '2px 10px',
              }}
            >
              Passed
            </button>
          ) : v === 'Failed' ? (
            <button
              style={{
                background: '#ef4444',

                color: '#fff',

                border: 'none',

                borderRadius: 5,

                padding: '2px 10px',
              }}
            >
              Failed
            </button>
          ) : (
            <button
              style={{
                background: '#f59e0b',

                color: '#fff',

                border: 'none',

                borderRadius: 5,

                padding: '2px 10px',
              }}
            >
              Probation
            </button>
          )}
        </Space>
      ),
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
  ];
};
