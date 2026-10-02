import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Breadcrumb, Card, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import queryString from 'query-string';

import GroupBtn from 'components/GroupBtn';
import ReadMoreComponent from '../../../components/ReadMore';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useAttendanceReportStore } from '../../../stores/Reports/attendanceReport.store';

import SearchAttReport from './Search';
import TableAttReport from './Table';
import RemarkPopover from './AttReportList/Remark';

dayjs.locale('en');

const buildColumns = (start, end) => {
  const fixed = [
    { key: 'actions', label: 'Export', type: 'fixed' },
    { key: 'vts_code', label: 'VTS-CODE', type: 'fixed' },
    { key: 'full_name', label: 'Full Name', type: 'fixed' },
    { key: 'department_name', label: 'Department Name', type: 'fixed' },
  ];

  const s = dayjs(start).startOf('day');
  const e = dayjs(end).endOf('day');
  const days = [];
  let cur = s.clone();
  while (cur.isBefore(e) || cur.isSame(e, 'day')) {
    days.push({
      key: cur.format('YYYY-MM-DD'),
      label: cur.format('Do'),
      day: cur.format('ddd'),
      type: 'day',
    });
    cur = cur.add(1, 'day');
  }
  return [...fixed, ...days];
};

const extractNumber = (id) => {
  const match = String(id || '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const buildExportPayload = (columns, exportRows, deptByEmployeeId) => {
  const headers1 = columns.map((c, idx) => {
    if (idx === 0) return { header: 'Nº', key: 'no', width: 5 };
    if (c.key === 'vts_code') return { header: c.label, key: c.key, width: 10 };
    if (c.key === 'full_name') return { header: c.label, key: c.key, width: 30 };
    if (c.key === 'department_name') return { header: c.label, key: c.key, width: 40 };
    return { header: c.label, key: c.key, width: 5 };
  });

  const headers2 = columns.map((c, idx) => {
    if (idx <= 3) return { header: '', key: c.key };
    return { header: c.day, key: c.key };
  });

  const rows = (Array.isArray(exportRows) ? exportRows : []).map((item, index) => {
    const formatted = {
      no: index + 1,
      vts_code: item?.info?.employee_id,
      full_name: `${item?.info?.first_name || ''} ${item?.info?.last_name || ''}`.trim(),
      department_name: item?.department_name || deptByEmployeeId.get(item?.id) || '',
    };

    (Array.isArray(item?.days) ? item.days : []).forEach((d) => {
      const k = dayjs(d?.date).format('YYYY-MM-DD');
      formatted[k] = d?.value;
    });

    return formatted;
  });

  return { headers1, headers2, rows };
};

const AttendanceReports = () => {
  const { setContent } = useContent();
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const { access_token } = useContext(AuthContext);
  const [form] = Form.useForm();

  // zustand
  const reports = useAttendanceReportStore((s) => s.reports);
  const loading = useAttendanceReportStore((s) => s.loading);

  // IMPORTANT:
  // fetchMonth => FLEXIBLE (25→24)
  // fetchRange => FULL MONTH (1→end)
  const fetchRange = useAttendanceReportStore((s) => s.fetchRange);
  const fetchMonth = useAttendanceReportStore((s) => s.fetchMonth);

  const currentYear = useMemo(() => dayjs().format('YYYY'), []);

  const [filterEELoading, setFilterEELoading] = useState(true);
  const [deptLoading, setDeptLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  //  default month base (for FULL MONTH)
  const [monthDate, setMonthDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));

  //  flexible range [from,to]
  const [rangeSearch, setRangeSearch] = useState(null);

  //  mode flag: true = flex, false = full month
  const [isRangeMode, setIsRangeMode] = useState(false);

  // for query / export / detail
  const [dateRange, setDateRange] = useState(null);

  // export selection
  const [checkedIds, setCheckedIds] = useState([]);
  const [exportRows, setExportRows] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const deptByEmployeeId = useMemo(() => {
    const m = new Map();
    employees.forEach((e) => m.set(e.id, e?.department || ''));
    return m;
  }, [employees]);

  const columns = useMemo(() => {
    // FULL MONTH mode
    if (!isRangeMode) {
      const start = dayjs(monthDate).startOf('month').format('YYYY-MM-DD');
      const end = dayjs(monthDate).endOf('month').format('YYYY-MM-DD');
      return buildColumns(start, end);
    }

    // FLEX mode
    const start = rangeSearch?.[0] || dayjs().format('YYYY-MM-DD');
    const end = rangeSearch?.[1] || dayjs().format('YYYY-MM-DD');
    return buildColumns(start, end);
  }, [isRangeMode, monthDate, rangeSearch]);

  const data = useMemo(() => {
    const base = Array.isArray(reports) ? reports : [];
    const withDept = base.map((r) => ({
      ...r,
      department_name: r?.department_name || deptByEmployeeId.get(r?.id) || '',
    }));

    const filtered =
      selectedDepartments?.length > 0
        ? withDept.filter((r) =>
            selectedDepartments.some((dep) =>
              String(r.department_name || '')
                .toLowerCase()
                .includes(String(dep).toLowerCase())
            )
          )
        : withDept;

    return filtered.sort((a, b) => extractNumber(a?.info?.employee_id) - extractNumber(b?.info?.employee_id));
  }, [reports, deptByEmployeeId, selectedDepartments]);

  const resetSelect = useCallback(() => {
    setCheckAll(false);
    setCheckedIds([]);
    setExportRows([]);
  }, []);

  const handleExport = useCallback(() => {
    const { headers1, headers2, rows } = buildExportPayload(columns, exportRows, deptByEmployeeId);
    // TODO: call your ExportExcelFile(headers1, headers2, rows)
    // console.log('EXPORT PAYLOAD:', { headers1, headers2, rows })
  }, [columns, exportRows, deptByEmployeeId]);

  const openNewTab = useCallback(
    (row) => {
      const queryParams = queryString.stringify({
        date_attendance: monthDate,
        search: rangeSearch,
      });
      window.open(`/attendance-report/detail/${row?.id}?${queryParams}`, '_blank');
    },
    [monthDate, rangeSearch]
  );

  const onCheckAllChange = useCallback(
    (e) => {
      const checked = e.target.checked;
      setCheckAll(checked);
      if (!checked) return resetSelect();
      setCheckedIds(data.map((x) => x?.id));
      setExportRows(data);
    },
    [data, resetSelect]
  );

  const on_Change_Checkbox = useCallback((checked, row) => {
    setCheckedIds((prev) => {
      const s = new Set(prev);
      checked ? s.add(row.id) : s.delete(row.id);
      return [...s];
    });
    setExportRows((prev) => {
      const m = new Map(prev.map((x) => [x.id, x]));
      checked ? m.set(row.id, row) : m.delete(row.id);
      return [...m.values()];
    });
  }, []);

  const copyToClipboard = useCallback((id) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(id);
    const textarea = document.createElement('textarea');
    textarea.value = id;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }, []);

  const onSearch = useCallback(
    async (value) => {
      resetSelect();

      const employee_id = value?.employee_id || null;
      // FLEXIBLE (25→24)
      if (value?.mode === 'flex') {
        const [from, to] = value?.search || [];
        setIsRangeMode(true);
        setRangeSearch([from, to]);
        setDateRange([from, to]);
        // optional: set monthDate to end-month (so detail page also has a base)
        setMonthDate(dayjs(to).startOf('month').format('YYYY-MM-DD'));
        const doc1 = { search: [from, to], employee_id };
        await fetchRange({
          doc1,
          access_token,
        });
        return;
      }

      // FULL MONTH
      if (value?.mode === 'month') {
        const base = value?.fullMonthRange;
        const from = dayjs(base?.[0]).startOf('month').format('YYYY-MM-DD');
        const to = dayjs(base?.[1]).endOf('month').format('YYYY-MM-DD');

        setIsRangeMode(false);
        setMonthDate(value?.date_attendance);
        setRangeSearch(null);
        setDateRange([from, to]);
        const doc1 = {
          search: base,
          employee_id,
        };
        await fetchRange({ doc1, access_token });
      }
    },
    [access_token, fetchMonth, fetchRange, resetSelect]
  );

  useEffect(() => {
    // only set UI default values, no API
    const base = dayjs().startOf('month').format('YYYY-MM-DD');
    const from = dayjs(base).startOf('month').format('YYYY-MM-DD');
    const to = dayjs(base).endOf('month').format('YYYY-MM-DD');

    setIsRangeMode(false);
    setMonthDate(base);
    setDateRange([from, to]);

    setFilterEELoading(false); // since we are not fetching employees here
    setDeptLoading(false); // since we are not fetching dept here
  }, []);
  // header content
  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={collapsed}
          showExportBtn
          exportBtn={checkedIds.length > 0}
          onExportBtnClick={handleExport}
        />
        <Breadcrumb
          items={[{ title: <HomeOutlined onClick={() => navigate('/')} /> }, { title: 'attendance report' }]}
        />
      </div>
    );
  }, [setContent, collapsed, checkedIds.length, handleExport, navigate]);

  return (
    <Card title="ATTENDANCE REPORT" extra={<RemarkPopover />}>
      <SearchAttReport
        form={form}
        currentYear={currentYear}
        access_token={access_token}
        list_employee={employees}
        filter_ee_id_loading={filterEELoading}
        onSearch={onSearch}
      />

      <div className="overflow-x-auto" style={{ overflowY: 'auto', height: '50vh' }}>
        <TableAttReport
          columns={columns}
          loading={loading}
          data={data}
          check_all={checkAll}
          checkedList={checkedIds}
          onCheckAllChange={onCheckAllChange}
          on_Change_Checkbox={on_Change_Checkbox}
          copyToClipboard={copyToClipboard}
          openNewTab={openNewTab}
          ReadMoreComponent={ReadMoreComponent}
        />
      </div>
    </Card>
  );
};

export default AttendanceReports;
