import { Modal, message, Checkbox } from 'antd';

import { useContext, useEffect, useState } from 'react';

import LeaveTypeOptServices from '../../../../services/options/setup/leaveTypeOtp';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useDepartmentStore } from '../../../../stores/department.store';

const EditLeaveTypeModal = ({
    open,
    setOpen,
    departmentData,
    propData,
    onSuccess,
}) => {
    const { access_token } = useContext(AuthContext);

    const Update_Department_Leave_Type = useDepartmentStore((state) => state.Update_Department_Leave_Type);

    const [leaveTypes, setLeaveTypes] = useState([]);

    const [selected, setSelected] = useState([]);

    const [loading, setLoading] = useState(false);

    const formatLeaveTypes = (res) => {
        let data = [];

        if (Array.isArray(res)) {
            data = res;
        } else if (Array.isArray(res?.data)) {
            data = res.data;
        } else if (Array.isArray(res?.data?.data)) {
            data = res.data.data;
        }

        return data
            .map((item) => ({
                _id: item?._id || item?.id,

                name: item?.leave_type_name || item?.name || item?.leaveTypeName,
            }))
            .filter((item) => item._id && item.name);
    };

    const getLeaveType = async () => {
        try {
            const res = await LeaveTypeOptServices.Get_Leave_Type_Otp({
                access_token,
            });

            setLeaveTypes(formatLeaveTypes(res));
        } catch (error) {
            console.log(error);

            setLeaveTypes([]);
        }
    };

    useEffect(() => {
        if (open) {

            getLeaveType();



            const ids =
                departmentData?.leaveTypeIds
                    ?.map((id) => String(id))
                ||
                [];


            setSelected(ids);

        }

    }, [open, departmentData]);

    const update = async () => {

        try {

            setLoading(true);


            await Update_Department_Leave_Type({

                doc: {

                    id: propData?._id,

                    leaveTypeIds: selected,

                },

                access_token,

            });


            message.success(
                'Update leave type success'
            );


            // wait state update complete
            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );


            setOpen(false);


        } catch (error) {

            console.log(error);

            message.error(
                'Update leave type failed'
            );


        } finally {

            setLoading(false);

        }

    };

    return (
        <Modal

            open={open}

            onCancel={() => setOpen(false)}

            footer={null}

            centered

            width={600}

            closable={false}

            styles={{
                body: {
                    padding: '12px',
                },
            }}
        >
            <div>
                {/* TITLE */}

                <div className="mb-2 text-[12px] font-semibold text-gray-800">
                    Edit Leave type from department '{propData?.department_name}'
                </div>

                {/* LABEL */}

                <div className="mb-2 text-[10px] text-gray-500">Leave type</div>

                <Checkbox.Group
                    value={selected}

                    onChange={(value) => setSelected(value)}

                    className="grid grid-cols-2 gap-y-1"
                >
                    {leaveTypes.map((item) => (
                        <Checkbox
                            key={item._id}

                            value={item._id}

                            className="[&_.ant-checkbox-inner]:!h-[12px] [&_.ant-checkbox-inner]:!w-[12px]"
                        >
                            <span className="text-[10px] text-gray-700">{item.name}</span>
                        </Checkbox>
                    ))}
                </Checkbox.Group>

                {/* BUTTON */}

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => setOpen(false)}

                        className="h-7 w-1/2 rounded-md border border-gray-200 text-[10px]"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}

                        onClick={update}

                        className="h-7 w-1/2 rounded-md bg-orange-500 text-[10px] text-white disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditLeaveTypeModal;
