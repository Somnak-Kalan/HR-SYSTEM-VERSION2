import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  message,
} from 'antd';

import {
  SearchOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import AttendanceListServices from '../../../services/reports/attendance_list';

import styles from './attendance_list.module.scss';

const { RangePicker } = DatePicker;

const SEARCH_DELAY = 350;

// =====================================================
// RESPONSE
// =====================================================

const getResponseList = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};

// =====================================================
// COMPONENT
// =====================================================

const SearchAttList = ({
  setFilterMonth,

  access_token,

  setClickAgain,

  setHasSearched,

  setFilterDepartment,

  onFilterChange,

  exportButton,
}) => {
  // =====================================================
  // LOADING
  // =====================================================

  const [employeeLoading, setEmployeeLoading] =
    useState(false);

  const [departmentLoading, setDepartmentLoading] =
    useState(false);

  // =====================================================
  // EMPLOYEE
  // =====================================================

  const [
    employeeDropdownOpen,
    setEmployeeDropdownOpen,
  ] = useState(false);

  const [
    employeeSearchValue,
    setEmployeeSearchValue,
  ] = useState('');

  const [
    selectedEmployeeId,
    setSelectedEmployeeId,
  ] = useState(null);

  // =====================================================
  // DEPARTMENT
  // =====================================================

  const [
    selectedDepartmentId,
    setSelectedDepartmentId,
  ] = useState(null);

  const [
    selectedDepartmentLabel,
    setSelectedDepartmentLabel,
  ] = useState('');

  // =====================================================
  // OPTIONS
  // =====================================================

  const [
    employeeOptionsRaw,
    setEmployeeOptionsRaw,
  ] = useState([]);

  const [
    departmentOptionsRaw,
    setDepartmentOptionsRaw,
  ] = useState([]);

  // =====================================================
  // DATE
  // =====================================================

  const [
    isFullMonth,
    setIsFullMonth,
  ] = useState(true);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState(dayjs());

  const [
    selectedRange,
    setSelectedRange,
  ] = useState(null);

  // =====================================================
  // REFS
  // =====================================================

  const employeeTimerRef =
    useRef(null);

  const employeeRequestRef =
    useRef(0);

  const departmentLoadedRef =
    useRef(false);

  const departmentLoadingRef =
    useRef(false);

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      clearTimeout(
        employeeTimerRef.current,
      );

      employeeRequestRef.current += 1;
    };
  }, []);

  // =====================================================
  // FILTER CHANGED
  // =====================================================

  const markFilterChanged = () => {
    onFilterChange?.();
  };

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployeeOptions =
    async (search) => {
      const keyword = String(
        search || '',
      ).trim();

      if (
        !access_token ||
        !keyword
      ) {
        return;
      }

      const requestId =
        employeeRequestRef.current +
        1;

      employeeRequestRef.current =
        requestId;

      setEmployeeLoading(true);

      try {
        const response =
          await AttendanceListServices.Get_Employee_Options(
            {
              access_token,

              doc: {
                search:
                  keyword,
              },
            },
          );

        if (
          requestId !==
          employeeRequestRef.current
        ) {
          return;
        }

        setEmployeeOptionsRaw(
          getResponseList(
            response,
          ),
        );
      } catch (error) {
        console.error(
          'Get employee options error:',
          error,
        );

        setEmployeeOptionsRaw(
          [],
        );
      } finally {
        if (
          requestId ===
          employeeRequestRef.current
        ) {
          setEmployeeLoading(
            false,
          );
        }
      }
    };

  // =====================================================
  // EMPLOYEE SEARCH
  // =====================================================

  const handleEmployeeSearch =
    (value) => {
      setEmployeeSearchValue(
        value,
      );

      clearTimeout(
        employeeTimerRef.current,
      );

      const keyword = String(
        value || '',
      ).trim();

      if (!keyword) {
        employeeRequestRef.current +=
          1;

        setEmployeeOptionsRaw(
          [],
        );

        setEmployeeDropdownOpen(
          false,
        );

        return;
      }

      markFilterChanged();

      setEmployeeDropdownOpen(
        true,
      );

      employeeTimerRef.current =
        setTimeout(() => {
          loadEmployeeOptions(
            keyword,
          );
        }, SEARCH_DELAY);
    };

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  const loadDepartmentOptions =
    async () => {
      if (!access_token) {
        return;
      }

      if (
        departmentLoadedRef.current ||
        departmentLoadingRef.current
      ) {
        return;
      }

      departmentLoadingRef.current =
        true;

      setDepartmentLoading(
        true,
      );

      try {
        const response =
          await AttendanceListServices.Get_Department_Options(
            {
              access_token,
            },
          );

        setDepartmentOptionsRaw(
          getResponseList(
            response,
          ),
        );

        departmentLoadedRef.current =
          true;
      } catch (error) {
        console.error(
          'Get department options error:',
          error,
        );
      } finally {
        departmentLoadingRef.current =
          false;

        setDepartmentLoading(
          false,
        );
      }
    };

  // =====================================================
  // FULL MONTH
  // =====================================================

  const fullMonthRange = useMemo(() => {
    const month =
      dayjs(selectedMonth);

    if (!month.isValid()) {
      return null;
    }

    return [
      month
        .startOf('month')
        .format('YYYY-MM-DD'),

      month
        .endOf('month')
        .format('YYYY-MM-DD'),
    ];
  }, [selectedMonth]);

  // =====================================================
  // CUSTOM RANGE
  // =====================================================

  const manualRange = useMemo(() => {
    if (
      !Array.isArray(
        selectedRange,
      ) ||
      selectedRange.length !== 2 ||
      !selectedRange[0] ||
      !selectedRange[1]
    ) {
      return null;
    }

    return [
      selectedRange[0].format(
        'YYYY-MM-DD',
      ),

      selectedRange[1].format(
        'YYYY-MM-DD',
      ),
    ];
  }, [selectedRange]);

  // =====================================================
  // SEARCH ENABLED
  // =====================================================

  const canSearch = Boolean(
    selectedDepartmentId ||
    selectedEmployeeId,
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    if (!canSearch) {
      message.warning(
        'Please select department or employee',
      );

      return;
    }

    const range = isFullMonth
      ? fullMonthRange
      : manualRange;

    if (!range) {
      message.warning(
        'Please select date',
      );

      return;
    }

    const nextFilter = {
      date_attendance:
        range,

      employeeId:
        selectedEmployeeId ||
        null,

      employee_id:
        selectedEmployeeId ||
        null,

      departmentId:
        selectedDepartmentId ||
        null,

      department_id:
        selectedDepartmentId ||
        null,

      departmentLabel:
        selectedDepartmentLabel ||
        '',

      mode: isFullMonth
        ? 'full_month'
        : 'date_range',
    };

    localStorage.setItem(
      'attendance_filter',
      JSON.stringify(
        nextFilter,
      ),
    );

    localStorage.setItem(
      'attendance_department_label',
      selectedDepartmentLabel ||
      '',
    );

    setFilterMonth(
      nextFilter,
    );

    setFilterDepartment?.(
      selectedDepartmentLabel ||
      '',
    );

    setHasSearched?.(
      true,
    );

    setClickAgain?.(
      true,
    );
  };

  // =====================================================
  // EMPLOYEE CHANGE
  // =====================================================

  const handleEmployeeChange =
    (value) => {
      markFilterChanged();

      setSelectedEmployeeId(
        value || null,
      );

      setEmployeeDropdownOpen(
        false,
      );

      setEmployeeSearchValue(
        '',
      );

      if (!value) {
        setEmployeeOptionsRaw(
          [],
        );
      }
    };

  // =====================================================
  // DEPARTMENT CHANGE
  // =====================================================

  const handleDepartmentChange =
    (
      value,
      option,
    ) => {
      markFilterChanged();

      const departmentId =
        value || null;

      const label =
        departmentId
          ? option?.label || ''
          : '';

      setSelectedDepartmentId(
        departmentId,
      );

      setSelectedDepartmentLabel(
        label,
      );

      if (!departmentId) {
        localStorage.setItem(
          'attendance_department_label',
          '',
        );
      }
    };

  // =====================================================
  // OPTIONS
  // =====================================================

  const employeeOptions =
    employeeOptionsRaw
      .map((employee) => ({
        value:
          employee?.value ||
          employee?._id ||
          employee?.id,

        label:
          employee?.label ||
          employee?.employee_id ||
          employee?.employeeId ||
          '',
      }))
      .filter(
        (item) =>
          Boolean(item.value),
      );

  const departmentOptions =
    departmentOptionsRaw
      .map((department) => ({
        value:
          department?.value ||
          department?._id ||
          department?.id,

        label:
          department?.label ||
          department?.name ||
          department?.department_name ||
          '',
      }))
      .filter(
        (item) =>
          Boolean(item.value),
      );

  // =====================================================
  // RANGE TEXT
  // =====================================================

  const rangeText = isFullMonth
    ? fullMonthRange
    : manualRange;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Form>
      {/* =================================================
          TOP
      ================================================= */}

      <div className="mb-3 flex items-center justify-between">
        {/* FULL MONTH */}

        <div
          className="
            flex
            h-8
            items-center
            rounded-lg
            border
            border-gray-300
            bg-white
            px-2
          "
          style={{
            width: 220,
          }}
        >
          <Checkbox
            checked={
              isFullMonth
            }
            onChange={(event) => {
              markFilterChanged();

              const checked =
                event.target.checked;

              setIsFullMonth(
                checked,
              );

              if (checked) {
                setSelectedMonth(
                  dayjs(),
                );
              }

              setSelectedRange(
                null,
              );
            }}
          >
            <span className="text-sm text-gray-700">
              Full Month
            </span>
          </Checkbox>
        </div>

        {/* EXPORT */}

        {exportButton}
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <Row
        gutter={[8, 8]}
        align="middle"
      >
        {/* DATE */}

        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={9}
        >
          <RangePicker
            style={{
              width: '100%',
              height: 32,
            }}
            value={
              selectedRange
            }
            disabled={
              isFullMonth
            }
            onChange={
              (dates) => {
                markFilterChanged();

                setSelectedRange(
                  dates,
                );
              }
            }
            format="YYYY-MM-DD"
            placeholder={[
              'Start date',
              'End date',
            ]}
          />
        </Col>

        {/* DEPARTMENT */}

        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={6}
        >
          <div
            className={
              styles.searchSelectBox
            }
          >
            <SearchOutlined
              className={
                styles.searchSelectIcon
              }
            />

            <Form.Item
              className={
                styles.searchFormItem
              }
            >
              <Select
                showSearch
                allowClear
                variant="borderless"
                className={
                  styles.searchSelect
                }
                loading={
                  departmentLoading
                }
                placeholder="Select by department"
                value={
                  selectedDepartmentId
                }
                onChange={
                  handleDepartmentChange
                }
                onDropdownVisibleChange={(
                  open,
                ) => {
                  if (open) {
                    loadDepartmentOptions();
                  }
                }}
                options={
                  departmentOptions
                }
                filterOption={(
                  input,
                  option,
                ) =>
                  String(
                    option?.label ||
                    '',
                  )
                    .toLowerCase()
                    .includes(
                      String(
                        input ||
                        '',
                      ).toLowerCase(),
                    )
                }
                notFoundContent={
                  departmentLoading
                    ? 'Loading...'
                    : 'No department found'
                }
              />
            </Form.Item>
          </div>
        </Col>

        {/* EMPLOYEE */}

        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={6}
        >
          <div
            className={
              styles.searchSelectBox
            }
          >
            <SearchOutlined
              className={
                styles.searchSelectIcon
              }
            />

            <Form.Item
              className={
                styles.searchFormItem
              }
            >
              <Select
                showSearch
                allowClear
                variant="borderless"
                className={
                  styles.searchSelect
                }
                loading={
                  employeeLoading
                }
                placeholder="Search by employee id"
                value={
                  selectedEmployeeId
                }
                searchValue={
                  employeeSearchValue
                }
                open={
                  employeeDropdownOpen
                }
                onSearch={
                  handleEmployeeSearch
                }
                onChange={
                  handleEmployeeChange
                }
                onDropdownVisibleChange={(
                  open,
                ) => {
                  setEmployeeDropdownOpen(
                    open &&
                    Boolean(
                      employeeSearchValue.trim(),
                    ),
                  );
                }}
                filterOption={false}
                options={
                  employeeOptions
                }
                notFoundContent={
                  employeeLoading
                    ? 'Searching...'
                    : 'No employee found'
                }
              />
            </Form.Item>
          </div>
        </Col>

        {/* SEARCH */}

        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={3}
        >
          <Button
            block
            onClick={
              handleSearch
            }
            disabled={
              !canSearch
            }
            style={{
              height: 32,
              borderRadius: 7,
            }}
          >
            <SearchOutlined />
          </Button>
        </Col>
      </Row>

      {/* =================================================
          RANGE
      ================================================= */}

      <div className="mt-2 text-xs text-gray-500">
        {rangeText
          ? `Range: ${rangeText[0]} → ${rangeText[1]}`
          : 'Range: -'}
      </div>
    </Form>
  );
};

export default SearchAttList;