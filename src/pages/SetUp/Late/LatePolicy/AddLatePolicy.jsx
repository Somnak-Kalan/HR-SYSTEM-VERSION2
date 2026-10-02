import { Modal, Form, Input, Select, Switch, Button, DatePicker, Row, Col, Spin } from 'antd';

import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import PenaltyTiers from '../components/PenaltyTiers';

import { CONDITION, buildPenaltyTier } from '../components/penaltyHelpers';

import { useRulePolicyStore } from '../../../../stores/setup/rulePolicy.store';

/*
=========================================================
AUTH
=========================================================
*/

const getAccessToken = (access_token) => {
    const token = access_token || localStorage.getItem('access_token') || localStorage.getItem('token') || '';

    return String(token).replace('Bearer ', '');
};

/*
=========================================================
GET POLICY ID
=========================================================
*/

const getPolicyId = (policy) => {
    return policy?._id || policy?.id || policy?.policyId || '';
};

/*
=========================================================
DEFAULT TIER
=========================================================
*/

const DEFAULT_TIER = {
    condition: CONDITION.LESS,
    minute: 0,
    fromMinute: 0,
    toMinute: 0,
    deductionType: 'Salary Deduction',
    amount: 0,
    _isNew: true,
};

/*
=========================================================
NORMALIZE COPIED TIER
=========================================================
*/

const normalizeCopiedTier = (item, index) => {
    const condition = String(item?.condition || 'less').toLowerCase();

    const conditionText = condition.includes('between')
        ? CONDITION.BETWEEN
        : condition.includes('greater')
            ? CONDITION.GREATER
            : CONDITION.LESS;

    const from = Math.max(0, Number(item?.from ?? item?.fromMinute ?? item?.minute ?? 0) || 0);

    const to = Math.max(0, Number(item?.to ?? item?.toMinute ?? 0) || 0);

    return {
        ...item,

        tierNo: item?.tierNo || index + 1,

        condition: conditionText,

        minute: from,

        fromMinute: from,

        toMinute: conditionText === CONDITION.BETWEEN ? to : 0,

        deductionType: item?.deductionType || 'Salary Deduction',

        amount: item?.amount ?? 0,

        _isNew: true,
    };
};

/*
=========================================================
CHECK POLICY NAME RESPONSE

Backend response:

{
    "message": "You cannot use this policy name!!!",
    "check": true
}

check === true
    -> name exists / cannot use

check === false
    -> name available
=========================================================
*/

const isPolicyNameExists = (response) => {
    const payload = response?.data?.data ?? response?.data ?? response;

    /*
        Backend:
        {
            message: "...",
            check: true
        }
        */

    if (typeof payload?.check === 'boolean') {
        return payload.check;
    }

    /*
        Fallbacks
        */

    if (typeof payload === 'boolean') {
        return payload;
    }

    if (typeof payload?.exists === 'boolean') {
        return payload.exists;
    }

    if (typeof payload?.isExists === 'boolean') {
        return payload.isExists;
    }

    if (typeof payload?.duplicate === 'boolean') {
        return payload.duplicate;
    }

    if (typeof payload?.available === 'boolean') {
        return !payload.available;
    }

    if (typeof payload?.isAvailable === 'boolean') {
        return !payload.isAvailable;
    }

    return false;
};

/*
=========================================================
ADD LATE POLICY
=========================================================
*/

const AddLatePolicy = ({
    open,
    setOpen,

    /*
        Existing copy policy object
        */
    copyPolicy = null,

    /*
        Can also pass policy ID directly
        */
    copyPolicyId = null,

    access_token,

    onCreate,
}) => {
    const [form] = Form.useForm();

    /*
        =====================================================
        PENALTY
        =====================================================
        */

    const [applyPenalty, setApplyPenalty] = useState(false);

    const [tiers, setTiers] = useState([
        {
            ...DEFAULT_TIER,
        },
    ]);

    /*
        =====================================================
        COPY POLICY
        =====================================================
        */

    const [copyPolicyDetail, setCopyPolicyDetail] = useState(null);

    const [loadingDetail, setLoadingDetail] = useState(false);

    /*
        =====================================================
        POLICY NAME CHECK
        =====================================================
        */

    const [checkingPolicyName, setCheckingPolicyName] = useState(false);

    const policyNameTimerRef = useRef(null);

    const lastCheckedNameRef = useRef('');

    /*
        =====================================================
        STORE
        =====================================================
        */

    const fetchRulePolicyById = useRulePolicyStore((state) => state.fetchRulePolicyById);

    const checkRulePolicyName = useRulePolicyStore((state) => state.checkRulePolicyName);

    /*
        =====================================================
        WATCH POLICY NAME
        =====================================================
        */

    const policyName = Form.useWatch('policy_name', form);

    /*
        =====================================================
        AUTOMATIC POLICY NAME CHECK
    
        User types:
            Standard Late
    
        Wait:
            1 second
    
        Then:
            POST /check-policy-name
    
        No blur
        No click
        No validator
        =====================================================
        */

    useEffect(() => {
        const name = String(policyName || '').trim();

        /*
                Clear previous timer
                */

        if (policyNameTimerRef.current) {
            clearTimeout(policyNameTimerRef.current);
        }

        /*
                Empty name
                */

        if (!name) {
            lastCheckedNameRef.current = '';

            setCheckingPolicyName(false);

            form.setFields([
                {
                    name: 'policy_name',
                    errors: [],
                },
            ]);

            return;
        }

        /*
                Don't check the exact same
                name again
                */

        if (lastCheckedNameRef.current === name) {
            return;
        }

        /*
                Clear old validation error
                immediately when user changes
                the name.
                */

        form.setFields([
            {
                name: 'policy_name',
                errors: [],
            },
        ]);

        /*
                Wait 1 second after user
                stops typing
                */

        policyNameTimerRef.current = setTimeout(async () => {
            try {
                setCheckingPolicyName(true);

                const token = getAccessToken(access_token);

                const response = await checkRulePolicyName({
                    access_token: token,

                    policyName: name,

                    /*
                                                        ADD POLICY:
                                                        no policy ID
                                                        */

                    policyId: undefined,
                });

                console.log('CHECK POLICY NAME RESPONSE:', response);

                /*
                                        Check backend:
                                        {
                                            check: true,
                                            message: "..."
                                        }
                                        */

                const exists = isPolicyNameExists(response);

                if (exists) {
                    /*
                                                Use backend message
                                                */

                    const payload = response?.data?.data ?? response?.data ?? response;

                    const backendMessage = payload?.message || 'You cannot use this policy name!!!';

                    form.setFields([
                        {
                            name: 'policy_name',

                            errors: [backendMessage],
                        },
                    ]);
                } else {
                    const backendMessage = 'Policy Name available!!';

                    /*
                                                Name available
                                                */

                    form.setFields([
                        {
                            name: 'policy_name',

                            errors: [],
                        },
                    ]);
                }

                /*
                                        Remember this name
                                        */

                lastCheckedNameRef.current = name;
            } catch (error) {
                console.log('Check policy name error:', error);

                const backendMessage = error?.response?.data?.message || error?.response?.data?.msg || error?.message || '';

                const message = String(backendMessage).toLowerCase();

                const isDuplicate =
                    message.includes('already exists') ||
                    message.includes('already exist') ||
                    message.includes('duplicate') ||
                    message.includes('already used');

                if (isDuplicate) {
                    form.setFields([
                        {
                            name: 'policy_name',

                            errors: [backendMessage || 'Policy name already exists'],
                        },
                    ]);
                } else {
                    form.setFields([
                        {
                            name: 'policy_name',

                            errors: ['Unable to check policy name. Please try again.'],
                        },
                    ]);
                }
            } finally {
                setCheckingPolicyName(false);
            }
        }, 1000);

        /*
                Cleanup
                */

        return () => {
            if (policyNameTimerRef.current) {
                clearTimeout(policyNameTimerRef.current);
            }
        };
    }, [policyName, access_token, checkRulePolicyName, form]);

    /*
        =====================================================
        GET COPY SOURCE BY ID
        =====================================================
        */

    useEffect(() => {
        if (!open) {
            return;
        }

        const sourceId = copyPolicyId || getPolicyId(copyPolicy);

        /*
                Normal Add Policy
                */

        if (!sourceId) {
            setCopyPolicyDetail(null);

            form.resetFields();

            setApplyPenalty(false);

            setTiers([
                {
                    ...DEFAULT_TIER,
                },
            ]);

            /*
                        Reset policy name check
                        */

            lastCheckedNameRef.current = '';

            if (policyNameTimerRef.current) {
                clearTimeout(policyNameTimerRef.current);
            }

            return;
        }

        let mounted = true;

        const loadCopyPolicy = async () => {
            try {
                setLoadingDetail(true);

                const token = getAccessToken(access_token);

                /*
                                    GET BY ID
                                    */

                const data = await fetchRulePolicyById({
                    access_token: token,

                    id: sourceId,
                });

                if (!mounted) {
                    return;
                }

                setCopyPolicyDetail(data);
            } catch (error) {
                console.error('Failed to get copy policy by ID:', error);

                if (mounted) {
                    setCopyPolicyDetail(null);
                }
            } finally {
                if (mounted) {
                    setLoadingDetail(false);
                }
            }
        };

        loadCopyPolicy();

        return () => {
            mounted = false;
        };
    }, [open, copyPolicyId, copyPolicy, access_token, fetchRulePolicyById, form]);

    /*
        =====================================================
        POPULATE COPY DATA
        =====================================================
        */

    useEffect(() => {
        if (!open || !copyPolicyDetail) {
            return;
        }

        const source = copyPolicyDetail;

        const range = String(source?.allow_range || '').match(/\d+/g) || [];

        const publicDate = source?.publicDate || source?.publish_date || source?.publishDate;

        /*
                Reset previous name check
                because copied policy gives us
                a new policy name.
                */

        lastCheckedNameRef.current = '';

        form.setFieldsValue({
            policy_name: `${source?.policy_name || source?.policyName || ''} - COPY`,

            leave_post: source?.type || source?.policyType,

            grace_period: parseInt(source?.grace_period) || Number(source?.dailyGracePeriod) || 0,

            from_minute: Number(source?.allowLatePerMonth?.from ?? range?.[0]) || 0,

            to_minute: Number(source?.allowLatePerMonth?.to ?? range?.[1]) || 0,

            monthly_allowance: parseInt(source?.monthly_allowance) || Number(source?.allowLatePerMonth?.time) || 0,

            display_date: publicDate ? dayjs(publicDate) : null,
        });

        const copiedTiers = source?.penalty_tiers || source?.penaltyTiers || [];

        const hasPenalty =
            source?.apply_penalty !== undefined
                ? Boolean(source.apply_penalty)
                : source?.penalty === true || copiedTiers.length > 0;

        setApplyPenalty(hasPenalty);

        if (hasPenalty && copiedTiers.length > 0) {
            setTiers(copiedTiers.map(normalizeCopiedTier));
        } else if (hasPenalty) {
            setTiers([
                {
                    ...DEFAULT_TIER,
                },
            ]);
        } else {
            setTiers([]);
        }
    }, [open, copyPolicyDetail, form]);

    /*
        =====================================================
        CLOSE
        =====================================================
        */

    const handleClose = () => {
        /*
                Clear timer
                */

        if (policyNameTimerRef.current) {
            clearTimeout(policyNameTimerRef.current);
        }

        lastCheckedNameRef.current = '';

        setCheckingPolicyName(false);

        setOpen(false);

        setCopyPolicyDetail(null);
    };

    /*
        =====================================================
        SECTION TITLE
        =====================================================
        */

    const SectionTitle = ({ children }) => (
        <div className="my-5 flex w-full items-center gap-3">
            <span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[2px] text-[#1148A5]">
                {children}
            </span>

            <div className="h-[1px] flex-1 bg-[#D9DEE8]" />
        </div>
    );

    /*
        =====================================================
        SUBMIT
        =====================================================
        */

    const handleSubmit = async () => {
        try {
            /*
                            Validate normal required
                            fields
                            */

            const values = await form.validateFields();

            /*
                            If policy name is currently
                            being checked, don't submit yet.
                            */

            if (checkingPolicyName) {
                return;
            }

            /*
                            Check if current policy
                            name has an error.
                            */

            const policyNameErrors = form.getFieldError('policy_name');

            if (policyNameErrors?.length > 0) {
                return;
            }

            /*
                            Build penalty tiers
                            */

            const penaltyTiers = applyPenalty ? tiers.map((tier, index) => buildPenaltyTier(tier, index)) : [];

            /*
                            Public date
                            */

            const publicDate = values?.display_date ? values.display_date.format('YYYY-MM-DD') : null;

            /*
                            Payload
                            */

            const payload = {
                policyName: values?.policy_name,

                policyType: values?.leave_post,

                dailyGracePeriod: Number(values?.grace_period) || 0,

                allowLatePerMonth: {
                    from: Number(values?.from_minute) || 0,

                    to: Number(values?.to_minute) || 0,

                    time: Number(values?.monthly_allowance) || 0,
                },

                penalty: applyPenalty,

                penaltyTiers,

                publicDate,
            };

            console.log(copyPolicyDetail ? 'COPY & CREATE NEW PAYLOAD:' : 'ADD POLICY PAYLOAD:', payload);

            if (typeof onCreate === 'function') {
                await onCreate(payload);
            }

            setOpen(false);
        } catch (error) {
            console.log('Validation error:', error);
        }
    };

    /*
        =====================================================
        UI
        =====================================================
        */

    return (
        <Modal
            open={open}
            rootClassName="lateModalPadding"
            onCancel={handleClose}
            footer={null}
            width={750}
            title={copyPolicy || copyPolicyId ? 'Copy & Create New Policy' : 'Add Rule Policy'}
        >
            {loadingDetail ? (
                <div className="flex min-h-[400px] items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <Form form={form} requiredMark={false} layout="vertical">
                    <div className="px-5 pt-5">
                        <Row gutter={12}>
                            {/* =====================================================
                                POLICY NAME
                            ===================================================== */}

                            <Col span={12}>
                                <Form.Item
                                    label={
                                        <span>
                                            Policy Name <span className="text-red-500">*</span>
                                        </span>
                                    }
                                    name="policy_name"
                                    rules={[
                                        {
                                            required: true,

                                            message: 'Please input policy name',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter name"
                                        onChange={() => {
                                            form.setFields([
                                                {
                                                    name: 'policy_name',
                                                    errors: [],
                                                },
                                            ]);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            {/* =====================================================
                                LEAVE POST
                            ===================================================== */}

                            <Col span={12}>
                                <Form.Item
                                    label={
                                        <>
                                            <span className="text-red-500">*</span> <span>No C/In on Leaving Post</span>
                                        </>
                                    }
                                    name="leave_post"
                                    rules={[
                                        {
                                            required: true,

                                            message: 'Please select type',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select type"
                                        options={[
                                            {
                                                label: 'Late in',

                                                value: 'Late in',
                                            },

                                            {
                                                label: 'Early out',

                                                value: 'Early out',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* =====================================================
                            DAILY GRACE PERIOD
                        ===================================================== */}

                        <Form.Item label="Daily Grace Period - minutes" name="grace_period">
                            <Input type="number" min={0} placeholder="0" />
                        </Form.Item>

                        <div className="-mt-6 text-sm text-gray-400">Not recorded as late — no penalty.</div>

                        {/* =====================================================
                            ALLOW LATE PER MONTH
                        ===================================================== */}

                        <SectionTitle>ALLOW LATE PER MONTH</SectionTitle>

                        <Row gutter={12} align="middle">
                            <Col span={11}>
                                <Form.Item label="From(minutes)" name="from_minute">
                                    <Input type="number" min={0} placeholder="0" />
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <div className="mt-1 text-center text-gray-400">→</div>
                            </Col>

                            <Col span={11}>
                                <Form.Item label="To(minutes)" name="to_minute">
                                    <Input type="number" min={0} placeholder="0" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Monthly Allowance (times per month)" name="monthly_allowance">
                            <Input type="number" min={0} placeholder="0" />
                        </Form.Item>

                        <div className="-mt-5 text-xs text-gray-400">Exceeding this triggers the penalty structure below.</div>

                        {/* =====================================================
                            PENALTY STRUCTURE
                        ===================================================== */}

                        <SectionTitle>PENALTY STRUCTURE</SectionTitle>

                        <div className="mb-4 flex items-center justify-between rounded-lg border bg-gray-50 p-4">
                            <div>
                                <div className="font-medium">Apply penalty deductions</div>

                                <div className="text-sm text-gray-400">Turn off if this policy has no salary or leave deductions</div>
                            </div>

                            <Switch
                                checked={applyPenalty}
                                onChange={(checked) => {
                                    setApplyPenalty(checked);

                                    if (!checked) {
                                        setTiers([]);

                                        return;
                                    }

                                    if (tiers.length === 0) {
                                        setTiers([
                                            {
                                                ...DEFAULT_TIER,
                                            },
                                        ]);
                                    }
                                }}
                            />
                        </div>

                        {applyPenalty ? (
                            <PenaltyTiers tiers={tiers} setTiers={setTiers} />
                        ) : (
                            <div className="rounded-lg border border-dashed py-5 text-center text-gray-400">
                                No penalty deductions — late arrivals are recorded but not penalised.
                            </div>
                        )}

                        {/* =====================================================
                            DISPLAY DATE
                        ===================================================== */}

                        <div className="mt-4">
                            <label className="font-medium">ខែចេញបើកប្រកាស (Display only)</label>

                            <Form.Item name="display_date" className="!mb-0">
                                <DatePicker className="mt-2 w-full" placeholder="Select date" />
                            </Form.Item>
                        </div>
                    </div>

                    {/* =====================================================
                        FOOTER
                    ===================================================== */}

                    <div className="mt-6 border-t border-gray-200 px-5 py-4">
                        <div className="flex gap-3">
                            <Button block onClick={handleClose}>
                                Cancel
                            </Button>

                            <Button
                                block
                                type="primary"
                                onClick={handleSubmit}
                                loading={checkingPolicyName}
                                disabled={checkingPolicyName}
                            >
                                ✓ {copyPolicy || copyPolicyId ? 'Create New Policy' : 'Save Policy'}
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default AddLatePolicy;
