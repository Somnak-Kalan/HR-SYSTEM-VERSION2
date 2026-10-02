import { Button, Col, DatePicker, Form, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

import CustomSelect from '../../../components/config/Select';
import EmployeeService from '../../../services/setup/employee';

const SearchAttList = (props) => {
  const { setFilterMonth, access_token, showDetail, setFilterDetail } = props;
  const [form] = Form.useForm();

  const [ee_loading, setEELoading] = useState(false);

  // employee select value
  const [selectEmployeeId, setSelectEmployeeId] = useState(null);

  // employee options
  const [employee_filter, setEmployeeFilter] = useState([]);

  // cache flags (request only 1 time)
  const employeeLoadedRef = useRef(false);
  const employeeLoadingRef = useRef(false);

  // 2 modes only
  const [searchMode, setSearchMode] = useState('flex'); // 'flex' | 'month'

  // select month first (end month)
  const [selectedMonth, setSelectedMonth] = useState(null); // dayjs month

  const Filter_Option = (input, option) => {
    if (!input || !option?.label) return false;
    const i = input.replace(/\s+/g, '').toLowerCase();
    const l = String(option.label || '')
      .replace(/\s+/g, '')
      .toLowerCase();
    return l.includes(i);
  };

  // request employee only when user clicks the select (and only once)
  const loadEmployeeOnce = async () => {
    if (employeeLoadedRef.current) return;
    if (employeeLoadingRef.current) return;

    employeeLoadingRef.current = true;
    setEELoading(true);

    try {
      const res = await EmployeeService.Get_Employee({ access_token });
      const list = Array.isArray(res?.data) ? res.data.filter((x) => x?.employee_id) : [];
      setEmployeeFilter(list);
      employeeLoadedRef.current = true;
    } catch (e) {
      console.error('Get Employee error:', e);
    } finally {
      employeeLoadingRef.current = false;
      setEELoading(false);
    }
  };

  // Flexible range (25 -> 24) based on selectedMonth (end month)
  const flexRange = useMemo(() => {
    const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : null;
    if (!base) return null;

    const from = base.subtract(1, 'month').date(25).format('YYYY-MM-DD');
    const to = base.date(24).format('YYYY-MM-DD');
    return [from, to];
  }, [selectedMonth]);

  // Full month range preview
  const fullMonthRange = useMemo(() => {
    const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : null;
    if (!base) return null;

    const from = base.startOf('month').format('YYYY-MM-DD');
    const to = base.endOf('month').format('YYYY-MM-DD');
    return [from, to];
  }, [selectedMonth]);

  // Header labels (radio)
  const headerInfo = useMemo(() => {
    const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : dayjs();

    if (searchMode === 'flex' && flexRange) {
      const [from, to] = flexRange;
      return {
        year: dayjs(to).format('YYYY'),
        text: `${dayjs(from).format('MMM DD')} → ${dayjs(to).format('MMM DD')}`,
      };
    }

    return {
      year: base.format('YYYY'),
      text: base.format('MMMM'),
    };
  }, [searchMode, selectedMonth, flexRange]);

  // SEARCH CLICK
  const handleSearch = () => {
    const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : dayjs();

    const employee_id = selectEmployeeId || null;

    if (searchMode === 'flex') {
      const from = base.subtract(1, 'month').date(25).format('YYYY-MM-DD');
      const to = base.date(24).format('YYYY-MM-DD');

      setFilterMonth?.({
        date_attendance: [from, to],
        employee_id,
        mode: 'flex_25_24',
      });

      setFilterDetail?.(null);
      return;
    }

    setFilterMonth?.({
      date_attendance: base.startOf('month').format('YYYY-MM-DD'),
      employee_id,
      mode: 'full_month',
    });
    setFilterDetail?.(null);
  };

  return (
    <>
      <Form form={form}>
        <div className="block md:flex" style={{ display: showDetail ? 'none' : 'block' }}>
          {/* YEAR + TEXT */}
          <div className="mb-2">
            <Radio.Group style={{ cursor: 'none' }}>
              <Radio.Button style={{ cursor: 'not-allowed', padding: '1px 20px 32px 20px' }}>
                {headerInfo.year}
              </Radio.Button>
              <Radio.Button style={{ cursor: 'not-allowed', padding: '1px 20px 32px 20px' }}>
                {headerInfo.text}
              </Radio.Button>
            </Radio.Group>
          </div>

          <Row gutter={[8, 8]} className="w-full">
            {/* Month select FIRST */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className="py-1">
              <DatePicker
                picker="month"
                placeholder="Select end month (ex: Feb 2026)"
                style={{ width: '100%', paddingTop: 5, paddingBottom: 5 }}
                onChange={(d) => setSelectedMonth(d)}
                value={selectedMonth}
              />
            </Col>

            {/* Mode select */}
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className="py-1">
              <Radio.Group value={searchMode} onChange={(e) => setSearchMode(e.target.value)} style={{ width: '100%' }}>
                <Radio.Button value="flex">Flexible (25→24)</Radio.Button>
                <Radio.Button value="month">Full Month</Radio.Button>
              </Radio.Group>

              {searchMode === 'flex' && flexRange && (
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
                  Range: {flexRange[0]} → {flexRange[1]}
                </div>
              )}

              {searchMode === 'month' && fullMonthRange && (
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
                  Full month: {fullMonthRange[0]} → {fullMonthRange[1]}
                </div>
              )}
            </Col>

            {/* Employee search (Select with search) */}
            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6} className="py-1">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 5,
                  border: '1px solid #d9d9d9',
                  background: 'white',
                  height: 32,
                }}>
                <SearchOutlined style={{ fontSize: 16, paddingLeft: 12, color: '#1890ff' }} />
                <Form.Item name="employee_id" style={{ padding: 0, margin: 0, width: '100%' }}>
                  <CustomSelect
                    showSearch
                    bordered={false}
                    allowClear
                    loading={ee_loading}
                    placeholder="Search by employee id"
                    style={{ flex: 1 }}
                    value={selectEmployeeId}
                    onChange={(value) => setSelectEmployeeId(value ?? null)}
                    onDropdownVisibleChange={(open) => {
                      if (open) loadEmployeeOnce();
                    }}
                    onFocus={loadEmployeeOnce}
                    options={employee_filter.map((ee) => ({
                      value: ee?.id,
                      label: ee?.employee_id,
                    }))}
                    filterOption={Filter_Option}
                  />
                </Form.Item>
              </div>
            </Col>

            {/* Search button */}
            <Col xs={24} sm={24} md={24} lg={2} xl={2} xxl={2} className="py-1">
              <Button block onClick={handleSearch} className="cursor-pointer" style={{ height: 32 }}>
                <SearchOutlined style={{ fontSize: 16 }} />
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};

export default SearchAttList;
