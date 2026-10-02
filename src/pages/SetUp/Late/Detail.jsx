import { useMemo } from 'react';
import CalendarIcon from '../../../assets/icons/calendar.svg'
// =====================================================
// HELPERS
// =====================================================

const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};

// =====================================================
// CHECK ANNUAL LEAVE
// =====================================================

const isAnnualLeave = (deductionType) => {
    const value = String(
        deductionType || '',
    )
        .trim()
        .toLowerCase();

    return (
        value === 'annual leave' ||
        value === 'annual leave deduction'
    );
};

// =====================================================
// FORMAT PENALTY RANGE
// =====================================================

const getPenaltyRange = (tier) => {
    const condition = String(
        tier?.condition || '',
    ).toLowerCase();

    const from = toNumber(
        tier?.from ??
        tier?.fromMinute ??
        tier?.from_minute ??
        tier?.minute,
    );

    const to = toNumber(
        tier?.to ??
        tier?.toMinute ??
        tier?.to_minute,
    );

    // =================================================
    // BETWEEN
    // =================================================

    if (condition.includes('between')) {
        // Example:
        // 16 -> 60
        // from 16min - 1 hour
        if (
            from < 60 &&
            to === 60
        ) {
            return `from ${from}min - 1 hour`;
        }

        // Example:
        // 61 -> 120
        // 1:01 - 2:00 hours
        if (
            from >= 60 &&
            to >= 60
        ) {
            const fromHour =
                Math.floor(from / 60);

            const fromMinute =
                from % 60;

            const toHour =
                Math.floor(to / 60);

            const toMinute =
                to % 60;

            return `${fromHour}:${String(
                fromMinute,
            ).padStart(
                2,
                '0',
            )} - ${toHour}:${String(
                toMinute,
            ).padStart(
                2,
                '0',
            )} hours`;
        }

        // Example:
        // 10 -> 30
        return `${from}min - ${to}min`;
    }

    // =================================================
    // GREATER
    // =================================================

    if (condition.includes('greater')) {
        if (from < 60) {
            return `≥ ${from}min`;
        }

        const hour =
            Math.floor(from / 60);

        const minute =
            from % 60;

        return `≥ ${hour}:${String(
            minute,
        ).padStart(
            2,
            '0',
        )} hours`;
    }

    // =================================================
    // LESS
    // =================================================

    if (from < 60) {
        return `≤ ${from} min`;
    }

    const hour =
        Math.floor(from / 60);

    const minute =
        from % 60;

    return `≤ ${hour}:${String(
        minute,
    ).padStart(
        2,
        '0',
    )} hours`;
};

// =====================================================
// NORMALIZE POLICY
// =====================================================

const normalizePolicy = (policy) => {
    const item = policy || {};

    const allowLate =
        item?.allowLatePerMonth ||
        item?.allow_late_per_month ||
        {};

    const penaltySource =
        item?.penaltyTiers ||
        item?.penalty_tiers ||
        item?.penalty ||
        [];

    const penaltyTiers =
        Array.isArray(penaltySource)
            ? penaltySource
            : [];

    const gracePeriod = toNumber(
        item?.dailyGracePeriod ??
        item?.grace_period,
    );

    const allowFrom = toNumber(
        allowLate?.from ??
        item?.fromMinute ??
        item?.from_minute,
    );

    const allowTo = toNumber(
        allowLate?.to ??
        item?.toMinute ??
        item?.to_minute,
    );

    const monthlyAllowance =
        toNumber(
            allowLate?.time ??
            allowLate?.times ??
            item?.monthlyAllowance ??
            item?.monthly_allowance,
        );

    return {
        ...item,

        gracePeriod,

        allowFrom,

        allowTo,

        monthlyAllowance,

        penaltyTiers,
    };
};

// =====================================================
// COMPONENT
// =====================================================

const LateDetail = ({ policy }) => {
    const data = useMemo(
        () => normalizePolicy(policy),
        [policy],
    );

    // =================================================
    // SUMMARY
    // =================================================

    const summaryData = [
        {
            label: 'DAILY GRACE PERIOD',

            value: data.gracePeriod,

            unit: 'min',

            color: '#00A63C',

            sub: 'Not counted as late',
        },

        {
            label: 'ALLOW RANGE',

            value:
                data.allowFrom === 0 &&
                    data.allowTo === 0
                    ? 0
                    : `${data.allowFrom}–${data.allowTo}`,

            unit: 'min',

            color: '#155EEF',

            sub:
                'Eligible for monthly allowance',
        },

        {
            label: 'MONTHLY ALLOWANCE',

            value: data.monthlyAllowance,

            unit: 'times',

            color: '#F59E0B',

            sub:
                'Before penalty triggers',
        },

        {
            label: 'PENALTY STRUCTURE',

            value:
                data.penaltyTiers.length,

            unit: 'tiers',

            color: '#F97316',

            sub:
                'Applied on exceeded allowance',
        },
    ];

    // =================================================
    // PENALTY DATA
    // =================================================

    const penaltyData = useMemo(() => {
        return data.penaltyTiers.map(
            (tier, index) => {
                const deductionType =
                    tier?.deductionType ||
                    tier?.deduction_type ||
                    tier?.type ||
                    'Salary Deduction';

                const amount = toNumber(
                    tier?.amount,
                );

                const annualLeave =
                    isAnnualLeave(
                        deductionType,
                    );

                return {
                    ...tier,

                    key:
                        tier?.tierNo ||
                        tier?._id ||
                        index,

                    duration:
                        getPenaltyRange(tier),

                    deductionType,

                    isAnnualLeave:
                        annualLeave,

                    displayType:
                        annualLeave
                            ? 'Annual Leave'
                            : 'Salary',

                    displayAmount:
                        annualLeave
                            ? `${amount} day`
                            : `$${amount}`,

                    description:
                        tier?.description ||
                        (annualLeave
                            ? `Deduct ${amount} day from Annual Leave`
                            : `Salary deduction of $${amount}`),
                };
            },
        );
    }, [data.penaltyTiers]);

    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="w-full min-w-0">

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="overflow-hidden rounded-[10px] border border-[#E4E7EC] bg-white">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

                    {summaryData.map(
                        (
                            item,
                            index,
                        ) => (
                            <div
                                key={
                                    index
                                }
                                className={[
                                    'min-w-0 px-6 py-5',

                                    // Desktop
                                    'lg:border-r lg:border-[#EAECF0]',

                                    // Remove right border on last
                                    'lg:last:border-r-0',

                                    // Mobile/tablet borders
                                    'border-b border-[#EAECF0]',

                                    // Remove bottom border from last row
                                    'last:border-b-0',

                                    // Tablet: remove bottom border
                                    // from the last two items
                                    'sm:[&:nth-child(3)]:border-b-0',
                                    'sm:[&:nth-child(4)]:border-b-0',

                                    // Tablet vertical divider
                                    'sm:[&:nth-child(odd)]:border-r',
                                    'sm:[&:nth-child(odd)]:border-[#EAECF0]',

                                    // Desktop resets
                                    'lg:border-b-0',

                                    // Desktop vertical borders
                                    index ===
                                        summaryData.length -
                                        1
                                        ? 'lg:border-r-0'
                                        : '',
                                ].join(' ')}
                            >
                                {/* LABEL */}

                                <div className="truncate text-[11px] font-medium tracking-[1.1px] text-[#98A2B3]">
                                    {
                                        item.label
                                    }
                                </div>

                                {/* VALUE */}

                                <div className="mt-1 flex min-w-0 items-baseline">

                                    <span
                                        className="truncate text-[27px] font-semibold"
                                        style={{
                                            color:
                                                item.color,
                                        }}
                                    >
                                        {
                                            item.value
                                        }
                                    </span>

                                    <span className="ml-2 shrink-0 text-[14px] font-normal text-[#98A2B3]">
                                        {
                                            item.unit
                                        }
                                    </span>

                                </div>

                                {/* SUB */}

                                <div className="mt-1 truncate text-[11px] text-[#667085]">
                                    {
                                        item.sub
                                    }
                                </div>
                            </div>
                        ),
                    )}

                </div>

                {/* =================================================
                    HOW IT WORKS
                ================================================= */}

                <div className="border-t border-[#EAECF0] bg-[#F8FAFC] px-6 py-3.5">

                    <div className="mb-2.5 text-[11px] font-semibold tracking-[1px] text-[#667085]">
                        HOW IT WORKS
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-[#475467]">

                        {/* GREEN */}

                        <span className="flex min-w-0 items-center">

                            <span className="mr-2 shrink-0 text-[10px] text-[#12B76A]">
                                ●
                            </span>

                            <span>
                                Within{' '}
                                {
                                    data.gracePeriod
                                }{' '}
                                min → Not late,
                                no record
                            </span>

                        </span>

                        {/* BLUE */}

                        {!(
                            data.allowFrom ===
                            0 &&
                            data.allowTo ===
                            0
                        ) && (
                                <span className="flex min-w-0 items-center">

                                    <span className="mr-2 shrink-0 text-[10px] text-[#2E7DFF]">
                                        ●
                                    </span>

                                    <span>
                                        {
                                            data.allowFrom
                                        }
                                        –
                                        {
                                            data.allowTo
                                        }{' '}
                                        min → Allowed{' '}
                                        {
                                            data.monthlyAllowance
                                        }
                                        ×/month
                                    </span>

                                </span>
                            )}

                        {/* ORANGE */}

                        {data.penaltyTiers
                            .length >
                            0 && (
                                <span className="flex min-w-0 items-center">

                                    <span className="mr-2 shrink-0 text-[10px] text-[#FF6B00]">
                                        ●
                                    </span>

                                    <span>
                                        Exceed allowance
                                        or &gt;30 min →
                                        Penalty applies
                                    </span>

                                </span>
                            )}

                    </div>
                </div>
            </div>

            {/* =================================================
                APPLY TO
            ================================================= */}

            {Array.isArray(
                data?.apply,
            ) &&
                data.apply.length >
                0 && (
                    <div className="mt-4 rounded-[10px] border border-[#E4E7EC] bg-white px-6 py-5">

                        <div className="mb-3 text-[11px] font-semibold tracking-[1px] text-[#667085]">
                            APPLY TO
                        </div>

                        <div className="flex flex-wrap gap-2">

                            {data.apply.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <span
                                        key={
                                            index
                                        }
                                        className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[12px] font-medium text-[#2563EB]"
                                    >
                                        {typeof item ===
                                            'object'
                                            ? item?.name ||
                                            item?.label ||
                                            ''
                                            : item}
                                    </span>
                                ),
                            )}

                        </div>
                    </div>
                )}

            {/* =================================================
                PENALTY STRUCTURE
            ================================================= */}

            {penaltyData.length >
                0 ? (
                <div className="mt-4 overflow-hidden rounded-[10px] border border-[#E4E7EC] bg-white">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="px-5 py-4">

                        <div className="text-[16px] font-semibold text-[#172033]">
                            Penalty
                            Structure
                        </div>

                        <div className="mt-1 text-[12px] text-[#667085]">
                            Applied when monthly
                            allowance is exceeded
                        </div>

                    </div>

                    {/* =================================================
                        RESPONSIVE TABLE WRAPPER
                    ================================================= */}

                    <div className="w-full overflow-x-auto">

                        <div className="min-w-[760px]">

                            {/* =================================================
                                TABLE HEADER
                            ================================================= */}

                            <div className="grid grid-cols-[24%_24%_24%_28%] border-y border-[#EAECF0] bg-[#F8FAFC]">

                                <div className="px-5 py-2.5 text-[10px] font-medium tracking-[0.8px] text-[#667085]">
                                    ACCUMULATED LATE
                                    DURATION
                                </div>

                                <div className="px-5 py-2.5 text-[10px] font-medium tracking-[0.8px] text-[#667085]">
                                    DEDUCTION TYPE
                                </div>

                                <div className="px-5 py-2.5 text-[10px] font-medium tracking-[0.8px] text-[#667085]">
                                    PENALTY AMOUNT
                                </div>

                                <div className="px-5 py-2.5 text-[10px] font-medium tracking-[0.8px] text-[#667085]">
                                    DESCRIPTION
                                </div>

                            </div>

                            {/* =================================================
                                TABLE ROWS
                            ================================================= */}

                            <div>

                                {penaltyData.map(
                                    (
                                        row,
                                    ) => (
                                        <div
                                            key={
                                                row.key
                                            }
                                            className="grid grid-cols-[24%_24%_24%_28%] border-b border-[#EAECF0] last:border-b-0"
                                        >

                                            {/* DURATION */}

                                            <div className="flex min-h-[45px] items-center px-5 py-2.5">

                                                <span className="whitespace-nowrap text-[13px] font-medium text-[#172033]">
                                                    {
                                                        row.duration
                                                    }
                                                </span>

                                            </div>

                                            {/* DEDUCTION TYPE */}

                                            <div className="flex min-h-[45px] items-center px-5 py-2.5">

                                                <span
                                                    className={[
                                                        'inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium',
                                                        row.isAnnualLeave
                                                            ? 'bg-[#FFF4C7] text-[#B54708]'
                                                            : 'bg-[#FFE1E1] text-[#D92D20]',
                                                    ].join(
                                                        ' ',
                                                    )}
                                                >

                                                    <span className="mr-1.5 text-[10px]">
                                                        {row.isAnnualLeave
                                                            ? <img src={CalendarIcon} ></img>
                                                            : '$'}
                                                    </span>

                                                    {
                                                        row.displayType
                                                    }

                                                </span>

                                            </div>

                                            {/* AMOUNT */}

                                            <div className="flex min-h-[45px] items-center px-5 py-2.5">

                                                <span className="whitespace-nowrap text-[13px] font-semibold text-[#172033]">
                                                    {
                                                        row.displayAmount
                                                    }
                                                </span>

                                            </div>

                                            {/* DESCRIPTION */}

                                            <div className="flex min-h-[45px] items-center px-5 py-2.5">

                                                <span className="whitespace-nowrap text-[12px] text-[#667085]">
                                                    {
                                                        row.description
                                                    }
                                                </span>

                                            </div>

                                        </div>
                                    ),
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        FALLBACK
                    ================================================= */}

                    <div className="flex items-start gap-2 border-t border-[#FDE68A] bg-[#FFFBEB] px-5 py-2.5 text-[12px] text-[#A15C00]">

                        <span className="shrink-0 text-[14px]">
                            ⓘ
                        </span>

                        <span>
                            <span className="font-semibold">
                                Fallback:
                            </span>{' '}
                            If insufficient
                            Annual Leave,
                            convert to unpaid
                            leave
                        </span>

                    </div>

                </div>
            ) : (
                /* =================================================
                   NO PENALTY
                ================================================= */

                <div className="mt-4 rounded-[10px] border border-dashed border-[#D0D5DD] bg-white px-4 py-3 text-center text-[13px] text-[#98A2B3]">
                    No penalty deductions —
                    late arrivals are
                    recorded but not
                    penalised.
                </div>
            )}

        </div>
    );
};

export default LateDetail;