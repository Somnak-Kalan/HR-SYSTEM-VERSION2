import { Modal } from 'antd';

import { CloseCircleOutlined } from '@ant-design/icons';

import ViewLeaveType from '../compoments/ViewLeaveType';

const ViewLeaveTypeModal = ({
    open,
    setOpen,
    leaveTypeData,
}) => {
    // =====================================================
    // CLOSE
    // =====================================================
    const close = () => {
        setOpen(false);
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <Modal
            rootClassName="viewLeaveType"
            open={open}
            width={400}
            closable={false}
            footer={null}
            centered
            destroyOnHidden
            onCancel={close}
        >
            <div className="relative">

                {/* =================================================
                    CLOSE
                ================================================= */}

                <CloseCircleOutlined
                    onClick={close}
                    className="
                        absolute
                        right-0
                        top-0
                        z-10
                        cursor-pointer
                        text-gray-400
                        transition-colors
                        hover:text-gray-600
                    "
                />

                {/* =================================================
                    DATA
                ================================================= */}

                {leaveTypeData ? (
                    <ViewLeaveType
                        leaveTypeData={leaveTypeData}
                        onClose={close}
                    />
                ) : (
                    <div
                        className="
                            flex
                            min-h-[200px]
                            items-center
                            justify-center
                            text-[11px]
                            text-gray-400
                        "
                    >
                        No leave type selected
                    </div>
                )}

            </div>
        </Modal>
    );
};

export default ViewLeaveTypeModal;