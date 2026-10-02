import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Breadcrumb, Button, message } from 'antd';

import { DownloadOutlined, HomeOutlined } from '@ant-design/icons';

import { useNavigate, useOutletContext } from 'react-router-dom';

import List from './Attl/List';
import Search from './Search';

import ConbineDataExport from './AttD/MultipleExport';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { useAttendanceStore } from '../../../stores/Reports/attendance.store';

const createEmptyFilter = () => ({
  date_attendance: null,

  employeeId: null,

  employee_id: null,

  departmentId: null,

  department_id: null,

  departmentLabel: '',

  mode: 'full_month',
});

const readStoredFilter = () => {
  try {
    const raw = localStorage.getItem('attendance_filter');

    if (!raw) {
      return createEmptyFilter();
    }

    const parsed = JSON.parse(raw);

    return {
      date_attendance: parsed?.date_attendance || null,

      employeeId: parsed?.employeeId || parsed?.employee_id || null,

      employee_id: parsed?.employee_id || parsed?.employeeId || null,

      departmentId: parsed?.departmentId || parsed?.department_id || null,

      department_id: parsed?.department_id || parsed?.departmentId || null,

      departmentLabel: parsed?.departmentLabel || '',

      mode: parsed?.mode || 'full_month',
    };
  } catch {
    return createEmptyFilter();
  }
};

const readStoredDepartment = () => {
  return localStorage.getItem('attendance_department_label') || '';
};

export default function Attendance() {
  const navigate = useNavigate();

  const { collapsed } = useOutletContext();

  const { setContent } = useContent();

  const { access_token } = useContext(AuthContext);

  // =====================================================
  // STORE
  // =====================================================

  const exportAttendanceData = useAttendanceStore((state) => state.exportAttendance);

  const exportDepartment = useAttendanceStore((state) => state.exportDepartment);

  const fetchExportAttendance = useAttendanceStore((state) => state.exportAttendanceList);

  const exportLoading = useAttendanceStore((state) => state.exportLoading);

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [filterMonth, setFilterMonth] = useState(() => readStoredFilter());

  const [filterSearch, setFilterSearch] = useState('');

  const [filterDepartment, setFilterDepartment] = useState(() => readStoredDepartment());

  const [clickAgain, setClickAgain] = useState(false);

  const [hasSearched, setHasSearched] = useState(Boolean(readStoredFilter()?.date_attendance));

  const [pendingExport, setPendingExport] = useState(false);

  const exportRef = useRef(null);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = useCallback(() => {
    setHasSearched(false);

    setClickAgain(false);

    setPendingExport(false);
  }, []);

  // =====================================================
  // EXPORT VALIDATION
  // =====================================================

  const hasDateRange = Array.isArray(filterMonth?.date_attendance) && filterMonth.date_attendance.length === 2;

  const hasDepartment = Boolean(filterMonth?.departmentId || filterMonth?.department_id);

  // =====================================================
  // EXPORT
  // =====================================================

  const handleExport = async () => {
    if (!hasSearched) {
      message.warning('Please search attendance first');

      return;
    }

    if (!hasDepartment) {
      message.warning('Please select department before export');

      return;
    }

    if (!hasDateRange) {
      message.warning('Please select date before export');

      return;
    }

    try {
      const response = await fetchExportAttendance({
        filterMonth,

        pageSize: 10,

        access_token,

        force: true,
      });

      const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

      if (rows.length === 0) {
        message.warning('No data to export');

        return;
      }

      setPendingExport(true);
    } catch (error) {
      message.error(error?.response?.data?.message || error?.message || 'Export failed');
    }
  };

  // =====================================================
  // WAIT FOR EXPORT DATA
  // =====================================================

  useEffect(() => {
    if (!pendingExport || exportLoading || !Array.isArray(exportAttendanceData) || exportAttendanceData.length === 0) {
      return;
    }

    exportRef.current?.exportExcel?.();

    setPendingExport(false);
  }, [pendingExport, exportLoading, exportAttendanceData]);

  // =====================================================
  // BREADCRUMB
  // =====================================================

  useEffect(() => {
    setContent(
      <div className="flex items-center justify-between">
        <div />

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/attendance-list')} className="cursor-pointer" />,
            },

            {
              title: 'attendance list',
            },
          ]}
        />
      </div>
    );
  }, [navigate, setContent, collapsed]);

  // =====================================================
  // EXPORT BUTTON
  // =====================================================

  const exportButton = (
    <>
      <ConbineDataExport
        ref={exportRef}
        attendance={exportAttendanceData}
        filterMonth={filterMonth}
        filterDepartment={exportDepartment || filterDepartment}
        isListExport
      />

      <Button
        type="primary"
        loading={exportLoading}
        icon={<DownloadOutlined />}
        onClick={handleExport}
        className="!h-10 !rounded-lg !border-0 !px-5 !text-sm !font-medium shadow-sm"
      >
        Export Report
      </Button>
    </>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full">
      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-0 px-4 py-2">
        <Search
          access_token={access_token}

          setFilterMonth={setFilterMonth}

          setFilterSearch={setFilterSearch}

          filterMonth={filterMonth}

          setClickAgain={setClickAgain}

          setHasSearched={setHasSearched}

          onFilterChange={handleFilterChange}

          setFilterDepartment={setFilterDepartment}

          filterDepartment={filterDepartment}

          exportButton={exportButton}
        />
      </div>

      {/* =================================================
          LIST
      ================================================= */}

      <div className="rounded-xl bg-white shadow-sm">
        <List
          access_token={access_token}

          filterMonth={filterMonth}

          filterSearch={filterSearch}

          clickAgain={clickAgain}

          setClickAgain={setClickAgain}
        />
      </div>
    </div>
  );
}
