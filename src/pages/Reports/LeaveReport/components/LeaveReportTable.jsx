import { Radio } from 'antd';
import LeaveStatusTag from './LeaveStatusTag';
const LeaveReportTable = ({ data = [], selectedRow, onSelectRow }) => {
    // =====================================================
    // SELECT ROW
    // =====================================================
    const handleSelectRow = (row) => {
        if (onSelectRow) {
            onSelectRow(row);
        }
    };

    return (
        <div className="px-5 pb-5">
            <div className="overflow-hidden rounded-lg border border-gray-300">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1250px] border-collapse text-sm">
                        {/* =====================================================
                            HEADER
                        ===================================================== */}
                        <thead>
                            <tr className="bg-[#252525] text-white">
                                {/* RADIO */}
                                <th className="w-[38px] border-r border-gray-500 px-1 py-2 text-center"></th>

                                {/* NO */}
                                <th className="w-[45px] border-r border-gray-500 px-2 py-2 text-center">No</th>

                                {/* EMPLOYEE ID */}
                                <th className="w-[85px] border-r border-gray-500 px-2 py-2 text-left leading-tight">
                                    Employee

                                    ID
                                </th>

                                {/* FULL NAME */}
                                <th className="w-[105px] border-r border-gray-500 px-2 py-2 text-left">Full Name</th>

                                {/* DEPARTMENT */}
                                <th className="w-[125px] border-r border-gray-500 px-2 py-2 text-center">Department</th>

                                {/* POSITION */}
                                <th className="w-[110px] border-r border-gray-500 px-2 py-2 text-center">Position</th>

                                {/* LEAVE TYPE */}
                                <th className="w-[125px] border-r border-gray-500 px-2 py-2 text-center">Leave type</th>

                                {/* FROM */}
                                <th className="w-[105px] border-r border-gray-500 px-2 py-2 text-center">From</th>

                                {/* TO */}
                                <th className="w-[105px] border-r border-gray-500 px-2 py-2 text-center">To</th>

                                {/* DAY */}
                                <th className="w-[60px] border-r border-gray-500 px-2 py-2 text-center">Day</th>

                                {/* REASON */}
                                <th className="w-[105px] border-r border-gray-500 px-2 py-2 text-center">Reason</th>

                                {/* REQUESTED */}
                                <th className="w-[130px] border-r border-gray-500 px-2 py-2 text-center">Requested</th>

                                {/* STATUS */}
                                <th className="w-[100px] px-2 py-2 text-center">Status</th>
                            </tr>
                        </thead>

                        {/* =====================================================
                            BODY
                        ===================================================== */}
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={13} className="h-[115px] py-8 text-center text-gray-400">
                                        No leave request found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, index) => {
                                    const isAbsent =
                                        String(row?.leaveType || '')
                                            .trim()
                                            .toLowerCase() === 'absent';

                                    const rowId = row?._id || row?.id;

                                    const selectedId = selectedRow?._id || selectedRow?.id;

                                    const isSelected = selectedId === rowId;

                                    /*
                                     * Only these cells become red
                                     * when leave type is Absent:
                                     *
                                     * Leave type
                                     * From
                                     * To
                                     * Day
                                     */
                                    const absentCellClass = isAbsent ? 'bg-[#ff0000] text-black' : '';

                                    return (
                                        <tr
                                            key={rowId || `leave-row-${index}`}
                                            className={`border-b border-gray-200 last:border-b-0 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                                        >
                                            {/* =================================================
                                                RADIO
                                            ================================================= */}
                                            <td className="w-[38px] border-r border-gray-200 px-1 py-2 text-center">
                                                <Radio checked={isSelected} onChange={() => handleSelectRow(row)} />
                                            </td>

                                            {/* =================================================
                                                NO
                                            ================================================= */}
                                            <td className="w-[45px] border-r border-gray-200 px-2 py-2 text-center">{index + 1}</td>

                                            {/* =================================================
                                                EMPLOYEE ID
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2 font-medium text-[#1677ff]">
                                                {row?.employeeId || row?.employee_id || '-'}
                                            </td>

                                            {/* =================================================
                                                FULL NAME
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2">
                                                {row?.fullName || row?.full_name || row?.employeeName || row?.employee_name || '-'}
                                            </td>

                                            {/* =================================================
                                                DEPARTMENT
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2 text-center leading-tight">
                                                {row?.department || '-'}
                                            </td>

                                            {/* =================================================
                                                POSITION
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2 text-center">{row?.position || '-'}</td>

                                            {/* =================================================
                                                LEAVE TYPE
                                            ================================================= */}
                                            <td className={`border-r border-gray-200 px-2 py-2 text-center ${absentCellClass}`}>
                                                <LeaveStatusTag value={row?.leaveType} />
                                            </td>

                                            {/* =================================================
                                                FROM
                                            ================================================= */}
                                            <td
                                                className={`whitespace-nowrap border-r border-gray-200 px-2 py-2 text-center ${absentCellClass}`}
                                            >
                                                {row?.from || '-'}
                                            </td>

                                            {/* =================================================
                                                TO
                                            ================================================= */}
                                            <td
                                                className={`whitespace-nowrap border-r border-gray-200 px-2 py-2 text-center ${absentCellClass}`}
                                            >
                                                {row?.to || '-'}
                                            </td>

                                            {/* =================================================
                                                DAY
                                            ================================================= */}
                                            <td className={`border-r border-gray-200 px-2 py-2 text-center ${absentCellClass}`}>
                                                {row?.day ?? '-'}
                                            </td>

                                            {/* =================================================
                                                REASON
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2 text-center">{row?.reason || ''}</td>

                                            {/* =================================================
                                                REQUESTED
                                            ================================================= */}
                                            <td className="border-r border-gray-200 px-2 py-2 text-center">
                                                <div className="whitespace-nowrap text-[#1677ff]">{row?.requestedBy || '-'}</div>

                                                <div className="whitespace-nowrap text-xs text-gray-700">{row?.requestedDate || ''}</div>
                                            </td>

                                            {/* =================================================
                                                STATUS
                                            ================================================= */}
                                            <td className="px-2 py-2 text-center">
                                                {row?.status === 'approved' ? (
                                                    <span className="font-medium text-green-500">Approved</span>
                                                ) : row?.status === 'pending' ? (
                                                    <span className="font-medium text-orange-500">Pending</span>
                                                ) : row?.status === 'rejected' ? (
                                                    <span className="font-medium text-red-500">Rejected</span>
                                                ) : (
                                                    <span className="font-medium text-gray-500">{row?.status || '-'}</span>
                                                )}
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
};
export default LeaveReportTable;
