import { Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

import ApplyLeaveTypeForm from '../form/ApplyLeaveType';

const ApplyLeaveTypeModal = ({
    open,
    setOpen,
    loading,
    access_token,
    leaveTypeId,
}) => {
    const close = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            width={900}
            closable={false}
            footer={null}
            destroyOnHidden
            onCancel={close}
        >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Apply Leave Type
                </h2>
            </div>

            {leaveTypeId ? (
                <ApplyLeaveTypeForm
                    leaveTypeId={leaveTypeId}
                    loading={loading}
                    access_token={access_token}
                    setOpen={setOpen}

                />
            ) : (
                <div className="flex h-[300px] items-center justify-center">
                    <span className="text-gray-500">
                        No leave type selected.
                    </span>
                </div>
            )}
        </Modal>
    );
};

export default ApplyLeaveTypeModal;