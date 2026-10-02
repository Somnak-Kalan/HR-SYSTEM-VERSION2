import { useEffect, useMemo, useRef } from 'react';

import { Button, message, Breadcrumb } from 'antd';

import { DownloadOutlined, HomeOutlined } from '@ant-design/icons';

import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';

import ReadMoreComponent from '../../../../components/ReadMore';

import ConbineDataExport from './MultipleExport';

import { useAttendanceStore } from '../../../../stores/Reports/attendance.store';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useContent } from '../../../../contexts/ContentContext';
// =====================================================
// TIME
// =====================================================

const fmtTime = (value) => {
  if (!value) {
    return '';
  }

  const text = String(value).trim();

  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(text)) {
    return text.replace(/\s+/g, ' ').toUpperCase();
  }

  const date = dayjs(text);

  return date.isValid() ? date.format('hh:mm A') : text;
};

// =====================================================
// STORED FILTER
// =====================================================

const getStoredFilter = () => {
  try {
    const raw = localStorage.getItem('attendance_filter');

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// =====================================================
// RANGE
// =====================================================

const getStoredRange = () => {
  const filter = getStoredFilter();

  if (Array.isArray(filter?.date_attendance)) {
    return filter.date_attendance;
  }

  try {
    const raw = localStorage.getItem('att_filter_month');

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

// =====================================================
// MONTH LABEL
// =====================================================

const getMonthLabel = (range) => {
  if (!Array.isArray(range) || range.length !== 2) {
    return '';
  }

  const start = dayjs(range[0]);

  const end = dayjs(range[1]);

  if (!start.isValid() || !end.isValid()) {
    return '';
  }

  if (start.format('YYYY-MM') === end.format('YYYY-MM')) {
    return start.format('MMMM YYYY');
  }

  return `${start.format('MMM YYYY')} - ${end.format('MMM YYYY')}`;
};

// =====================================================
// NUMBER
// =====================================================

const toNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const number = Number(value);

  return Number.isNaN(number) ? fallback : number;
};

// =====================================================
// DETAIL PAGE
// =====================================================

export default function AttendanceDetail({ access_token }) {
  const { id } = useParams();

  const exportRef = useRef(null);

  // =====================================================
  // STORE
  // =====================================================

  const detail = useAttendanceStore((state) => state.detail);

  const loading = useAttendanceStore((state) => state.detailLoading);

  const fetchDailyReport = useAttendanceStore((state) => state.fetchDailyReport);
  const navigate = useNavigate();

  const { collapsed } = useOutletContext();

  const { setContent } = useContent();

  // =====================================================
  // FILTER
  // =====================================================

  const storedFilter = useMemo(() => getStoredFilter(), []);

  const reportRange = useMemo(() => {
    return storedFilter?.date_attendance || getStoredRange();
  }, [storedFilter]);

  const department = storedFilter?.departmentLabel || '';

  // =====================================================
  // DATA
  // =====================================================

  const days = useMemo(() => {
    if (Array.isArray(detail?.days)) {
      return detail.days;
    }

    if (Array.isArray(detail?.days?.data)) {
      return detail.days.data;
    }

    if (Array.isArray(detail?.data)) {
      return detail.data;
    }

    return [];
  }, [detail]);

  const info = detail?.info || {};

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    if (!id || !Array.isArray(reportRange) || reportRange.length !== 2 || !reportRange[0] || !reportRange[1]) {
      return;
    }

    localStorage.setItem('att_filter_month', JSON.stringify(reportRange));

    fetchDailyReport({
      filter: reportRange,
      employee_id: id,
      access_token,
      department: department || detail?.department_name || '',
    }).catch((error) => {
      console.error('Fetch daily report error:', error);
    });
  }, [id, access_token, fetchDailyReport, department, detail?.department_name, reportRange]);

  // =====================================================
  // MONTH
  // =====================================================

  const monthLabel = getMonthLabel(reportRange);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    let absent = 0;
    let annualLeave = 0;
    let dayOff = 0;
    let unpaidLeave = 0;
    let late = 0;

    days.forEach((item) => {
      const value = item?.value;

      if (value === 'A') {
        absent += 1;
      }

      if (value === 'AL') {
        const status = item?.date_leave?.[0]?.status_request;

        if (status === 'morning' || status === 'afternoon') {
          annualLeave += 0.5;
        } else {
          annualLeave += 1;
        }
      }

      if (value === 'UL') {
        unpaidLeave += 0.5;
      }

      if (value === 'L') {
        late += 1;
      }

      if (value === 'DayOff' || value === 'Day Off') {
        dayOff += 0.5;
      }
    });

    const count = detail?.count || {};

    return {
      absent: toNumber(count?.count_a ?? count?.absent, absent),

      annualLeave: toNumber(count?.count_al ?? count?.al, annualLeave),

      dayOff: toNumber(count?.count_day_off ?? count?.day_off ?? count?.dayOff, dayOff),

      unpaidLeave: toNumber(count?.count_ul ?? count?.unpaid_leave ?? count?.ul, unpaidLeave),

      late: toNumber(count?.count_l ?? count?.late, late),
    };
  }, [days, detail]);

  // =====================================================
  // NOTE
  // =====================================================

  const getNote = (record) => {
    if (record?.value === 'A') {
      return (
        <span className="inline-flex rounded-full bg-red-500 px-3 py-1 text-[10px] font-medium text-white">Absent</span>
      );
    }

    if (record?.value === 'H') {
      return (
        <span className="inline-flex rounded-full bg-green-500 px-3 py-1 text-[10px] font-medium text-white">
          Holiday
        </span>
      );
    }

    if (record?.value === 'Sh') {
      return (
        <span className="inline-flex rounded-full bg-[#d9b949] px-3 py-1 text-[10px] font-medium text-gray-700">
          Sh
        </span>
      );
    }

    if (record?.value === 'AL') {
      return (
        <span className="inline-flex rounded-full bg-[#dce7f7] px-3 py-1 text-[10px] font-medium text-[#1769aa]">
          AL
        </span>
      );
    }

    if (record?.value === 'UL') {
      return (
        <span className="inline-flex rounded-full bg-[#ffead6] px-3 py-1 text-[10px] font-medium text-orange-600">
          Unpaid
        </span>
      );
    }

    if (record?.value === 'MS') {
      return (
        <span className="inline-flex rounded-full bg-[#efd9ff] px-3 py-1 text-[10px] font-medium text-purple-600">
          MS
        </span>
      );
    }

    if (record?.value === 'S') {
      return '';
    }

    if (record?.value === 'L') {
      return '';
    }

    return record?.value || '';
  };

  // =====================================================
  // ROW CLASS
  // =====================================================

  const getRowClass = (record) => {
    const isSunday = record?.day === 'Sun' || dayjs(record?.date).day() === 0;

    if (record?.value === 'H') {
      return 'bg-[#00a63c] text-white';
    }

    if (isSunday) {
      return 'bg-[#ffd43b]';
    }

    return 'bg-white';
  };

  // =====================================================
  // AL
  // =====================================================

  const getAL = (record) => {
    if (record?.value !== 'AL') {
      return 0;
    }

    const status = record?.date_leave?.[0]?.status_request;

    return status === 'morning' || status === 'afternoon' ? 0.5 : 1;
  };

  // =====================================================
  // DAY OFF
  // =====================================================

  const getDayOff = (record) => {
    if (record?.value !== 'DayOff' && record?.value !== 'Day Off') {
      return 0;
    }

    return 0.5;
  };

  // =====================================================
  // UNPAID
  // =====================================================

  const getUnpaid = (record) => {
    return record?.value === 'UL' ? 0.5 : 0;
  };

  // =====================================================
  // LATE
  // =====================================================

  const getLate = (record) => {
    return record?.value === 'L' ? 1 : 0;
  };

  // =====================================================
  // EXPORT
  // =====================================================

  const handleExport = () => {
    if (!days.length) {
      message.warning('No data to export');

      return;
    }

    exportRef.current?.exportExcel?.();
  };

  // =====================================================
  // RENDER
  // =====================================================
  useEffect(() => {
    setContent(<div className="flex items-center justify-between"></div>);
  }, [navigate, setContent, collapsed]);
  return (
    <div className="w-full">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 text-[18px] font-semibold text-[#1f2937]">
          Attendance details For <span className="text-[#1677ff]">{monthLabel}</span>
        </h2>

        <div>
          <ConbineDataExport
            ref={exportRef}
            attendance={detail ? [detail] : []}
            filterMonth={{
              date_attendance: reportRange,
            }}
            filterDepartment={department}
          />

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
            className="!h-[40px] !rounded-[8px] !border-0 !bg-[#1677ff] !px-4 !text-[13px] !font-medium shadow-none"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* =================================================
          TOP INFORMATION
      ================================================= */}

      <div className="mb-3 grid grid-cols-1 gap-2 xl:grid-cols-[1.35fr_0.9fr_0.9fr_0.9fr]">
        {/* EMPLOYEE INFORMATION */}

        <div className="min-h-[75px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2.5">
          <div className="mb-2 text-[11px] font-semibold text-[#1f2937]">Employee Information</div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap text-[#374151]">Employee ID :</span>

              <span className="whitespace-nowrap font-medium text-[#374151]">(<span className='text-blue-500'>{info?.employee_id || ''}</span>)</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap text-[#374151]">Position :</span>

              <span className="whitespace-nowrap font-medium text-[#374151]">
                {info?.position || info?.position_name || ''}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap text-[#374151]">Department :</span>

              <span className="whitespace-nowrap font-medium text-[#374151]">
                {detail?.department_name || info?.department_name || info?.department || department || ''}
              </span>
            </div>
          </div>
        </div>

        {/* ATTENDANCE RULE */}

        <div className="min-h-[75px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2.5">
          <div className="mb-1 text-[11px] font-semibold text-[#1f2937]">Attendance rule</div>

          <div className="text-[11px] text-[#374151]">
            AL{' '}
            <span className="rounded-[3px] bg-[#ffd08a] px-1.5 py-0.5 text-[10px]">
              {detail?.attendance_rule?.grant_condition || detail?.rule?.grant_condition || 'After Probation'}
            </span>
          </div>

          <div className="mt-1 text-[16px] leading-none text-[#666]">
            {detail?.attendance_rule?.annual_leave ?? detail?.rule?.annual_leave ?? detail?.al_available ?? 0}
          </div>

          <div className="mt-1 text-[10px] text-[#9ca3af]">Days available</div>
        </div>

        {/* DAY OFF */}

        <div className="min-h-[75px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2.5">
          <div className="text-[11px] font-semibold text-[#1f2937]">Day Off</div>

          <div className="mt-1 text-[17px] font-semibold leading-none text-[#1677ff]">
            {detail?.attendance_rule?.day_off ?? detail?.rule?.day_off ?? detail?.day_off ?? 0}
          </div>

          <div className="mt-1 text-[10px] text-[#9ca3af]">of 4 days</div>
        </div>

        {/* ALLOW LATE */}

        <div className="min-h-[75px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2.5">
          <div className="text-[11px] font-semibold text-[#1f2937]">
            Allow late <span className="rounded-[3px] bg-[#ffd08a] px-1.5 py-0.5 text-[10px]">30min</span>
          </div>

          <div className="mt-1 text-[17px] leading-none text-[#666]">
            {detail?.attendance_rule?.allow_late ?? detail?.rule?.allow_late ?? detail?.allow_late ?? 0}
          </div>

          <div className="mt-1 text-[10px] text-[#9ca3af]">time per month</div>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mb-3 flex min-h-[44px] items-center justify-between rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2">
        <div className="whitespace-nowrap text-[11px] font-semibold text-[#374151]">Summary attendance</div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-[10px] text-[#6b7280]">Absent</div>

            <div className="text-[13px] font-semibold text-[#374151]">{summary.absent} day</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-[#6b7280]">Annual Leave</div>

            <div className="text-[13px] font-semibold text-[#1677ff]">{summary.annualLeave} day</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-[#6b7280]">Day Off</div>

            <div className="text-[13px] font-semibold text-[#16a34a]">{summary.dayOff} day</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-[#6b7280]">Unpaid Leave</div>

            <div className="text-[13px] font-semibold text-[#ef4444]">{summary.unpaidLeave} day</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-[#6b7280]">Late</div>

            <div className="text-[13px] font-semibold text-[#ef0000]">{summary.late} time</div>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="w-full overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#303030] text-white">
                <th className="w-[40px] border-r border-[#555] px-2 py-2 text-center font-semibold">No</th>

                <th className="w-[70px] border-r border-[#555] px-2 py-2 text-center font-semibold">Day</th>

                <th className="w-[100px] border-r border-[#555] px-2 py-2 text-center font-semibold">Date</th>

                <th className="w-[95px] border-r border-[#555] px-2 py-2 text-center font-semibold">Check In</th>

                <th className="w-[95px] border-r border-[#555] px-2 py-2 text-center font-semibold">Check Out</th>

                <th className="w-[110px] border-r border-[#555] px-2 py-2 text-center font-semibold">Note</th>

                <th className="min-w-[180px] border-r border-[#555] px-2 py-2 text-center font-semibold">Reason</th>

                <th className="w-[75px] border-r border-[#555] px-2 py-2 text-center font-semibold leading-tight">
                  AL(Day)
                </th>

                <th className="w-[90px] border-r border-[#555] px-2 py-2 text-center font-semibold leading-tight">
                  DayOff(Day)
                </th>

                <th className="w-[130px] border-r border-[#555] px-2 py-2 text-center font-semibold leading-tight">
                  Unpaid Leave(Day)
                </th>

                <th className="w-[70px] px-2 py-2 text-center font-semibold">Late</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="h-[180px] text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#1677ff]" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : days.length === 0 ? (
                <tr>
                  <td colSpan={11} className="h-[180px] text-center text-gray-400">
                    No attendance detail found.
                  </td>
                </tr>
              ) : (
                days.map((record, index) => {
                  const rowClass = getRowClass(record);

                  const isHoliday = record?.value === 'H';

                  const isSunday = record?.day === 'Sun' || dayjs(record?.date).day() === 0;

                  return (
                    <tr
                      key={record?.id || record?._id || record?.date || index}
                      className={`border-b border-[#e5e7eb] last:border-b-0 ${rowClass} `}
                    >
                      {/* NO */}

                      <td
                        className={`whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center ${isSunday ? 'text-black' : ''
                          } `}
                      >
                        {index + 1}
                      </td>

                      {/* DAY */}

                      <td className="whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center">
                        {record?.day || ''}
                      </td>

                      {/* DATE */}

                      <td
                        className={`whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center ${isHoliday ? 'text-black' : ''
                          } `}
                      >
                        {record?.date || ''}
                      </td>

                      {/* CHECK IN */}

                      <td
                        className={`whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center ${record?.value === 'L' ? 'text-red-500' : ''
                          } `}
                      >
                        {fmtTime(record?.time_check_in)}
                      </td>

                      {/* CHECK OUT */}

                      <td className="whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center">
                        {fmtTime(record?.time_check_out)}
                      </td>

                      {/* NOTE */}

                      <td className="whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center">
                        {getNote(record)}
                      </td>

                      {/* REASON */}

                      <td className="whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center">
                        <ReadMoreComponent text={String(record?.reason || record?.note || '')} />
                      </td>

                      {/* AL */}

                      <td className="whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center">
                        {getAL(record)}
                      </td>

                      {/* DAY OFF */}

                      <td
                        className={`whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center ${getDayOff(record) > 0 ? 'text-[#00a63c]' : ''
                          } `}
                      >
                        {getDayOff(record)}
                      </td>

                      {/* UNPAID */}

                      <td
                        className={`whitespace-nowrap border-r border-[#e5e7eb] px-2 py-2 text-center ${getUnpaid(record) > 0 ? 'text-red-500' : ''
                          } `}
                      >
                        {getUnpaid(record)}
                      </td>

                      {/* LATE */}

                      <td
                        className={`whitespace-nowrap px-2 py-2 text-center ${getLate(record) > 0 ? 'text-red-500' : ''
                          } `}
                      >
                        {getLate(record)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
