import { UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';

const LeaveApprovers = ({
    manager,
    hr,
    onManagerChange,
    onHrChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm text-gray-700">
                    <span className="text-red-500">
                        *
                    </span>{' '}
                    Allow By Manager
                </label>

                <Select
                    value={manager}
                    onChange={onManagerChange}
                    className="w-full"
                    disabled
                    suffixIcon={
                        <UserOutlined />
                    }
                    options={[
                        {
                            label: 'Lux Kimleng',
                            value: 'Lux Kimleng',
                        },
                    ]}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm text-gray-700">
                    <span className="text-red-500">
                        *
                    </span>{' '}
                    Allow By HR
                </label>

                <Select
                    value={hr}
                    onChange={onHrChange}
                    className="w-full"
                    disabled
                    suffixIcon={
                        <UserOutlined />
                    }
                    options={[
                        {
                            label: 'Sin Sovanlyda',
                            value: 'Sin Sovanlyda',
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default LeaveApprovers;