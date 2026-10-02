const AttendanceSummary = ({ balances = {} }) => {
    return (
        <div>
            <div className="mb-2 text-sm font-semibold text-gray-700">
                Attendance rule of employee
            </div>

            <div className="flex w-full flex-wrap gap-2 rounded-xl border border-[#b8d7ff] bg-[#edf5ff] px-3 py-3">

                {/* =====================================================
                    ANNUAL LEAVE
                ===================================================== */}
                <div className="w-[210px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">

                    <div className="mb-1 flex items-center text-sm font-semibold text-gray-600">
                        AL

                        <span className="ml-2 rounded-md bg-[#ffc978] px-2 py-0.5 text-xs font-normal text-gray-800">
                            After Probation
                        </span>
                    </div>

                    <div className="flex items-end">
                        <span className="text-2xl font-semibold text-[#165dff]">
                            {balances.annualLeave ?? 0}
                        </span>

                        <span className="ml-1 pb-0.5 text-sm font-normal text-gray-500">
                            Days available
                        </span>
                    </div>

                    {balances.annualLeaveExpiry && (
                        <div className="mt-1 text-sm text-gray-700">
                            Expires on:{' '}
                            {balances.annualLeaveExpiry}
                        </div>
                    )}
                </div>

                {/* =====================================================
                    DAY OFF
                ===================================================== */}
                <div className="w-[170px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">

                    <div className="mb-1 text-sm font-semibold text-gray-800">
                        Day Off
                    </div>

                    <div className="text-2xl font-semibold text-[#165dff]">
                        {balances.dayOff ?? 0}
                    </div>

                    <div className="text-sm text-gray-500">
                        of {balances.dayOffTotal ?? 0} days
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSummary;