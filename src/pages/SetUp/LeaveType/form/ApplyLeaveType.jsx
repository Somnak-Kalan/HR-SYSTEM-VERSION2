import { Button, Form, Select, Spin } from 'antd';

import { useEffect, useState } from 'react';

import { useLeaveTypeStore } from '../../../../stores/leaveType.store';

const ApplyLeaveType = ({
    leaveTypeId,
    form,
    loading,
    setOpen,
    access_token,
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const [leaveTypeData, setLeaveTypeData] = useState(null);

    const [loadingDetail, setLoadingDetail] = useState(false);

    // =====================================================
    // STORE
    // =====================================================

    const applyLeaveType = useLeaveTypeStore((state) => state.applyLeaveType);

    const fetchLeaveTypeById = useLeaveTypeStore((state) => state.fetchLeaveTypeById);

    const fetchEmployeeOptions = useLeaveTypeStore((state) => state.fetchEmployeeOptions);

    const fetchDepartmentOptions = useLeaveTypeStore((state) => state.fetchDepartmentOptions);

    const employeeOptions = useLeaveTypeStore((state) => state.employeeOptions || []);

    const departmentOptions = useLeaveTypeStore((state) => state.departmentOptions || []);
    // =====================================================
    // FORM WATCH
    // =====================================================

    const employeeValue = Form.useWatch('employee', form);

    const departmentValue = Form.useWatch('department', form);
    const [internalForm] = Form.useForm();

    const activeForm = form || internalForm;


    // =====================================================
    // GET LEAVE TYPE BY ID
    // =====================================================

    useEffect(() => {
        const loadLeaveType = async () => {
            if (!access_token || !leaveTypeId) {
                return;
            }

            try {
                setLoadingDetail(true);

                const detail = await fetchLeaveTypeById({
                    access_token,
                    id: leaveTypeId,
                });

                console.log('APPLY LEAVE TYPE DETAIL:', detail);

                if (!detail) {
                    console.error('Cannot get leave type detail');

                    return;
                }

                setLeaveTypeData(detail);
            } catch (error) {
                console.error('GET LEAVE TYPE ERROR:', error);
            } finally {
                setLoadingDetail(false);
            }
        };

        loadLeaveType();
    }, [access_token, leaveTypeId, fetchLeaveTypeById]);

    // =====================================================
    // LOAD EMPLOYEE / DEPARTMENT OPTIONS
    // =====================================================

    useEffect(() => {
        if (!access_token || !leaveTypeId) {
            return;
        }

        fetchEmployeeOptions({
            access_token,
            leaveTypeId,
        });

        fetchDepartmentOptions({
            access_token,
            leaveTypeId,
        });
    }, [access_token, leaveTypeId, fetchEmployeeOptions, fetchDepartmentOptions]);

    // =====================================================
    // API DATA
    // =====================================================

    const rulesSet = leaveTypeData?.rulesSet || {};

    const entitlementType = rulesSet?.entitlementType?.toLowerCase();

    const grantCondition = rulesSet?.grantCondition || 'immediate';

    const daysPerYear = rulesSet?.daysPerYear || 0;

    const daysPerMonth = rulesSet?.daysPerMonth || 0;

    const carryForward = rulesSet?.carryForward || false;

    const expireMonth = rulesSet?.expireMonth || [];

    const payType = leaveTypeData?.payType?.toLowerCase();

    const isPaid = payType === 'paid';

    // =====================================================
    // FORMAT ENTITLEMENT
    // =====================================================

    const formatEntitlementType = () => {
        if (entitlementType === 'as-requested') {
            return 'As Request';
        }

        if (entitlementType === 'accrual') {
            return 'Accrual';
        }

        if (entitlementType === 'fixed') {
            return 'Fixed';
        }

        return '-';
    };

    // =====================================================
    // FORMAT GRANT CONDITION
    // =====================================================

    const formatGrantCondition = () => {
        if (!grantCondition) {
            return 'Immediate';
        }

        if (grantCondition.toLowerCase() === 'after probation') {
            return 'After probation';
        }

        if (grantCondition.toLowerCase() === 'immediate') {
            return 'Immediate';
        }

        return grantCondition;
    };

    // =====================================================
    // FORMAT EXPIRY
    // =====================================================

    const formatExpiry = () => {
        if (!Array.isArray(expireMonth) || expireMonth.length === 0) {
            return '-';
        }

        if (expireMonth.length === 1) {
            return expireMonth[0];
        }

        return `${expireMonth[0]}-${expireMonth[1]}`;
    };

    // =====================================================
    // APPLY
    // =====================================================

    const handleApply = async () => {
        try {
            const values = activeForm.getFieldsValue(true);

            const doc = {
                leaveTypeId: leaveTypeData?._id,
            };

            if (
                values?.employee &&
                values.employee.length > 0
            ) {
                doc.employeeIds = values.employee;
            }

            if (
                values?.department &&
                values.department.length > 0
            ) {
                doc.departmentIds = values.department;
            }

            if (values?.apply_all_department) {
                doc.applyAllDepartment =
                    values.apply_all_department;
            }

            console.log('APPLY LEAVE TYPE:', doc);

            const res = await applyLeaveType({
                access_token,
                doc,
            });

            if (res) {
                activeForm.resetFields();

                setLeaveTypeData(null);

                setOpen(false);
            }
        } catch (error) {
            console.error(
                'APPLY LEAVE TYPE ERROR:',
                error
            );
        }
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        activeForm.resetFields();

        setLeaveTypeData(null);

        setOpen(false);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loadingDetail || !leaveTypeData) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <Spin />
            </div>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* =================================================
                LEAVE TYPE INFO
            ================================================= */}

            <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
                {/* HEADER */}

                <div className="flex items-center justify-between bg-blue-50 px-4 py-2">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                        <span className="mr-1 text-blue-500">●</span>

                        <span>{leaveTypeData?.leave_type_name || '-'}</span>

                        <span className="mx-1">-</span>

                        <span>{leaveTypeData?.leave_type_name_kh || ''}</span>
                    </div>

                    <div className="text-sm text-gray-700">
                        Leave type :<span className="ml-1 font-semibold">{leaveTypeData?.leave_type || '-'}</span>
                    </div>
                </div>

                {/* DETAILS */}

                <div
                    className={`grid gap-4 px-4 py-3 text-xs ${entitlementType === 'accrual' ? 'grid-cols-7' : 'grid-cols-4'} `}
                >
                    {/* Entitlement */}

                    <div>
                        <p className="mb-0.5 text-gray-400">Entitlement Type</p>

                        <p className="m-0 text-sm font-medium text-gray-800">{formatEntitlementType()}</p>
                    </div>

                    {/* Grant Condition */}

                    <div>
                        <p className="mb-0.5 text-gray-400">Grant Condition</p>

                        <p className="m-0 text-sm font-medium text-gray-800">{formatGrantCondition()}</p>
                    </div>

                    {/* ACCRUAL */}

                    {entitlementType === 'accrual' && (
                        <>
                            {/* Balance */}

                            <div>
                                <p className="mb-0.5 text-gray-400">Balance</p>

                                <p className="m-0 text-sm font-medium text-gray-800">{daysPerYear} days/yr</p>
                            </div>

                            {/* Days Month */}

                            <div>
                                <p className="mb-0.5 text-gray-400">Days / Month</p>

                                <p className="m-0 text-sm font-medium text-gray-800">{daysPerMonth} days</p>
                            </div>

                            {/* Carry Forward */}

                            <div>
                                <p className="mb-0.5 text-gray-400">Carry Forward</p>

                                <p className="m-0 text-sm font-medium text-gray-800">{carryForward ? 'Yes' : 'No'}</p>
                            </div>

                            {/* Expiry */}

                            <div>
                                <p className="mb-0.5 text-gray-400">Expiry</p>

                                <p className="m-0 text-sm font-medium text-gray-800">{formatExpiry()}</p>
                            </div>
                        </>
                    )}

                    {/* FIXED */}

                    {entitlementType === 'fixed' && (
                        <div>
                            <p className="mb-0.5 text-gray-400">Days / Month</p>

                            <p className="m-0 text-sm font-medium text-gray-800">{daysPerMonth} days</p>
                        </div>
                    )}

                    {/* AS REQUESTED */}

                    {entitlementType === 'as-requested' && (
                        <div>
                            <p className="mb-0.5 text-gray-400">Days / Month</p>

                            <p className="m-0 text-sm font-medium text-gray-800">No fixed balance</p>
                        </div>
                    )}

                    {/* PAID */}

                    <div>
                        <p className="mb-0.5 text-gray-400">Paid</p>

                        <p className={`m-0 text-sm font-medium ${isPaid ? 'text-green-600' : 'text-red-500'} `}>
                            {isPaid ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                APPLY FORM
            ================================================= */}

            <Form
                form={activeForm}
                layout="vertical"
            >
                {/* EMPLOYEE */}

                <Form.Item label="Employee" name="employee" className="mb-4">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select an option"
                        options={employeeOptions}
                        disabled={departmentValue && departmentValue.length > 0}
                    />
                </Form.Item>

                {/* DEPARTMENT */}

                <Form.Item label="Department" name="department" className="mb-4">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select an option"
                        options={departmentOptions}
                        disabled={employeeValue && employeeValue.length > 0}
                    />
                </Form.Item>

                {/* BUTTONS */}

                <div className="mt-6 flex gap-3">
                    <Button className="h-11 flex-1 rounded-lg" onClick={handleClose}>
                        Close
                    </Button>

                    <Button type="primary" className="h-11 flex-1 rounded-lg" loading={loading} onClick={handleApply}>
                        Apply
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default ApplyLeaveType;
