import React from 'react';
import { Row, Col, Input } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

export default function EmployeeSearchBar({ searchText, setSearchText, positionText, setPositionText, onResetPage }) {
  const handleEmployeeSearch = (e) => {
    const value = e.target.value || '';
    setSearchText(value);
    onResetPage?.();
  };
  const handlePositionSearch = (e) => {
    const value = e.target.value || '';
    setPositionText(value);
    onResetPage?.();
  };
  const inputStyle = {
    width: 500,
    height: 28,
    fontSize: 11,
  };
  return (
    <Row gutter={[8, 8]}>
      <Col col={12} >
        <Input

          placeholder="Search employee"

          value={searchText}

          allowClear

          onChange={handleEmployeeSearch}

          prefix={
            <SearchOutlined
              style={{
                fontSize: 11,

                color: '#1890ff',
              }}
            />
          }

          style={inputStyle}
        />
      </Col>

      <Col>
        <Input
          placeholder="Search employee by position"

          value={positionText}

          allowClear

          onChange={handlePositionSearch}

          prefix={
            <SearchOutlined
              style={{
                fontSize: 11,

                color: '#1890ff',
              }}
            />
          }

          style={{
            ...inputStyle,

            width: 500,
          }}
        />
      </Col>
    </Row>
  );
}
