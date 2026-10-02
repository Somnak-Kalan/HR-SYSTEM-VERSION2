import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import {
    DatePicker,
    Input,
    Modal,
    Select,
} from 'antd';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import dayjs from 'dayjs';

import AttendanceSummary from '../form/AttendanceSummary';
import LeaveDayRows from '../form/LeaveDayRows';
import LeaveDocuments from '../form/LeaveDocuments';
import LeaveApprovers from '../form/LeaveApprovers';
import '../LeaveType.scss'
import TickCirleIcon from '../../../../assets/icons/tickCircleIcon.svg'
import DesktopIcon from '../../../../assets/icons/Desktop.svg'
// =====================================================
// DEFAULT ROWS
// =====================================================

const DEFAULT_ROWS = [
    {
        leaveType: 'Annual Leave',
        from: '2026-06-07',
        to: '2026-06-08',
        session: 'Full Day',
        allocatedDays: 1,
        autoConverted: false,
    },
];

// =====================================================
// EMPLOYEE MOCK DATA
// Replace later with API / Store
// =====================================================

const EMPLOYEE_DATA = {
    'VTS-001': {
        department: 'IT',
        fullName: 'John Doe',
    },

    'VTS-002': {
        department: 'Accounting',
        fullName: 'Employee',
    },

    'VTS-036': {
        department:
            'Customer services',
        fullName: 'Employee',
    },
};

// =====================================================
// EMPLOYEE OPTIONS
// =====================================================

const EMPLOYEE_OPTIONS = [
    {
        label:
            'VTS001 – John Doe',
        value: 'VTS-001',
    },
    {
        label:
            'VTS002 – Employee',
        value: 'VTS-002',
    },
    {
        label:
            'VTS036 – Employee',
        value: 'VTS-036',
    },
];

// =====================================================
// LEAVE TYPE OPTIONS
// =====================================================

const LEAVE_TYPE_OPTIONS = [
    {
        label: 'Annual Leave',
        value: 'Annual Leave',
    },
    {
        label: 'Day-off',
        value: 'Day-off',
    },
    {
        label: 'Unpaid',
        value: 'Unpaid',
    },
    {
        label: 'Absent',
        value: 'Absent',
    },
];

// =====================================================
// FORMAT DAYS
// =====================================================

const formatDays = (value) => {
    const number =
        Number(value) || 0;

    if (
        Number.isInteger(
            number
        )
    ) {
        return number;
    }

    return Number(
        number.toFixed(1)
    );
};

// =====================================================
// CALCULATE REQUESTED DAYS
//
// Example:
//
// June 07 -> June 08 = 1 day
//
// Full Day  = 1
// Morning   = 0.5
// Afternoon = 0.5
// =====================================================

const calculateRequestedDays = (
    from,
    to,
    session = 'Full Day'
) => {
    const start =
        dayjs(from).startOf('day');

    const end =
        dayjs(to).startOf('day');

    if (
        !start.isValid() ||
        !end.isValid()
    ) {
        return 0;
    }

    if (
        end.isBefore(start)
    ) {
        return 0;
    }

    let days =
        end.diff(
            start,
            'day'
        );

    // Same day
    if (days === 0) {
        days = 1;
    }

    // Half day
    if (
        session === 'Morning' ||
        session === 'Afternoon'
    ) {
        days =
            Math.max(
                0.5,
                days - 0.5
            );
    }

    return days;
};

// =====================================================
// GET SESSION FROM DAYS
// =====================================================

const getSessionByDays = (
    days,
    overflow = false
) => {
    const number =
        Number(days) || 0;

    if (number === 0.5) {
        return overflow
            ? 'Afternoon'
            : 'Morning';
    }

    if (
        number % 1 === 0.5
    ) {
        return overflow
            ? 'Afternoon'
            : 'Morning';
    }

    return 'Full Day';
};

// =====================================================
// AUTO ALLOCATE LEAVE
//
// Annual Leave
//       ↓
// Day-off
//       ↓
// Unpaid
// =====================================================

const buildAutoLeaveRows = ({
    leaveType,
    from,
    to,
    requestedDays,
    balances,
}) => {
    const result = [];

    let remaining =
        Number(
            requestedDays
        ) || 0;

    // =================================================
    // ANNUAL LEAVE
    // =================================================

    if (
        leaveType ===
        'Annual Leave'
    ) {
        const annualAvailable =
            Number(
                balances?.annualLeave
            ) || 0;

        const annualUsed =
            Math.min(
                remaining,
                annualAvailable
            );

        // =============================================
        // USE ANNUAL LEAVE FIRST
        // =============================================

        if (annualUsed > 0) {
            result.push({
                leaveType:
                    'Annual Leave',

                from,

                to,

                session:
                    getSessionByDays(
                        annualUsed,
                        false
                    ),

                allocatedDays:
                    annualUsed,

                autoConverted:
                    false,
            });

            remaining =
                remaining -
                annualUsed;
        }

        // =============================================
        // NOT ENOUGH AL
        // AUTO USE DAY-OFF
        // =============================================

        if (remaining > 0) {
            const dayOffAvailable =
                Number(
                    balances?.dayOff
                ) || 0;

            const dayOffUsed =
                Math.min(
                    remaining,
                    dayOffAvailable
                );

            if (
                dayOffUsed > 0
            ) {
                result.push({
                    leaveType:
                        'Day-off',

                    from,

                    to,

                    session:
                        getSessionByDays(
                            dayOffUsed,
                            true
                        ),

                    allocatedDays:
                        dayOffUsed,

                    autoConverted:
                        true,

                    convertedFrom:
                        'Annual Leave',
                });

                remaining =
                    remaining -
                    dayOffUsed;
            }
        }

        // =============================================
        // NO AL AND NO DAY OFF
        // AUTO UNPAID
        // =============================================

        if (remaining > 0) {
            result.push({
                leaveType:
                    'Unpaid',

                from,

                to,

                session:
                    getSessionByDays(
                        remaining,
                        true
                    ),

                allocatedDays:
                    remaining,

                autoConverted:
                    true,

                convertedFrom:
                    'Annual Leave',
            });

            remaining = 0;
        }

        return result;
    }

    // =================================================
    // DAY-OFF
    // =================================================

    if (
        leaveType ===
        'Day-off'
    ) {
        const dayOffAvailable =
            Number(
                balances?.dayOff
            ) || 0;

        const dayOffUsed =
            Math.min(
                remaining,
                dayOffAvailable
            );

        if (
            dayOffUsed > 0
        ) {
            result.push({
                leaveType:
                    'Day-off',

                from,

                to,

                session:
                    getSessionByDays(
                        dayOffUsed
                    ),

                allocatedDays:
                    dayOffUsed,

                autoConverted:
                    false,
            });

            remaining =
                remaining -
                dayOffUsed;
        }

        // =============================================
        // NO ENOUGH DAY OFF -> UNPAID
        // =============================================

        if (remaining > 0) {
            result.push({
                leaveType:
                    'Unpaid',

                from,

                to,

                session:
                    getSessionByDays(
                        remaining,
                        true
                    ),

                allocatedDays:
                    remaining,

                autoConverted:
                    true,

                convertedFrom:
                    'Day-off',
            });
        }

        return result;
    }

    // =================================================
    // OTHER LEAVE
    // =================================================

    return [
        {
            leaveType,

            from,

            to,

            session:
                getSessionByDays(
                    requestedDays
                ),

            allocatedDays:
                requestedDays,

            autoConverted:
                false,
        },
    ];
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const LeaveRequestModal = ({
    open,
    mode = 'create',
    request,
    onClose,
    onSubmit,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const [employee, setEmployee] =
        useState('');

    const [department, setDepartment] =
        useState('');

    const [leaveType, setLeaveType] =
        useState(
            'Annual Leave'
        );

    const [dateRange, setDateRange] =
        useState(null);

    const [reason, setReason] =
        useState('');

    const [manager, setManager] =
        useState(
            'Lux Kimleng'
        );

    const [hr, setHr] =
        useState(
            'Sin Sovanlyda'
        );

    const [rows, setRows] =
        useState(
            DEFAULT_ROWS
        );

    const [submitting, setSubmitting] =
        useState(false);

    // =====================================================
    // MOCK BALANCE
    //
    // Example:
    // Annual Leave = 1.5
    // Day Off = 4
    // =====================================================

    const [balances] =
        useState({
            annualLeave: 1.5,

            annualLeaveExpiry:
                'June 2026',

            dayOff: 4,

            dayOffTotal: 4,
        });

    // =====================================================
    // OPEN / RESET MODAL
    // =====================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        // =================================================
        // EDIT MODE
        // =================================================

        if (
            mode === 'edit' &&
            request
        ) {
            const employeeId =
                request?.employeeId ||
                request?.employee_id ||
                '';

            const requestLeaveType =
                request?.leaveType ||
                request?.leave_type ||
                'Annual Leave';

            const fromDate =
                request?.from ||
                '';

            const toDate =
                request?.to ||
                request?.from ||
                '';

            setEmployee(
                employeeId
            );

            setDepartment(
                request?.department ||
                ''
            );

            setLeaveType(
                requestLeaveType
            );

            setReason(
                request?.reason ||
                ''
            );

            // =============================================
            // DATE
            // =============================================

            if (
                fromDate &&
                toDate &&
                dayjs(
                    fromDate
                ).isValid() &&
                dayjs(
                    toDate
                ).isValid()
            ) {
                setDateRange([
                    dayjs(
                        fromDate
                    ),

                    dayjs(
                        toDate
                    ),
                ]);
            } else {
                setDateRange(
                    null
                );
            }

            // =============================================
            // ROWS
            // =============================================

            if (
                Array.isArray(
                    request?.rows
                ) &&
                request.rows
                    .length > 0
            ) {
                setRows(
                    request.rows
                );
            } else {
                const totalDays =
                    calculateRequestedDays(
                        fromDate,
                        toDate,
                        'Full Day'
                    );

                const editRows =
                    buildAutoLeaveRows({
                        leaveType:
                            requestLeaveType,

                        from:
                            fromDate,

                        to:
                            toDate,

                        requestedDays:
                            totalDays,

                        balances,
                    });

                setRows(
                    editRows
                );
            }

            return;
        }

        // =================================================
        // CREATE MODE
        // =================================================

        setEmployee('');

        setDepartment('');

        setLeaveType(
            'Annual Leave'
        );

        setDateRange(null);

        setReason('');

        setManager(
            'Lux Kimleng'
        );

        setHr(
            'Sin Sovanlyda'
        );

        setRows(
            DEFAULT_ROWS.map(
                (item) => ({
                    ...item,
                })
            )
        );

        setSubmitting(
            false
        );
    }, [
        open,
        mode,
        request,
        balances,
    ]);

    // =====================================================
    // EMPLOYEE DEPARTMENT
    // =====================================================

    useEffect(() => {
        if (!employee) {
            setDepartment('');

            return;
        }

        const result =
            EMPLOYEE_DATA[
            employee
            ];

        if (result) {
            setDepartment(
                result?.department ||
                ''
            );
        }
    }, [employee]);

    // =====================================================
    // REQUESTED DAYS
    // =====================================================

    const requestedDays =
        useMemo(() => {
            return rows.reduce(
                (
                    total,
                    row
                ) => {
                    if (
                        row?.allocatedDays !==
                        undefined &&
                        row?.allocatedDays !==
                        null
                    ) {
                        return (
                            total +
                            Number(
                                row
                                    .allocatedDays
                            )
                        );
                    }

                    return (
                        total +
                        calculateRequestedDays(
                            row?.from,
                            row?.to,
                            row?.session
                        )
                    );
                },
                0
            );
        }, [rows]);

    // =====================================================
    // CONVERSION INFORMATION
    // =====================================================

    const conversionInfo =
        useMemo(() => {
            let dayOff = 0;

            let unpaid = 0;

            rows.forEach(
                (row) => {
                    if (
                        !row?.autoConverted
                    ) {
                        return;
                    }

                    if (
                        row?.leaveType ===
                        'Day-off'
                    ) {
                        dayOff +=
                            Number(
                                row
                                    ?.allocatedDays
                            ) ||
                            0;
                    }

                    if (
                        row?.leaveType ===
                        'Unpaid'
                    ) {
                        unpaid +=
                            Number(
                                row
                                    ?.allocatedDays
                            ) ||
                            0;
                    }
                }
            );

            return {
                dayOff,

                unpaid,

                hasConversion:
                    dayOff >
                    0 ||
                    unpaid >
                    0,
            };
        }, [rows]);

    // =====================================================
    // AVAILABLE BALANCE AFTER REQUEST
    // =====================================================

    const availableAfterRequest =
        useMemo(() => {
            if (
                leaveType ===
                'Annual Leave'
            ) {
                const available =
                    Number(
                        balances
                            ?.annualLeave
                    ) || 0;

                const annualUsed =
                    rows
                        .filter(
                            (
                                row
                            ) =>
                                row
                                    ?.leaveType ===
                                'Annual Leave'
                        )
                        .reduce(
                            (
                                total,
                                row
                            ) =>
                                total +
                                Number(
                                    row
                                        ?.allocatedDays ||
                                    0
                                ),
                            0
                        );

                return Math.max(
                    0,

                    available -
                    annualUsed
                );
            }

            if (
                leaveType ===
                'Day-off'
            ) {
                const available =
                    Number(
                        balances
                            ?.dayOff
                    ) || 0;

                const used =
                    rows
                        .filter(
                            (
                                row
                            ) =>
                                row
                                    ?.leaveType ===
                                'Day-off'
                        )
                        .reduce(
                            (
                                total,
                                row
                            ) =>
                                total +
                                Number(
                                    row
                                        ?.allocatedDays ||
                                    0
                                ),
                            0
                        );

                return Math.max(
                    0,

                    available -
                    used
                );
            }

            return 0;
        }, [
            leaveType,
            balances,
            rows,
        ]);

    // =====================================================
    // EMPLOYEE CHANGE
    // =====================================================

    const handleEmployeeChange =
        (value) => {
            setEmployee(
                value || ''
            );

            if (!value) {
                setDepartment(
                    ''
                );

                return;
            }

            const result =
                EMPLOYEE_DATA[
                value
                ];

            setDepartment(
                result
                    ?.department ||
                ''
            );
        };

    // =====================================================
    // LEAVE TYPE CHANGE
    // =====================================================

    const handleLeaveTypeChange =
        (value) => {
            setLeaveType(
                value
            );

            if (
                !dateRange?.[0] ||
                !dateRange?.[1]
            ) {
                setRows(
                    (
                        prev
                    ) =>
                        prev.map(
                            (
                                row
                            ) => ({
                                ...row,

                                leaveType:
                                    value,
                            })
                        )
                );

                return;
            }

            const from =
                dateRange[0].format(
                    'YYYY-MM-DD'
                );

            const to =
                dateRange[1].format(
                    'YYYY-MM-DD'
                );

            const totalDays =
                calculateRequestedDays(
                    from,
                    to,
                    'Full Day'
                );

            const nextRows =
                buildAutoLeaveRows({
                    leaveType:
                        value,

                    from,

                    to,

                    requestedDays:
                        totalDays,

                    balances,
                });

            setRows(
                nextRows
            );
        };

    // =====================================================
    // DATE RANGE CHANGE
    // =====================================================

    const handleDateRangeChange =
        (dates) => {
            setDateRange(
                dates
            );

            if (
                !dates ||
                !dates[0] ||
                !dates[1]
            ) {
                setRows([]);

                return;
            }

            const from =
                dates[0].format(
                    'YYYY-MM-DD'
                );

            const to =
                dates[1].format(
                    'YYYY-MM-DD'
                );

            const totalDays =
                calculateRequestedDays(
                    from,
                    to,
                    'Full Day'
                );

            const nextRows =
                buildAutoLeaveRows({
                    leaveType,

                    from,

                    to,

                    requestedDays:
                        totalDays,

                    balances,
                });

            setRows(
                nextRows
            );
        };

    // =====================================================
    // SESSION CHANGE
    // =====================================================

    const handleRowSessionChange = (
        index,
        session
    ) => {
        const currentRow =
            rows[index];

        if (!currentRow) {
            return;
        }

        // =================================================
        // FIRST ROW CONTROLS MAIN REQUEST
        // =================================================

        if (index === 0) {
            const totalDays =
                calculateRequestedDays(
                    currentRow
                        ?.from,
                    currentRow
                        ?.to,
                    session
                );

            const nextRows =
                buildAutoLeaveRows({
                    leaveType,

                    from:
                        currentRow
                            ?.from,

                    to:
                        currentRow
                            ?.to,

                    requestedDays:
                        totalDays,

                    balances,
                });

            // Keep selected session
            if (
                nextRows
                    .length === 1
            ) {
                nextRows[0] = {
                    ...nextRows[0],

                    session,
                };
            }

            setRows(
                nextRows
            );

            return;
        }

        // =================================================
        // CONVERTED ROW SESSION
        // =================================================

        setRows((prev) =>
            prev.map(
                (
                    row,
                    i
                ) =>
                    i ===
                        index
                        ? {
                            ...row,

                            session,

                            allocatedDays:
                                session ===
                                    'Full Day'
                                    ? 1
                                    : 0.5,
                        }
                        : row
            )
        );
    };

    // =====================================================
    // ROW LEAVE TYPE CHANGE
    // =====================================================

    const handleRowLeaveTypeChange = (
        index,
        value
    ) => {
        setRows((prev) =>
            prev.map(
                (
                    row,
                    i
                ) =>
                    i ===
                        index
                        ? {
                            ...row,

                            leaveType:
                                value,
                        }
                        : row
            )
        );
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm = () => {
        if (!employee) {
            return {
                valid: false,

                message:
                    'Please select employee',
            };
        }

        if (!department) {
            return {
                valid: false,

                message:
                    'Department is required',
            };
        }

        if (!leaveType) {
            return {
                valid: false,

                message:
                    'Please select leave type',
            };
        }

        if (
            !dateRange ||
            !dateRange?.[0] ||
            !dateRange?.[1]
        ) {
            return {
                valid: false,

                message:
                    'Please select leave date',
            };
        }

        if (
            !rows?.length
        ) {
            return {
                valid: false,

                message:
                    'Please select leave date',
            };
        }

        if (
            !reason.trim()
        ) {
            return {
                valid: false,

                message:
                    'Please enter leave reason',
            };
        }

        return {
            valid: true,
        };
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async () => {
            if (submitting) {
                return;
            }

            const validation =
                validateForm();

            if (
                !validation
                    .valid
            ) {
                Modal.warning({
                    title:
                        'Required information',

                    content:
                        validation
                            .message,

                    centered:
                        true,
                });

                return;
            }

            try {
                setSubmitting(
                    true
                );

                const employeeInfo =
                    EMPLOYEE_DATA[
                    employee
                    ];

                await onSubmit?.({
                    employeeId:
                        employee,

                    fullName:
                        employeeInfo
                            ?.fullName ||
                        employee,

                    department,

                    position:
                        request
                            ?.position ||
                        'Account-LCL',

                    leaveType,

                    from:
                        dateRange[0].format(
                            'YYYY-MM-DD'
                        ),

                    to:
                        dateRange[1].format(
                            'YYYY-MM-DD'
                        ),

                    day:
                        requestedDays,

                    reason:
                        reason.trim(),

                    requestedBy:
                        'Current User',

                    requestedDate:
                        dayjs().format(
                            'YYYY-MM-DD'
                        ),

                    manager,

                    hr,

                    rows,

                    // =====================================
                    // CONVERT INFO
                    // =====================================

                    conversion: {
                        dayOff:
                            conversionInfo
                                .dayOff,

                        unpaid:
                            conversionInfo
                                .unpaid,

                        hasConversion:
                            conversionInfo
                                .hasConversion,
                    },
                });
            } catch (
            error
            ) {
                console.error(
                    'Submit leave request error:',
                    error
                );
            } finally {
                setSubmitting(
                    false
                );
            }
        };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Modal
            open={open}
            onCancel={
                onClose
            }
            footer={null}
            centered
            width={1050}
            transitionName="ant-zoom-big"
            maskTransitionName="ant-fade"
            maskClosable={
                false
            }
            rootClassName='LeaveTypeModal'
            keyboard
            destroyOnClose
            title={null}
            closeIcon={null}
            styles={{
                mask: {
                    background:
                        'rgba(0, 0, 0, 0.55)',

                    backdropFilter:
                        'blur(3px)',
                },

                content: {
                    padding: 0,

                    borderRadius:
                        16,



                    boxShadow:
                        '0 25px 70px rgba(0, 0, 0, 0.25)',
                },

                body: {
                    padding: 0,
                },
            }}
        >
            <div
                className="
                    flex
    
                    w-full
                    flex-col
                    bg-white
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        border-b
                        border-gray-200
                        bg-white
                        px-5
                        py-4
                        sm:px-7
                    "
                >
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl">
                            {mode ===
                                'edit'
                                ? 'Update Leave Request'
                                : 'Add Leave Request'}
                        </h2>

                        <div className="mt-1 text-sm text-gray-400 flex">

                            <img src={DesktopIcon} alt="" />
                            <p className='mx-1'> Created by HR
                                on system</p>

                        </div>
                    </div>


                </div>

                {/* =================================================
                    BODY
                ================================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                
                        bg-white
                        px-5
                        py-5
                        sm:px-7
                    "
                >
                    {/* =================================================
                        EMPLOYEE / DEPARTMENT
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* EMPLOYEE */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="text-red-500">
                                    *
                                </span>{' '}
                                Employee
                            </label>

                            <Select
                                showSearch
                                allowClear
                                value={
                                    employee ||
                                    undefined
                                }
                                onChange={
                                    handleEmployeeChange
                                }
                                placeholder="Search by employee ID"
                                className="w-full"
                                suffixIcon={
                                    <SearchOutlined />
                                }
                                options={
                                    EMPLOYEE_OPTIONS
                                }
                                optionFilterProp="label"
                                filterOption={(
                                    input,
                                    option
                                ) =>
                                    (
                                        option
                                            ?.label ||
                                        ''
                                    )
                                        .toLowerCase()
                                        .includes(
                                            input.toLowerCase()
                                        )
                                }
                            />
                        </div>

                        {/* DEPARTMENT */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="text-red-500">
                                    *
                                </span>{' '}
                                Department
                            </label>

                            <Input
                                value={
                                    department
                                }
                                disabled
                                placeholder="Department"
                            />
                        </div>
                    </div>

                    {/* =================================================
                        ATTENDANCE
                    ================================================= */}

                    <div className="mt-5">
                        <AttendanceSummary
                            balances={
                                balances
                            }
                        />
                    </div>

                    {/* =================================================
                        LEAVE TYPE / DATE
                    ================================================= */}

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* LEAVE TYPE */}

                        <div>
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
                                onChange={
                                    handleLeaveTypeChange
                                }
                                className="w-full"
                                options={
                                    LEAVE_TYPE_OPTIONS
                                }
                            />
                        </div>

                        {/* DATE */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                <span className="text-red-500">
                                    *
                                </span>{' '}
                                Date (From,
                                To)
                            </label>

                            <DatePicker.RangePicker
                                value={
                                    dateRange
                                }
                                onChange={
                                    handleDateRangeChange
                                }
                                format="YYYY-MM-DD"
                                className="w-full"
                                suffixIcon={
                                    <CalendarOutlined />
                                }
                            />
                        </div>
                    </div>

                    {/* =================================================
                        SHIFT
                    ================================================= */}

                    <div className="mt-5 text-sm font-semibold text-gray-700">
                        Shift Name:{' '}

                        <span className="text-[#2459a6]">
                            M-Sat (Half)
                        </span>
                    </div>

                    {/* =================================================
                        DAY ROWS
                    ================================================= */}

                    <div className="mt-4">
                        <LeaveDayRows
                            rows={
                                rows
                            }
                            setRows={
                                setRows
                            }
                            onSessionChange={
                                handleRowSessionChange
                            }
                            onLeaveTypeChange={
                                handleRowLeaveTypeChange
                            }
                            mode={mode}
                        />
                    </div>

                    {/* =================================================
                        REQUEST SUMMARY
                    ================================================= */}

                    {rows.length >
                        0 && (
                            <div
                                className={`
                                mt-4
                                flex
                                flex-col
                                justify-between
                                gap-2
                                rounded-xl
                                border
                                px-5
                                py-3
                                text-sm
                                transition-all
                                duration-300
                                sm:flex-row
                                sm:items-center

                                ${conversionInfo
                                        .hasConversion
                                        ? `
                                            border-red-200
                                            bg-red-50
                                        `
                                        : `
                                            border-gray-200
                                            bg-gray-50
                                        `
                                    }
                            `}
                            >
                                {/* =========================================
                                REQUESTED DAYS
                            ========================================= */}

                                <span className="flex items-center gap-2 font-semibold text-gray-700">
                                    <ClockCircleOutlined className="text-base text-gray-400" />

                                    <span>
                                        {formatDays(
                                            requestedDays
                                        )}{' '}
                                        days
                                        requested
                                    </span>
                                </span>

                                {/* =========================================
                                CONVERTING
                            ========================================= */}

                                {conversionInfo
                                    .hasConversion ? (
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* DAY OFF */}

                                        {conversionInfo
                                            .dayOff >
                                            0 && (
                                                <span className="flex items-center gap-1 font-semibold text-red-600">
                                                    <ExclamationCircleOutlined />

                                                    <span>
                                                        Convert
                                                        to
                                                        Day-off{' '}
                                                        <strong>
                                                            {formatDays(
                                                                conversionInfo
                                                                    .dayOff
                                                            )}
                                                        </strong>{' '}
                                                        days
                                                    </span>
                                                </span>
                                            )}

                                        {/* UNPAID */}

                                        {conversionInfo
                                            .unpaid >
                                            0 && (
                                                <span className="flex items-center gap-1 font-semibold text-red-600">
                                                    <ExclamationCircleOutlined />

                                                    <span>
                                                        Convert
                                                        to
                                                        Unpaid{' '}
                                                        <strong>
                                                            {formatDays(
                                                                conversionInfo
                                                                    .unpaid
                                                            )}
                                                        </strong>{' '}
                                                        days
                                                    </span>
                                                </span>
                                            )}
                                    </div>
                                ) : (
                                    // =====================================
                                    // AVAILABLE
                                    // =====================================

                                    (leaveType ===
                                        'Annual Leave' ||
                                        leaveType ===
                                        'Day-off') && (
                                        <span className="flex items-center gap-1 font-semibold text-green-600">
                                            <CheckCircleOutlined />

                                            {formatDays(
                                                availableAfterRequest
                                            )}{' '}
                                            days
                                            available
                                        </span>
                                    )
                                )}
                            </div>
                        )}

                    {/* =================================================
                        REASON
                    ================================================= */}

                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            <span className="text-red-500">
                                *
                            </span>{' '}
                            Reason
                        </label>

                        <Input.TextArea
                            value={
                                reason
                            }
                            onChange={(
                                e
                            ) =>
                                setReason(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="Reason for leave..."
                            autoSize={{
                                minRows: 2,

                                maxRows: 4,
                            }}
                        />
                    </div>

                    {/* =================================================
                        DOCUMENTS
                    ================================================= */}

                    <div className="mt-5">
                        <LeaveDocuments />
                    </div>

                    {/* =================================================
                        APPROVERS
                    ================================================= */}

                    <div className="mt-5">
                        <LeaveApprovers
                            manager={
                                manager
                            }
                            hr={hr}
                            onManagerChange={
                                setManager
                            }
                            onHrChange={
                                setHr
                            }
                        />
                    </div>
                </div>

                {/* =================================================
                    FOOTER                                                                                                                                                                                                                                                                                                                                                                                               
                ================================================= */}

                <div className="flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:px-7">
                    {/* CANCEL */}

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            submitting
                        }
                        className="
                            h-11
                            flex-1
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            font-medium
                            text-gray-700
                            transition-all
                            duration-200
                            hover:-translate-y-[1px]
                            hover:border-gray-400
                            hover:bg-gray-50
                            hover:shadow-sm
                            active:translate-y-0
                            active:scale-[0.99]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>

                    {/* SUBMIT */}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="
        flex
        h-11
        flex-1
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-[#1677ff]
        font-medium
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:bg-[#0958d9]
        hover:shadow-md
        active:translate-y-0
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:opacity-60
    "
                    >
                        {submitting ? (
                            mode === 'edit' ? (
                                'Updating...'
                            ) : (
                                'Submitting...'
                            )
                        ) : (
                            <>
                                <img src={TickCirleIcon} alt="" />

                                <span>
                                    {mode === 'edit'
                                        ? 'Update request'
                                        : 'Submit Request'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LeaveRequestModal;