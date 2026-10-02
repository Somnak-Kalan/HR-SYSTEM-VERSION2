import {
    PlusOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

const LeaveReportHeader = ({ onAdd }) => {
    return (
        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-base font-semibold uppercase text-gray-800">
                    Leave Report
                </h1>
            </div>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAdd}
                className="
                    !border-[#1677ff]
                    !bg-[#1677ff]
                    hover:!border-[#1677ff]
                    hover:!bg-[#1677ff]
                "
            >
                Add Request Leave
            </Button>
        </div>
    );
};

export default LeaveReportHeader;