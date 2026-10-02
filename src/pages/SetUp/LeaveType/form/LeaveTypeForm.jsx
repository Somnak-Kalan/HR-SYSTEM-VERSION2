import { Form, Input, Row, Col, Select, Switch, DatePicker, Card, Radio } from 'antd';

import TextArea from 'antd/es/input/TextArea';

import { useEffect } from 'react';

import '../LeaveType.scss';

const LeaveTypeForm = ({ form, mode = 'create' }) => {
    const isUpdate = mode === 'update';

    const popupContainer = (trigger) => {
        return trigger.parentNode;
    };

    // ==========================
    // WATCH FORM VALUES
    // ==========================

    const ruleType = Form.useWatch('rule_type', form);

    // ==========================
    // WATCH PAY TYPE
    // ==========================

    const payType = Form.useWatch('pay_type', form);

    // ==========================
    // SET DEFAULT PAY TYPE
    // ==========================

    useEffect(() => {
        if (!form.getFieldValue('pay_type')) {
            form.setFieldValue('pay_type', 'paid');
        }
    }, [form]);

    // ==========================
    // RETURN
    // ==========================

    return (
        <Form form={form} layout="vertical">
            <Row gutter={10}>
                {/* ==========================
                    LEAVE TYPE NAME KHMER
                ========================== */}

                <Col span={8}>
                    <Form.Item
                        label="LeaveType Name(Khmer)"
                        name="leave_type_name_kh"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Khmer name',
                            },
                        ]}
                    >
                        <Input placeholder="សូមបញ្ចូលឈ្មោះប្រភេទឈប់សម្រាក" />
                    </Form.Item>
                </Col>

                {/* ==========================
                    LEAVE TYPE NAME ENGLISH
                ========================== */}

                <Col span={8}>
                    <Form.Item
                        label="LeaveType Name(English)"
                        name="leave_type_name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input English name',
                            },
                        ]}
                    >
                        <Input placeholder="Enter leave type name" />
                    </Form.Item>
                </Col>

                {/* ==========================
                    LEAVE TYPE
                ========================== */}

                <Col span={8}>
                    <Form.Item
                        label="LeaveType"
                        name="leave_type"
                        rules={[
                            {
                                required: true,
                                message: 'Please select leave type',
                            },
                        ]}
                    >
                        <Select
                            disabled={isUpdate}
                            placeholder="Select leave type"
                            getPopupContainer={popupContainer}
                            options={[
                                {
                                    label: 'Annual Leave',
                                    value: 'Annual Leave',
                                },
                                {
                                    label: 'Day Off Leave',
                                    value: 'Day Off Leave',
                                },
                                {
                                    label: 'Special Leave',
                                    value: 'Special Leave',
                                },
                                {
                                    label: 'Unpaid Leave',
                                    value: 'Unpaid Leave',
                                },
                                {
                                    label: 'Missed Scan',
                                    value: 'Missed Scan',
                                },
                                {
                                    label: 'Paid Leave',
                                    value: 'Paid Leave',
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* ==========================
                DESCRIPTION
            ========================== */}

            <Form.Item label="Description" name="description">
                <TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            {/* ==========================
                PAY TYPE
            ========================== */}

            <div className="mb-2 flex items-center gap-2 text-xs text-gray-700">
                <span>Pay Type</span>

                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Form.Item name="pay_type" initialValue="paid" className="mb-1">
                <Radio.Group className="w-full">
                    <Row gutter={8}>
                        {/* PAID */}

                        <Col span={12}>
                            <Radio.Button value="paid" className="flex !h-8 w-full items-center justify-center !rounded-md">
                                💰 Paid
                            </Radio.Button>
                        </Col>

                        {/* UNPAID */}

                        <Col span={12}>
                            <Radio.Button value="unpaid" className="flex !h-8 w-full items-center justify-center !rounded-md">
                                ❌ Unpaid
                            </Radio.Button>
                        </Col>
                    </Row>
                </Radio.Group>
            </Form.Item>

            <div className="mb-4 text-xs text-gray-400">
                {payType === 'unpaid'
                    ? 'Employee does not receive salary during this leave.'
                    : 'Employee receives full salary during this leave.'}
            </div>

            {/* ==========================
                RULE SET
            ========================== */}

            <Card size="small" className="bg-blue-50">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <span>RULES SET</span>

                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* ==========================
                    ENTITLEMENT TYPE
                ========================== */}

                <Form.Item
                    label="Entitlement Type"
                    name="rule_type"
                    rules={[
                        {
                            required: true,
                            message: 'Please select entitlement type',
                        },
                    ]}
                >
                    <Select
                        disabled={isUpdate}
                        placeholder="Select entitlement type"
                        getPopupContainer={popupContainer}
                        options={[
                            {
                                label: 'Accrual (ប្រើ Accrual នៅពេលដែលបុគ្គលិកទទួលបានការឈប់សម្រាកបន្តិចម្តងៗតាមពេលវេលា)',
                                value: 'Accrual',
                            },
                            {
                                label:
                                    'Fixed (ប្រើប្រាស់ Fixed នៅពេលដែលនិយោជិតទទួលបានចំនួនឈប់សម្រាកដែលបានកំណត់ទុកជាមុនសម្រាប់រយៈពេលជាក់លាក់ណាមួយ។)',
                                value: 'Fixed',
                            },
                            {
                                label:
                                    'As Request (No fixed balance)(ប្រើសំណើរនៅពេលដែលមិនមានសមតុល្យឈប់សម្រាកដែលបានកំណត់ជាមុនហើយបុគ្គលិកស្នើសុំចំនួនដែលពួកគេត្រូវការ។)',
                                value: 'Request',
                            },
                        ]}
                    />
                </Form.Item>

                {/* ==========================
                    ACCRUAL
                ========================== */}

                {ruleType?.toLowerCase() === 'accrual' && (
                    <>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    label="Days per year"
                                    name="days_year"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input days per year',
                                        },
                                    ]}
                                >
                                    <Input disabled={isUpdate} type="number" placeholder='days per year' />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Days Per Month (Accrual)"
                                    name="days_month"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input days per month',
                                        },
                                    ]}
                                >
                                    <Input disabled={isUpdate} type="number" placeholder='days per month' />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* ==========================
                            CARRY FORWARD
                        ========================== */}

                        <div className="flex items-center justify-between rounded-md border border-blue-300 bg-blue-100 px-3 py-2">
                            <div>
                                <div>Carry forward unused balance</div>

                                <div className="text-xs text-gray-500">Unused days roll over to the next period</div>
                            </div>

                            <Form.Item name="carry_forward" valuePropName="checked" noStyle>
                                <Switch disabled={isUpdate} />
                            </Form.Item>
                        </div>

                        {/* ==========================
                            EXPIRE + GRANT CONDITION
                        ========================== */}

                        <Row gutter={8}>
                            <Col span={16}>
                                <Form.Item label="Expire every end month" required>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="expire_start_month"
                                                noStyle
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please select start month',
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    disabled={isUpdate}
                                                    picker="month"
                                                    format="MMMM"
                                                    placeholder="June"
                                                    className="w-full"
                                                    getPopupContainer={popupContainer}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                name="expire_end_month"
                                                noStyle
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please select end month',
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    disabled={isUpdate}
                                                    picker="month"
                                                    format="MMMM"
                                                    placeholder="December"
                                                    className="w-full"
                                                    getPopupContainer={popupContainer}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="Grant Condition"
                                    name="grant_condition"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select grant condition',
                                        },
                                    ]}
                                >
                                    <Select
                                        disabled={isUpdate}
                                        options={[
                                            {
                                                label: 'After Probation',
                                                value: 'after-probation',
                                            },
                                            {
                                                label: 'Immediate',
                                                value: 'immediate',
                                            },
                                            {
                                                label: 'After One Year',
                                                value: 'after-one-year',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                {/* ==========================
                    FIXED
                ========================== */}

                {ruleType === 'Fixed' && (
                    <>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    label="Day - per month"
                                    name="days_month"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input day per month',
                                        },
                                    ]}
                                >
                                    <Input disabled={isUpdate} type="number" placeholder='day per month' />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label="Grant Condition"
                                    name="grant_condition"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select grant condition',
                                        },
                                    ]}
                                >
                                    <Select
                                        disabled={isUpdate}
                                        placeholder='grant condition'
                                        options={[
                                            {
                                                label: 'After Probation',
                                                value: 'after-probation',
                                            },
                                            {
                                                label: 'Immediate',
                                                value: 'immediate',
                                            },
                                            {
                                                label: 'After One Year',
                                                value: 'after-one-year',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}

                {/* ==========================
                    REQUEST
                ========================== */}

                {ruleType === 'Request' && (
                    <>
                        <Row gutter={8}>
                            <Col span={24}>
                                <Form.Item
                                    label="Grant Condition"
                                    name="grant_condition"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select grant condition',
                                        },
                                    ]}
                                >
                                    <Select
                                        disabled={isUpdate}
                                        placeholder='grant condition'
                                        options={[
                                            {
                                                label: 'After Probation',
                                                value: 'after-probation',
                                            },
                                            {
                                                label: 'Immediate',
                                                value: 'immediate',
                                            },
                                            {
                                                label: 'After One Year',
                                                value: 'after-one-year',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}
            </Card>

            {/* ==========================
                STATUS
            ========================== */}

            <div className="mb-2 mt-5 flex items-center gap-2 text-xs text-gray-700">
                <span>STATUS</span>

                <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* ==========================
                UPDATE STATUS
            ========================== */}

            {isUpdate && (
                <Form.Item name="status" className="mb-4">
                    <Radio.Group>
                        <Radio value="active">Active</Radio>

                        <Radio value="inactive">Inactive</Radio>
                    </Radio.Group>
                </Form.Item>
            )}

            {/* ==========================
                CREATE PUBLIC DATE
            ========================== */}

            {/* {!isUpdate && ( */}
            <Form.Item
                label={
                    ruleType === 'Fixed' || ruleType === 'Request' || ruleType === 'as-requested'
                        ? 'Will publish on'
                        : 'ថ្ងៃចាប់ផ្តើមមានសិទ្ធិ (Display only)'
                }
                name="publicDate"
            >
                <DatePicker
                    className="w-full"
                    placeholder={
                        ruleType === 'Fixed' || ruleType === 'Request' || ruleType === 'as-requested' ? 'Select date' : 'select date'
                    }
                />
            </Form.Item>
            {/* )} */}
        </Form>
    );
};

export default LeaveTypeForm;
