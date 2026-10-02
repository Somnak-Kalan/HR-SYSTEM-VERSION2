import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import ReadMoreComponent from '../../../../components/ReadMore';

import { useAttendanceStore } from '../../../../stores/Reports/attendance.store';

export default function AttendanceList(props) {
  const { access_token, setShowDetail, filterSearch, showDetail, filterMonth, clickAgain, setClickAgain } = props;

  const navigate = useNavigate();

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const requestingRef = useRef(false);

  // =====================================================
  // STORE
  // =====================================================

  const attendance_list = useAttendanceStore((state) => state.attendanceList);

  const listLoading = useAttendanceStore((state) => state.listLoading);

  const fetchAttendanceList = useAttendanceStore((state) => state.fetchAttendanceList);

  // =====================================================
  // DATE CHECK
  // =====================================================

  const hasDateAttendance = useMemo(() => {
    const date = filterMonth?.date_attendance;

    return Array.isArray(date) && date.length === 2 && Boolean(date[0]) && Boolean(date[1]);
  }, [filterMonth?.date_attendance]);

  // =====================================================
  // FILTER CHECK
  // =====================================================

  const hasSelectedFilter = useMemo(() => {
    const employeeId = filterMonth?.employeeId || filterMonth?.employee_id;

    const departmentId = filterMonth?.departmentId || filterMonth?.department_id;

    return Boolean(employeeId || departmentId);
  }, [filterMonth?.employeeId, filterMonth?.employee_id, filterMonth?.departmentId, filterMonth?.department_id]);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    if (!clickAgain) {
      return;
    }

    if (showDetail || !hasDateAttendance || !hasSelectedFilter) {
      setClickAgain?.(false);

      return;
    }

    if (requestingRef.current) {
      return;
    }

    requestingRef.current = true;

    const loadData = async () => {
      setCurrentPage(1);

      try {
        await fetchAttendanceList({
          filterMonth,
          pageSize,
          access_token,
          force: true,
        });
      } catch (error) {
        console.error('Fetch attendance list error:', error);
      } finally {
        requestingRef.current = false;

        setClickAgain?.(false);
      }
    };

    loadData();
  }, [
    clickAgain,
    showDetail,
    hasDateAttendance,
    hasSelectedFilter,
    filterMonth,
    access_token,
    fetchAttendanceList,
    setClickAgain,
  ]);

  // =====================================================
  // EMPLOYEE NUMBER
  // =====================================================

  const extractNumber = (id) => {
    const match = String(id || '').match(/\d+/);

    return match ? parseInt(match[0], 10) : 0;
  };

  // =====================================================
  // DATA
  // =====================================================

  const dataSource = useMemo(() => {
    const list = Array.isArray(attendance_list)
      ? attendance_list
      : Array.isArray(attendance_list?.data)
        ? attendance_list.data
        : [];

    const sorted = [...list].sort((first, second) => {
      const firstNumber = extractNumber(first?.info?.employee_id);

      const secondNumber = extractNumber(second?.info?.employee_id);

      return firstNumber - secondNumber;
    });

    if (!filterSearch) {
      return sorted;
    }

    const keyword = String(filterSearch).toLowerCase().trim();

    return sorted.filter((item) =>
      String(item?.department_name || '')
        .toLowerCase()
        .includes(keyword)
    );
  }, [attendance_list, filterSearch]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(1, Math.ceil(dataSource.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return dataSource.slice(start, start + pageSize);
  }, [dataSource, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =====================================================
  // ROUTE DETAIL
  // =====================================================

  const onRouteTo = (record) => {
    const employeeId = record?._id || record?.id;

    if (!employeeId) {
      return;
    }

    const url = `/attendance-list/detail/${employeeId}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // =====================================================
  // VALUES
  // =====================================================

  const getEmployeeId = (record) => record?.info?.employee_id || record?.employee_id || '';

  const getFullName = (record) => {
    const khmerName =
      record?.info?.name ||
      [record?.info?.first_name || '', record?.info?.last_name || ''].filter(Boolean).join(' ').trim();

    const latinName = record?.info?.nameLatin || record?.nameLatin || '';

    return latinName ? `${khmerName} (${latinName})` : khmerName;
  };

  const getLateAmount = (record) => {
    return record?.late_amount ?? record?.lateAmount ?? record?.late_fee ?? record?.lateFee ?? '';
  };

  const getLateDisplay = (record) => {
    const late = record?.late ?? 0;

    const amount = getLateAmount(record);

    if (amount !== '' && amount !== null && amount !== undefined) {
      return (
        <span className="whitespace-nowrap">
          {late} <span className="text-orange-500">({amount}$)</span>
        </span>
      );
    }

    return late;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full min-w-0">
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-[12px]">
            <colgroup>
              <col className="w-[45px]" />
              <col className="w-[90px]" />
              <col className="w-[180px]" />
              <col className="w-[170px]" />
              <col className="w-[150px]" />
              <col className="w-[110px]" />
              <col className="w-[100px]" />
              <col className="w-[60px]" />
              <col className="w-[70px]" />
              <col className="w-[90px]" />
              <col className="w-[70px]" />
              <col className="w-[70px]" />
            </colgroup>

            {/* HEADER */}
            <thead>
              <tr className="bg-[#2d2d2d] text-white">
                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-center font-semibold">No</th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-left font-semibold">
                  Employee ID
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-left font-semibold">
                  Full Name
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-left font-semibold">
                  Department
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-left font-semibold">
                  Position
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-center font-semibold">
                  Month
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-center font-semibold">
                  Working Day
                </th>

                <th className="border-r border-gray-500 px-2 py-2 text-center font-semibold">AL</th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-center font-semibold">
                  Day Off
                </th>

                <th className="whitespace-nowrap border-r border-gray-500 px-2 py-2 text-center font-semibold">
                  Unpaid Leave
                </th>

                <th className="border-r border-gray-500 px-2 py-2 text-center font-semibold">Late</th>

                <th className="px-2 py-2 text-center font-semibold">Absent</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan={12} className="h-[180px] text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#1677ff]" />

                      <span>Loading attendance...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="h-[180px] text-center text-gray-400">
                    No attendance data found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => (
                  <tr key={record?.id || record?._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">{index + 1}</td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3">
                      <button
                        type="button"
                        onClick={() => onRouteTo(record)}
                        className="whitespace-nowrap font-medium text-[#1677ff] hover:underline"
                      >
                        {getEmployeeId(record)}
                      </button>
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3">
                      <button
                        type="button"
                        onClick={() => onRouteTo(record)}
                        className="whitespace-nowrap text-left text-[#1677ff] hover:underline"
                      >
                        {getFullName(record)}
                      </button>
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3">
                      {record?.department_name || record?.department || '-'}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3">
                      {record?.position_name || record?.position || '-'}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {record?.month || '-'}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {record?.working_days ?? record?.working_day ?? 0}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {record?.al ?? 0}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {record?.day_off ?? 0}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {record?.unpaid_leave ?? 0}
                    </td>

                    <td className="whitespace-nowrap border-r border-gray-200 px-2 py-3 text-center">
                      {getLateDisplay(record)}
                    </td>

                    <td className="whitespace-nowrap px-2 py-3 text-center">
                      {record?.absent ?? record?.count_a ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {dataSource.length > pageSize && (
          <div className="flex flex-col gap-2 border-t border-gray-200 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}
              {' - '}
              {Math.min(currentPage * pageSize, dataSource.length)}
              {' of '}
              {dataSource.length}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="whitespace-nowrap px-2 text-gray-600">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
