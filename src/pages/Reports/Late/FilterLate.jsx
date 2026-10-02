import { Col, DatePicker, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const FilterLate = ({ onSearch, size = 10 }) => {
  const [search, setSearch] = useState('');

  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.({
        search: String(search || '').trim(),

        startDate: dateRange?.[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : '',

        endDate: dateRange?.[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : '',

        page: 1,
        size,
      });
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, dateRange, size, onSearch]);

  return (
    <Row
      gutter={[8, 8]}
      style={{
        marginBottom: 12,
      }}>
      <Col xs={24} md={12} xl={10}>
        <Input
          value={search}
          allowClear
          prefix={
            <SearchOutlined
              style={{
                color: '#1677ff',
              }}
            />
          }
          placeholder="Search employee ID or name"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </Col>

      <Col xs={24} md={12} xl={10}>
        <RangePicker
          value={dateRange}
          allowClear
          format="YYYY-MM-DD"
          placeholder={['Start date', 'End date']}
          style={{
            width: '100%',
          }}
          onChange={(dates) => {
            setDateRange(dates || null);
          }}
        />
      </Col>
    </Row>
  );
};

export default FilterLate;
