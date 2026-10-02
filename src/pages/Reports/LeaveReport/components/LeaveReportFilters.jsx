import {
    CalendarOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import {
    Checkbox,
    DatePicker,
    Input,
    Select,
} from 'antd';

const LeaveReportFilters = ({
    filters,
    setFilters,
}) => {
    const update = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="px-5 py-4">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[180px_1fr_280px_70px]">
                <div className="flex h-9 items-center rounded-md border border-gray-200 px-3">
                    <Checkbox
                        checked={filters.fullMonth}
                        onChange={(e) =>
                            update(
                                'fullMonth',
                                e.target.checked,
                            )
                        }
                    >
                        <span className="text-sm">
                            Full Month
                        </span>
                    </Checkbox>
                </div>

                <DatePicker.RangePicker
                    disabled={filters.fullMonth}
                    value={
                        filters.startDate &&
                            filters.endDate
                            ? [
                                filters.startDate,
                                filters.endDate,
                            ]
                            : null
                    }
                    onChange={(dates) => {
                        update(
                            'startDate',
                            dates?.[0] || null,
                        );

                        update(
                            'endDate',
                            dates?.[1] || null,
                        );
                    }}
                    format="YYYY-MM-DD"
                    separator="→"
                    suffixIcon={
                        <CalendarOutlined />
                    }
                    className="h-9 w-full"
                    placeholder={[
                        'Start date',
                        'End date',
                    ]}
                />

                <Select
                    showSearch
                    allowClear
                    value={
                        filters.employee || undefined
                    }
                    onChange={(value) =>
                        update(
                            'employee',
                            value || '',
                        )
                    }
                    placeholder="Search by employee id"
                    className="w-full"
                    suffixIcon={
                        <SearchOutlined />
                    }
                    options={[
                        {
                            label: 'VTS-001',
                            value: 'VTS-001',
                        },
                        {
                            label: 'VTS-002',
                            value: 'VTS-002',
                        },
                        {
                            label: 'VTS-036',
                            value: 'VTS-036',
                        },
                    ]}
                />

                <button
                    type="button"
                    className="
                        flex h-9
                        items-center
                        justify-center
                        rounded-md
                        border border-gray-300
                        bg-white
                        text-gray-600
                        transition
                        hover:border-[#1677ff]
                        hover:text-[#1677ff]
                    "
                >
                    <SearchOutlined />
                </button>
            </div>

            <div className="mt-1 text-xs text-gray-500">
                Range: 2026-05-01 → 2026-05-31
            </div>
        </div>
    );
};

export default LeaveReportFilters;