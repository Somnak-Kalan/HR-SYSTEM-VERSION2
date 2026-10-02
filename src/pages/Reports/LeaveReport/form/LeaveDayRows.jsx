import {
    MinusCircleOutlined,
} from '@ant-design/icons';

import { Radio, Select } from 'antd';

import dayjs from 'dayjs';

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    const date = dayjs(value);

    if (!date.isValid()) {
        return value;
    }

    return date.format('YYYY-MMMM-DD');
};

// =====================================================
// GET DAY NAME
// =====================================================
// import '../LeaveType.scss'
const getDayName = (value) => {
    if (!value) {
        return '';
    }

    const date = dayjs(value);

    if (!date.isValid()) {
        return '';
    }

    return date.format('dddd');
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const LeaveDayRows = ({
    rows = [],
    setRows,
    onSessionChange,
    onLeaveTypeChange,
    mode = 'create',
    leaveTypeOptions = [],
}) => {
    // =====================================================
    // REMOVE ROW
    // =====================================================
    const removeRow = (index) => {
        setRows((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // =====================================================
    // HANDLE SESSION
    // =====================================================

    const handleSessionChange = (
        index,
        value
    ) => {
        if (onSessionChange) {
            onSessionChange(
                index,
                value
            );

            return;
        }

        setRows((prev) =>
            prev.map(
                (item, i) =>
                    i === index
                        ? {
                            ...item,
                            session:
                                value,
                        }
                        : item
            )
        );
    };



    // =====================================================
    // HANDLE LEAVE TYPE - UPDATE MODE ONLY
    // =====================================================

    const handleLeaveTypeChange = (
        index,
        value
    ) => {
        if (onLeaveTypeChange) {
            onLeaveTypeChange(
                index,
                value
            );

            return;
        }

        setRows((prev) =>
            prev.map(
                (item, i) =>
                    i === index
                        ? {
                            ...item,
                            leaveType:
                                value,
                        }
                        : item
            )
        );
    };

    // =====================================================
    // EMPTY
    // =====================================================

    if (!rows?.length) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-1">
            {rows.map(
                (row, index) => {
                    const leaveType =
                        row?.leaveType ||
                        'Annual Leave';

                    return (
                        <div
                            key={`${index}-${leaveType}-${row?.from}-${row?.to}`}
                        >
                            {/* =================================================
                                LEAVE TYPE
                            ================================================= */}

                            {mode === 'edit' ? (
                                <div className="mb-3">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        <span className="text-red-500">
                                            *
                                        </span>{' '}
                                        All leave type
                                    </label>

                                    <Select
                                        value={
                                            leaveType
                                        }
                                        onChange={(value) =>
                                            handleLeaveTypeChange(
                                                index,
                                                value
                                            )
                                        }
                                        className="w-full"
                                        options={
                                            leaveTypeOptions.length
                                                ? leaveTypeOptions
                                                : [
                                                    {
                                                        label: leaveType,
                                                        value: leaveType,
                                                    },
                                                ]
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="mb-1 text-sm font-semibold text-gray-900">
                                    {leaveType}
                                </div>
                            )}

                            {/* =================================================
                                DATE / SESSION ROW
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    min-h-[25px]
                                    w-full
                                    flex-col
                                    gap-3
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-1
                                    py-1
                                    
                                    shadow-sm
                                    transition
                                    lg:flex-row
                                    lg:items-center
                                "
                            >
                                {/* =============================================
                                    FROM DATE
                                ============================================= */}

                                <div
                                    className="
                                        min-w-[145px]
                                        text-[12px]
                                        font-medium
                                        text-[#2459e8]
                                    "
                                >
                                    {formatDate(
                                        row?.from
                                    )}
                                </div>

                                {/* =============================================
                                    DAY
                                ============================================= */}

                                <div
                                    className="
                                        min-w-[110px]
                                        text-[12px]
                                        font-medium
                                        text-[#2459e8]
                                    "
                                >
                                    {getDayName(
                                        row?.from
                                    )}
                                </div>

                                {/* =============================================
                                    TO DATE
                                ============================================= */}

                                <div
                                    className="
                                        min-w-[145px]
                                        text-[12px]
                                        font-medium
                                        text-[#2459e8]
                                    "
                                >
                                    {formatDate(
                                        row?.to
                                    )}
                                </div>

                                {/* =============================================
                                    SESSION
                                ============================================= */}

                                <div className="flex flex-1 items-center lg:justify-center text-[12px]">
                                    <Radio.Group
                                        value={
                                            row?.session ||
                                            'Full Day'
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleSessionChange(
                                                index,
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-x-5
                                                gap-y-2
                                            "
                                        >
                                            <Radio value="Full Day" className='text-[12px]'>
                                                Full Day
                                            </Radio>

                                            <Radio value="Morning" className='text-[12px]'>
                                                Morning
                                            </Radio>

                                            <Radio value="Afternoon" className='text-[12px]'>
                                                Afternoon
                                            </Radio>
                                        </div>
                                    </Radio.Group>
                                </div>

                                {/* =============================================
                                    REMOVE
                                ============================================= */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeRow(
                                            index
                                        )
                                    }
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-lg
                                        text-red-500
                                        transition-all
                                        duration-200
                                        hover:bg-red-50
                                        hover:text-red-600
                                        active:scale-90
                                    "
                                >
                                    <MinusCircleOutlined />
                                </button>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default LeaveDayRows;