import React from 'react';
import { Row, Col } from 'antd';

export default function EmployeeConfirmInfo({ employee }) {
  return (
    <Row>
      <Col xs={8} sm={8}>
        Name
      </Col>
      <Col xs={1} sm={1}>
        :
      </Col>
      <Col xs={14} sm={14} className="text-blue-500">
        {employee?.latin || ''}
      </Col>

      <Col xs={8} sm={8}>
        Employee ID
      </Col>
      <Col xs={1} sm={1}>
        :
      </Col>
      <Col xs={14} sm={14} className="text-blue-500">
        {employee?.employee_id || ''}
      </Col>
    </Row>
  );
}
