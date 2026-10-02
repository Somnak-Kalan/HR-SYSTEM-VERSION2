const LeaveReportTabs = ({
    activeTab,
    onChange,
    pendingCount,
    hrCount,
}) => {
    const tabs = [
        {
            key: 'leave',
            label: 'Leave Request',
        },
        {
            key: 'pending',
            label: `Pending request(${pendingCount})`,
        },
        {
            key: 'hr',
            label: `Waiting approve by HR(${hrCount})`,
        },
    ];

    return (
        <div className=" border-gray-200 px-5">
            <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const active =
                        activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                                onChange(tab.key)
                            }
                            className={`
                                relative whitespace-nowrap
                                py-3 text-sm
                                transition
                                ${active
                                    ? 'font-medium text-[#1677ff]'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {tab.label}

                            {active && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1677ff]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LeaveReportTabs;