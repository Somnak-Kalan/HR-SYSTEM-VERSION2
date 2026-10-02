import { Tag } from 'antd';

const ViewLeaveType = ({
    leaveTypeData,
    onClose,
}) => {
    // =====================================================
    // DATA
    // =====================================================

    const rulesSet =
        leaveTypeData?.rulesSet || {};

    const entitlementType =
        rulesSet?.entitlementType || '';

    const daysPerYear =
        rulesSet?.daysPerYear ?? 0;

    const daysPerMonth =
        rulesSet?.daysPerMonth ?? 0;

    const carryForward =
        rulesSet?.carryForward ?? false;

    const expireMonth =
        Array.isArray(rulesSet?.expireMonth)
            ? rulesSet.expireMonth
            : [];

    const grantCondition =
        rulesSet?.grantCondition || '';

    const departmentData =
        Array.isArray(
            leaveTypeData?.departmentData
        )
            ? leaveTypeData.departmentData
            : [];

    const employeeData =
        Array.isArray(
            leaveTypeData?.employeeData
        )
            ? leaveTypeData.employeeData
            : [];

    // =====================================================
    // PAY TYPE
    // =====================================================

    const isPaid =
        leaveTypeData?.payType?.toLowerCase() ===
        'paid';

    // =====================================================
    // ENTITLEMENT
    // =====================================================

    const isAccrual =
        entitlementType === 'accrual';

    const isFixed =
        entitlementType === 'fixed';

    const isAsRequested =
        entitlementType === 'as-requested';

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="text-[11px] text-gray-700">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="pr-6">

                <div
                    className="
                        text-[13px]
                        font-semibold
                        leading-4
                        text-gray-800
                    "
                >
                    {leaveTypeData?.leave_type_name ||
                        '-'}
                </div>

                <div
                    className="
                        mt-0.5
                        text-[10px]
                        leading-3
                        text-gray-500
                    "
                >
                    {leaveTypeData?.leave_type_name_kh ||
                        '-'}
                </div>

            </div>

            {/* =================================================
                LINE
            ================================================= */}

            <div className="-mx-3 mb-3 mt-3 border-b border-gray-200" />

            {/* =================================================
                PAY TYPE BANNER
            ================================================= */}

            <div
                className={`
                    mb-3
                    rounded-md
                    border
                    px-2
                    py-1.5
                    text-[10px]
                    font-medium
                    ${isPaid
                        ? `
                                border-green-200
                                bg-green-50
                                text-green-600
                            `
                        : `
                                border-red-200
                                bg-red-50
                                text-red-500
                            `
                    }
                `}
            >
                {isPaid
                    ? '💰 Full pay during leave'
                    : '❌ No pay during this leave'}
            </div>

            {/* =================================================
                DETAIL CARD
            ================================================= */}

            <div
                className="
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-2
                "
            >

                {/* ENTITLEMENT */}

                <RowItem
                    label="Entitlement Type(សិទ្ធិឈប់សម្រាក)"
                    value={formatEntitlementType(
                        entitlementType
                    )}
                />

                {/* GRANT CONDITION */}

                <RowItem
                    label="Grant Condition"
                    value={formatGrantCondition(
                        grantCondition
                    )}
                />

                {/* BALANCE */}

                <RowItem
                    label="Balance"
                    value={getBalanceText(
                        rulesSet
                    )}
                />

                {/* DAYS / MONTH */}

                {(isAccrual || isFixed) &&
                    Number(daysPerMonth) > 0 && (
                        <RowItem
                            label="Days / Month"
                            value={`${daysPerMonth} days`}
                        />
                    )}

                {/* CARRY FORWARD */}

                {isAccrual && (
                    <RowItem
                        label="Carry Forward"
                        value={
                            carryForward
                                ? 'Yes'
                                : 'No'
                        }
                    />
                )}

                {/* EXPIRY */}

                {expireMonth.length > 0 && (
                    <RowItem
                        label="Expiry"
                        value={expireMonth.join(
                            ' - '
                        )}
                    />
                )}

                {/* STATUS */}

                <RowItem
                    label="Status"
                    value={
                        <Tag
                            color={
                                leaveTypeData?.status ===
                                    'active'
                                    ? 'success'
                                    : 'default'
                            }
                            className="
                                !m-0
                                !rounded-full
                                !border-0
                                !px-2
                                !py-0
                                !text-[10px]
                            "
                        >
                            {formatStatus(
                                leaveTypeData?.status
                            )}
                        </Tag>
                    }
                />

            </div>

            {/* =================================================
                DEPARTMENT
            ================================================= */}

            {departmentData.length > 0 && (
                <div className="mt-3">

                    <div
                        className="
                            mb-1
                            text-[10px]
                            font-semibold
                            text-gray-500
                        "
                    >
                        DEPARTMENT
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-1
                        "
                    >
                        {departmentData.map(
                            (item, index) => (
                                <Tag
                                    key={
                                        item?._id ||
                                        index
                                    }
                                    className="
                                        !m-0
                                        !rounded-full
                                        !border-0
                                        !bg-blue-50
                                        !px-2
                                        !py-0
                                        !text-[10px]
                                        !text-blue-600
                                    "
                                >
                                    {item?.departments ||
                                        '-'}
                                </Tag>
                            )
                        )}
                    </div>

                </div>
            )}

            {/* =================================================
                EMPLOYEE
            ================================================= */}

            {employeeData.length > 0 && (
                <div className="mt-3">

                    <div
                        className="
                            mb-1
                            text-[10px]
                            font-semibold
                            text-gray-500
                        "
                    >
                        EMPLOYEE
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-1
                        "
                    >
                        {employeeData.map(
                            (item, index) => (
                                <Tag
                                    key={
                                        item?.code ||
                                        item?._id ||
                                        index
                                    }
                                    className="
                                        !m-0
                                        !rounded-full
                                        !border-0
                                        !bg-blue-50
                                        !px-2
                                        !py-0
                                        !text-[10px]
                                        !text-blue-600
                                    "
                                >
                                    {item?.nameLatin ||
                                        item?.name ||
                                        item?.code ||
                                        '-'}
                                </Tag>
                            )
                        )}
                    </div>

                </div>
            )}

            {/* =================================================
                NO BALANCE INFO
            ================================================= */}

            {isAsRequested && (
                <div
                    className="
                        mt-3
                        rounded-md
                        border
                        border-gray-200
                        bg-gray-50
                        px-2
                        py-2
                        text-[10px]
                        leading-4
                        text-gray-500
                    "
                >
                    <span className="mr-1">
                        ⓘ
                    </span>

                    No balance is pre-assigned.
                    Employees submit requests
                    specifying the actual dates
                    needed and HR approves based
                    on eligibility.
                </div>
            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="-mx-3 mb-3 mt-3 border-b border-gray-200" />

            <div className="mt-4 flex justify-end">

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-md
                        border
                        border-gray-200
                        bg-white
                        px-3
                        py-1
                        text-[11px]
                        text-gray-700
                        transition-colors
                        hover:bg-gray-50
                    "
                >
                    Close
                </button>

            </div>

        </div>
    );
};

// =========================================================
// ROW ITEM
// =========================================================

const RowItem = ({
    label,
    value,
}) => {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-gray-100
                py-1.5
                last:border-none
            "
        >
            <span
                className="
                    min-w-0
                    text-[10px]
                    text-gray-400
                "
            >
                {label}
            </span>

            <span
                className="
                    shrink-0
                    text-right
                    text-[10px]
                    font-medium
                    text-gray-700
                "
            >
                {value}
            </span>
        </div>
    );
};

// =========================================================
// BALANCE
// =========================================================

const getBalanceText = (rulesSet) => {
    const entitlementType =
        rulesSet?.entitlementType;

    const daysPerYear =
        Number(
            rulesSet?.daysPerYear || 0
        );

    const daysPerMonth =
        Number(
            rulesSet?.daysPerMonth || 0
        );

    // AS REQUESTED

    if (
        entitlementType ===
        'as-requested'
    ) {
        return 'As requested';
    }

    // ACCRUAL

    if (
        entitlementType ===
        'accrual'
    ) {
        return `${daysPerYear} days/yr`;
    }

    // FIXED

    if (
        entitlementType ===
        'fixed'
    ) {
        return `${daysPerMonth} days/month`;
    }

    return '-';
};

// =========================================================
// FORMAT ENTITLEMENT
// =========================================================

const formatEntitlementType = (
    value
) => {
    if (!value) {
        return '-';
    }

    const map = {
        accrual: 'Accrual',

        fixed: 'Fixed',

        'as-requested':
            'As Request',
    };

    return (
        map[value] || value
    );
};

// =========================================================
// FORMAT GRANT CONDITION
// =========================================================

const formatGrantCondition = (
    value
) => {
    if (!value) {
        return '-';
    }

    const map = {
        'after-probation':
            'After Probation',

        immediate:
            'Immediate',

        'after-one-year':
            'After One Year',
    };

    return (
        map[value] || value
    );
};

// =========================================================
// FORMAT STATUS
// =========================================================

const formatStatus = (
    value
) => {
    if (!value) {
        return '-';
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
};

export default ViewLeaveType;