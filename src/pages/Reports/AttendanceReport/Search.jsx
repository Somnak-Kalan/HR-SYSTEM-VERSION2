// import React, { memo, useMemo, useRef, useState } from 'react'
// import { SearchOutlined } from '@ant-design/icons'
// import { Button, Col, DatePicker, Form, Radio, Row } from 'antd'
// import dayjs from 'dayjs'

// import CustomSelect from '../../../components/config/Select'
// import EmployeeService from '../../../services/setup/employee'

// const SearchAttReport = props => {
//   const {
//     form,
//     currentYear,
//     access_token,
//     list_employee,
//     filter_ee_id_loading,
//     onSearch,
//     showDetail,
//   } = props

//   const [ee_loading, setEELoading] = useState(false)
//   const [selectEmployeeId, setSelectEmployeeId] = useState(null)
//   const [selectVtsId,setSelectVtsId] = useState()
//   const [employee_filter, setEmployeeFilter] = useState([])
//   const employeeLoadedRef = useRef(false)
//   const employeeLoadingRef = useRef(false)
//   const [searchMode, setSearchMode] = useState('flex') // 'flex' | 'month'
//   const [selectedMonth, setSelectedMonth] = useState(null) // dayjs
//   const Filter_Option = (input, option) => {
//     if (!input || !option?.label) return false
//     const i = input.replace(/\s+/g, '').toLowerCase()
//     const l = String(option.label || '').replace(/\s+/g, '').toLowerCase()
//     return l.includes(i)
//   }
//   const hasEmployeesFromParent = Array.isArray(list_employee) && list_employee.length > 0
//   const employeeOptionsSource = hasEmployeesFromParent ? list_employee : employee_filter

//   // request employee only when user opens the select (and only once)
//   // request employee only when user opens the select (and only once)
// const loadEmployeeOnce = async () => {
//   if (hasEmployeesFromParent) return
//   if (!access_token) return
//   if (employeeLoadedRef.current) return
//   if (employeeLoadingRef.current) return

//   employeeLoadingRef.current = true
//   setEELoading(true)

//   try {
//     const res = await EmployeeService.Get_Employee({ access_token })
//     const list = Array.isArray(res?.data) ? res.data.filter(x => x?.employee_id) : []
//     setEmployeeFilter(list)
//     employeeLoadedRef.current = true
//   } catch (e) {
//     console.error('Get Employee error:', e)
//   } finally {
//     employeeLoadingRef.current = false
//     setEELoading(false)
//   }
// }

//   // Flexible range (25 -> 24) based on selectedMonth (end month)
//   const flexRange = useMemo(() => {
//     const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : null
//     if (!base) return null
//     const from = base.subtract(1, 'month').date(25).format('YYYY-MM-DD')
//     const to = base.date(24).format('YYYY-MM-DD')
//     return [from, to]
//   }, [selectedMonth])

//   // Full month range preview
//   const fullMonthRange = useMemo(() => {
//     const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : null
//     if (!base) return null
//     const from = base.startOf('month').format('YYYY-MM-DD')
//     const to = base.endOf('month').format('YYYY-MM-DD')
//     return [from, to]
//   }, [selectedMonth])

//   // Header labels (radio)
//   const headerInfo = useMemo(() => {
//     const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : dayjs()
//     if (searchMode === 'flex' && flexRange) {
//       const [from, to] = flexRange
//       return {
//         year: dayjs(to).format('YYYY'),
//         text: `${dayjs(from).format('MMM DD')} → ${dayjs(to).format('MMM DD')}`,
//       }
//     }
//     // return {
//     //   year: base.format('YYYY'),
//     //   text: base.format('MMMM'),
//     // }
//     return {
//       year: base.format('YYYY'),
//       text: base.format('MMMM'),
//     }
//   }, [searchMode, selectedMonth, flexRange])

//   //  SEARCH CLICK -> calls parent
//   const handleSearch = () => {
//     const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : dayjs()
//     const employee_id = selectEmployeeId || null

//     if (searchMode === 'flex') {
//       const from = base.subtract(1, 'month').date(25).format('YYYY-MM-DD')
//       const to = base.date(24).format('YYYY-MM-DD')

//       onSearch?.({
//         mode: 'flex',
//         search: [from, to],
//         employee_id:selectVtsId,
//       })
//       return
//     }

//     onSearch?.({
//       mode: 'month',
//       date_attendance: base.startOf('month').format('YYYY-MM-DD'),
//       employee_id:selectVtsId,
//       fullMonthRange:fullMonthRange
//     })
//   }
//   const handleChangeEmployeeId =async (value,record)=>{
//     setSelectEmployeeId(value)
//     setSelectVtsId(record?.label)
//   }
//   return (
//     <div className='text-white'>
//       <Form form={form} name='basic' labelAlign='top' autoComplete='off'>
//         <div style={{ display: showDetail ? 'none' : 'block' }}>
//           <div className='mb-2'>
//              <Radio.Group style={{ cursor: 'none' }}>
//                 <Radio.Button style={{ cursor: 'not-allowed', padding: '0px 20px 31px 20px' }}>
//                   {headerInfo.year}
//                 </Radio.Button>
//                 <Radio.Button style={{ cursor: 'not-allowed', padding: '0px 20px 31px 20px' }}>
//                   {headerInfo.text}
//                 </Radio.Button>
//               </Radio.Group>
//           </div>
//           <Row gutter={[8, 2]}>
//             {/* Month (end month) */}
//             <Col sm={24} md={24} lg={10} xl={8} xxl={6} className='py-2'>
//               <DatePicker
//                 picker='month'
//                 placeholder='Select end month (ex: Feb 2026)'
//                 style={{ width: '100%', paddingTop: 5, paddingBottom: 5 }}
//                 onChange={d => setSelectedMonth(d)}
//                 value={selectedMonth}
//               />
//             </Col>
//             {/* Mode */}
//             <Col sm={24} md={24} lg={10} xl={8} xxl={6} className='py-2'>
//               <Radio.Group
//                 value={searchMode}
//                 onChange={e => setSearchMode(e.target.value)}
//                 style={{ width: '100%' }}
//               >
//                 <Radio.Button value='flex'>Flexible (25→24)</Radio.Button>
//                 <Radio.Button value='month'>Full Month</Radio.Button>
//               </Radio.Group>

//               {searchMode === 'flex' && flexRange && (
//                 <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
//                   Range: {flexRange[0]} → {flexRange[1]}
//                 </div>
//               )}

//               {searchMode === 'month' && fullMonthRange && (
//                 <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
//                   Full month: {fullMonthRange[0]} → {fullMonthRange[1]}
//                 </div>
//               )}
//             </Col>

//             {/* Employee select */}
//             <Col sm={24} md={24} lg={10} xl={6} xxl={6} className='py-2'>
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   borderRadius: 5,
//                   border: '1px solid #d9d9d9',
//                   background: 'transparent' ,
//                   height: 34,
//                 }}
//               >
//                 <SearchOutlined style={{ fontSize: 16, paddingLeft: 12, color: '#1890ff' }} />
//                 <Form.Item name='employee_filter_id' style={{ padding: 0, margin: 0, width: '100%' }}>
//                   <CustomSelect
//                       showSearch
//                       bordered={false}
//                       allowClear
//                       loading={ee_loading}   //  only your local loading
//                       placeholder='Search by employee id'
//                       style={{ flex: 1 }}
//                       value={selectEmployeeId}
//                       onChange={(value,record) => handleChangeEmployeeId(value ?? null,record)}
//                       onDropdownVisibleChange={open => {
//                         if (open) loadEmployeeOnce()  //  only when click/open dropdown
//                       }}
//                       options={(employeeOptionsSource || []).map(ee => ({
//                         value: ee?.id,
//                         label: ee?.employee_id,
//                       }))}
//                       filterOption={Filter_Option}
//                     />

//                 </Form.Item>
//               </div>
//             </Col>

//             {/* Search button */}
//             <Col sm={24} md={24} lg={4} xl={2} xxl={2} className='py-2'>
//               <Button

//                 onClick={handleSearch}
//                 style={{ width: '100%', height: 34 }}
//                 className='cursor-pointer text-white '
//               >
//                 <SearchOutlined style={{ fontSize: 16 }} />
//               </Button>
//             </Col>
//           </Row>
//         </div>
//       </Form>
//     </div>
//   )
// }

// export default memo(SearchAttReport)
import React, { memo, useMemo, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, Row } from 'antd';
import dayjs from 'dayjs';

import CustomSelect from '../../../components/config/Select';
import EmployeeService from '../../../services/setup/employee';

const { RangePicker } = DatePicker;

const SearchAttReport = (props) => {
  const { form, currentYear, access_token, list_employee, filter_ee_id_loading, onSearch, showDetail } = props;

  const [ee_loading, setEELoading] = useState(false);
  const [selectEmployeeId, setSelectEmployeeId] = useState(null);
  const [selectVtsId, setSelectVtsId] = useState(null);
  const [employee_filter, setEmployeeFilter] = useState([]);

  const employeeLoadedRef = useRef(false);
  const employeeLoadingRef = useRef(false);

  const [isFullMonth, setIsFullMonth] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedRange, setSelectedRange] = useState(null);

  const Filter_Option = (input, option) => {
    if (!input || !option?.label) return false;
    const i = input.replace(/\s+/g, '').toLowerCase();
    const l = String(option.label || '')
      .replace(/\s+/g, '')
      .toLowerCase();
    return l.includes(i);
  };

  const hasEmployeesFromParent = Array.isArray(list_employee) && list_employee.length > 0;
  const employeeOptionsSource = hasEmployeesFromParent ? list_employee : employee_filter;

  const loadEmployeeOnce = async () => {
    if (hasEmployeesFromParent) return;
    if (!access_token) return;
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

  const fullMonthRange = useMemo(() => {
    const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : null;
    if (!base) return null;

    return [base.startOf('month').format('YYYY-MM-DD'), base.endOf('month').format('YYYY-MM-DD')];
  }, [selectedMonth]);

  const manualRange = useMemo(() => {
    if (!Array.isArray(selectedRange) || selectedRange.length !== 2) return null;
    if (!selectedRange[0] || !selectedRange[1]) return null;

    return [selectedRange[0].format('YYYY-MM-DD'), selectedRange[1].format('YYYY-MM-DD')];
  }, [selectedRange]);

  const handleToggleFullMonth = (e) => {
    const checked = e.target.checked;
    setIsFullMonth(checked);

    if (checked) {
      const base =
        Array.isArray(selectedRange) && selectedRange?.[0] && dayjs(selectedRange[0]).isValid()
          ? dayjs(selectedRange[0])
          : dayjs();

      setSelectedMonth(base);
      setSelectedRange(null);
    } else {
      setSelectedMonth(null);
    }
  };

  const handleChangeEmployeeId = (value, record) => {
    setSelectEmployeeId(value || null);
    setSelectVtsId(record?.label || null);
  };

  const handleSearch = () => {
    if (isFullMonth) {
      const base = selectedMonth && dayjs(selectedMonth).isValid() ? dayjs(selectedMonth) : dayjs();

      onSearch?.({
        mode: 'month',
        date_attendance: base.startOf('month').format('YYYY-MM-DD'),
        employee_id: selectVtsId,
        fullMonthRange,
      });
      return;
    }

    onSearch?.({
      mode: 'flex',
      search: manualRange,
      employee_id: selectVtsId,
    });
  };

  return (
    <div className="text-white">
      <Form form={form} name="basic" labelAlign="top" autoComplete="off">
        <div style={{ display: showDetail ? 'none' : 'block' }}>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={5} xxl={5}>
              <div
                style={{
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  background: '#fff',
                }}>
                <Checkbox checked={isFullMonth} onChange={handleToggleFullMonth}>
                  Full Month
                </Checkbox>
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={9} xxl={9}>
              <RangePicker
                style={{ width: '100%' }}
                value={selectedRange}
                onChange={(dates) => setSelectedRange(dates)}
                format="YYYY-MM-DD"
                placeholder={['Start date', 'End date']}
                disabled={isFullMonth}
                allowClear={!isFullMonth}
              />
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.75 }}>
                {isFullMonth
                  ? fullMonthRange
                    ? `Range: ${fullMonthRange[0]} → ${fullMonthRange[1]}`
                    : 'Range: -'
                  : manualRange
                    ? `Range: ${manualRange[0]} → ${manualRange[1]}`
                    : 'Range: -'}
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 5,
                  border: '1px solid #d9d9d9',
                  background: 'transparent',
                  height: 34,
                }}>
                <SearchOutlined style={{ fontSize: 16, paddingLeft: 12, color: '#1890ff' }} />
                <Form.Item name="employee_filter_id" style={{ padding: 0, margin: 0, width: '100%' }}>
                  <CustomSelect
                    showSearch
                    bordered={false}
                    allowClear
                    loading={ee_loading || filter_ee_id_loading}
                    placeholder="Search by employee id"
                    style={{ flex: 1 }}
                    value={selectEmployeeId}
                    onChange={(value, record) => handleChangeEmployeeId(value ?? null, record)}
                    onDropdownVisibleChange={(open) => {
                      if (open) loadEmployeeOnce();
                    }}
                    onFocus={loadEmployeeOnce}
                    options={(employeeOptionsSource || []).map((ee) => ({
                      value: ee?.id,
                      label: ee?.employee_id,
                    }))}
                    filterOption={Filter_Option}
                  />
                </Form.Item>
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={2} xxl={2}>
              <Button onClick={handleSearch} style={{ width: '100%', height: 34 }} className="cursor-pointer ">
                <SearchOutlined style={{ fontSize: 16 }} />
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default memo(SearchAttReport);
