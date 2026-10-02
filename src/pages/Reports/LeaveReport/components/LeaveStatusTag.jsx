const STATUS_CONFIG = {
    'Annual Leave': {
        background: '#e8eef9',
        color: '#2459a6',
    },

    DayOff: {
        background: '#dcf7e4',
        color: '#2f9b4b',
    },

    'Day Off': {
        background: '#dcf7e4',
        color: '#2f9b4b',
    },

    Unpaid: {
        background: '#fff0dc',
        color: '#f28b20',
    },

    Absent: {
        background: '#000F2C26',
        color: '#000000',
    },
};

const LeaveStatusTag = ({ value }) => {
    const config =
        STATUS_CONFIG[value] ||
        STATUS_CONFIG['Annual Leave'];

    return (
        <span
            className="inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
            style={{
                background: config.background,
                color: config.color,
            }}
        >
            {value}
        </span>
    );
};

export default LeaveStatusTag;