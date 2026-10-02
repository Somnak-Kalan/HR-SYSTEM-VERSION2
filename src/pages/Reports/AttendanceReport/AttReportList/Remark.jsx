import React, { memo } from 'react';
import { Button, Col, Popover, Row } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';

const remarks = [
  { value: 'a', label: 'Absent (Red)', color: 'red' },
  { value: 'L', label: 'Late In (Red)', color: 'red' },
  { value: 'AL', label: 'Annual Leave (Blue)', color: 'blue' },
  { value: 'UL', label: 'Unpaid Leave (Blue)', color: 'blue' },
  {
    value: 'S',
    label: (
      <>
        Scan (<CheckSquareOutlined /> === OK) (Blue)
      </>
    ),
    color: 'blue',
  },
  { value: 'E', label: 'Early (Yellow)', color: '#FFBF00' },
  { value: 'H', label: 'Holiday (Yellow)', color: '#FFBF00' },
  { value: 'MS', label: 'Missed Scan (Yellow)', color: '#FFBF00' },
  { value: 'Sh', label: 'Shift (Black)', color: 'black' },
];

const RemarkPopover = () => {
  return (
    <Popover
      placement="left"
      title={
        <>
          Remark
          <hr style={{ borderTop: 'solid 0.5px #FFFFFF' }} />
        </>
      }
      content={
        <>
          {remarks.map((el, index) => (
            <Row key={index} style={{ marginBottom: 6 }}>
              <Col span={5}>
                <strong style={{ color: el.color }}>{String(el.value).toUpperCase()}</strong>
              </Col>
              <Col span={1}>:</Col>
              <Col span={18} style={{ color: el.color }}>
                {el.label}
              </Col>
            </Row>
          ))}
        </>
      }
      overlayStyle={{ width: 320 }}>
      <Button>Remark</Button>
    </Popover>
  );
};

export default memo(RemarkPopover);
