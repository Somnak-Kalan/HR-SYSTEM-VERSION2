import {
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Button,
    Row,
    Col,
    Radio,
    DatePicker,
    Spin,
} from 'antd';

import { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import PenaltyTiers from '../components/PenaltyTiers';

import {
    CONDITION,
    conditionToApi,
    buildPenaltyTier,
} from '../components/penaltyHelpers';

import { useRulePolicyStore } from '../../../../stores/setup/rulePolicy.store';

/*
=========================================================
AUTH
=========================================================
*/

const getAccessToken = (access_token) => {
    const token =
        access_token ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        '';

    return String(token)
        .replace(/^Bearer\s+/i, '')
        .replace(/^"|"$/g, '');
};

/*
=========================================================
GET POLICY ID
=========================================================
*/

const getPolicyId = (policy) => {
    return (
        policy?._id ||
        policy?.id ||
        policy?.policyId ||
        ''
    );
};

/*
=========================================================
GET TIER MINUTES
=========================================================
*/

const getTierMinutes = (item) => {
    const condition = conditionToApi(item?.condition);

    const from = Math.max(
        0,
        Number(
            item?.from ??
            item?.fromMinute ??
            item?.minute ??
            0,
        ) || 0,
    );

    const to = Math.max(
        0,
        Number(
            item?.to ??
            item?.toMinute ??
            0,
        ) || 0,
    );

    return {
        from,
        to: condition === 'between' ? to : 0,
    };
};

/*
=========================================================
NORMALIZE CONDITION
=========================================================
*/

const normalizeCondition = (condition) => {
    const value = String(condition || '').toLowerCase();

    if (value.includes('between')) {
        return CONDITION.BETWEEN;
    }

    if (value.includes('greater')) {
        return CONDITION.GREATER;
    }

    return CONDITION.LESS;
};

/*
=========================================================
NORMALIZE TIER
=========================================================
*/

const normalizeTier = (item, index) => {
    const condition = normalizeCondition(
        item?.condition,
    );

    const { from, to } = getTierMinutes(item);

    return {
        ...item,

        tierNo:
            item?.tierNo ||
            index + 1,

        condition,

        minute: from,

        fromMinute: from,

        toMinute: to,

        deductionType:
            item?.deductionType ||
            item?.deduction_type ||
            'Salary Deduction',

        amount: item?.amount ?? 0,

        _apiFrom: from,

        _apiTo: to,

        /*
        Existing tiers are locked.
        New tiers can still be edited.
        */
        _isNew: false,
    };
};

/*
=========================================================
CHECK POLICY NAME RESPONSE
=========================================================
*/

const isPolicyNameExists = (response) => {
    const payload =
        response?.data?.data ??
        response?.data ??
        response;

    /*
    Backend:

    {
        check: true,
        message: "You cannot use this policy name!!!"
    }
    */

    if (
        typeof payload?.check ===
        'boolean'
    ) {
        return payload.check;
    }

    if (
        typeof payload ===
        'boolean'
    ) {
        return payload;
    }

    if (
        typeof payload?.exists ===
        'boolean'
    ) {
        return payload.exists;
    }

    if (
        typeof payload?.isExists ===
        'boolean'
    ) {
        return payload.isExists;
    }

    if (
        typeof payload?.duplicate ===
        'boolean'
    ) {
        return payload.duplicate;
    }

    if (
        typeof payload?.available ===
        'boolean'
    ) {
        return !payload.available;
    }

    if (
        typeof payload?.isAvailable ===
        'boolean'
    ) {
        return !payload.isAvailable;
    }

    return false;
};

/*
=========================================================
EDIT LATE POLICY
=========================================================
*/

const EditLatePolicy = ({
    open,
    setOpen,
    policy,
    access_token,
    onUpdate,
}) => {
    const [form] = Form.useForm();

    /*
    =====================================================
    TIERS
    =====================================================
    */

    const [tiers, setTiers] = useState([]);

    /*
    =====================================================
    APPLY PENALTY
    =====================================================
    */

    const [applyPenalty, setApplyPenalty] =
        useState(false);

    /*
    =====================================================
    POLICY DETAIL
    =====================================================
    */

    const [policyDetail, setPolicyDetail] =
        useState(null);

    /*
    =====================================================
    LOADING
    =====================================================
    */

    const [loadingDetail, setLoadingDetail] =
        useState(false);

    /*
    =====================================================
    POLICY NAME CHECKING
    =====================================================
    */

    const [checkingPolicyName, setCheckingPolicyName] =
        useState(false);

    /*
    =====================================================
    POLICY NAME WATCH
    =====================================================
    */

    const policyName = Form.useWatch(
        'policy_name',
        form,
    );

    /*
    =====================================================
    TIMER
    =====================================================
    */

    const policyNameTimerRef =
        useRef(null);

    /*
    =====================================================
    LAST CHECKED NAME
    =====================================================
    */

    const lastCheckedNameRef =
        useRef('');

    /*
    =====================================================
    STORE
    =====================================================
    */

    const fetchRulePolicyById =
        useRulePolicyStore(
            (state) =>
                state.fetchRulePolicyById,
        );

    const checkRulePolicyName =
        useRulePolicyStore(
            (state) =>
                state.checkRulePolicyName,
        );

    /*
    =====================================================
    GET POLICY BY ID
    =====================================================
    */

    useEffect(() => {
        if (!open) {
            return;
        }

        const policyId =
            getPolicyId(policy);

        if (!policyId) {
            setPolicyDetail(null);

            setTiers([]);

            setApplyPenalty(false);

            lastCheckedNameRef.current =
                '';

            return;
        }

        if (
            policyNameTimerRef.current
        ) {
            clearTimeout(
                policyNameTimerRef.current,
            );
        }

        lastCheckedNameRef.current =
            '';

        let mounted = true;

        const loadPolicy = async () => {
            try {
                setLoadingDetail(true);

                const token =
                    getAccessToken(
                        access_token,
                    );

                const data =
                    await fetchRulePolicyById({
                        access_token:
                            token,
                        id: policyId,
                    });

                if (!mounted) {
                    return;
                }

                setPolicyDetail(data);
            } catch (error) {
                console.error(
                    'Failed to get rule policy by ID:',
                    error,
                );

                if (mounted) {
                    setPolicyDetail(null);
                }
            } finally {
                if (mounted) {
                    setLoadingDetail(false);
                }
            }
        };

        loadPolicy();

        return () => {
            mounted = false;
        };
    }, [
        open,
        policy,
        access_token,
        fetchRulePolicyById,
    ]);

    /*
    =====================================================
    SET FORM DATA
    =====================================================
    */

    useEffect(() => {
        if (
            !open ||
            !policyDetail
        ) {
            return;
        }

        const allowLate =
            policyDetail?.allowLatePerMonth ||
            {};

        const range =
            String(
                policyDetail?.allow_range ||
                '',
            ).match(/\d+/g) || [];

        /*
        Existing penalty tiers
        */

        const existingTiers =
            policyDetail?.penalty_tiers ||
            policyDetail?.penaltyTiers ||
            [];

        const normalizedTiers =
            Array.isArray(existingTiers)
                ? existingTiers.map(
                    normalizeTier,
                )
                : [];

        setTiers(
            normalizedTiers,
        );

        /*
        =====================================================
        APPLY PENALTY STATE
        =====================================================

        Backend has:

        penalty: true / false

        If penalty is true,
        show penalty structure.

        Otherwise hide it.
        */

        const backendPenalty =
            policyDetail?.penalty;

        if (
            typeof backendPenalty ===
            'boolean'
        ) {
            setApplyPenalty(
                backendPenalty,
            );
        } else {
            setApplyPenalty(
                normalizedTiers.length >
                0,
            );
        }

        /*
        Reset checked name
        */

        lastCheckedNameRef.current =
            '';

        /*
        Clear previous validation
        */

        form.setFields([
            {
                name: 'policy_name',
                errors: [],
            },
        ]);

        /*
        =====================================================
        FORM DATA
        =====================================================
        */

        form.setFieldsValue({
            policy_name:
                policyDetail?.policy_name ||
                policyDetail?.policyName,

            leave_post:
                policyDetail?.type ||
                policyDetail?.policyType,

            grace_period:
                parseInt(
                    policyDetail?.grace_period,
                ) ||
                Number(
                    policyDetail?.dailyGracePeriod,
                ) ||
                0,

            from_minute:
                Number(
                    allowLate?.from ??
                    range?.[0],
                ) || 0,

            to_minute:
                Number(
                    allowLate?.to ??
                    range?.[1],
                ) || 0,

            monthly_allowance:
                parseInt(
                    policyDetail?.monthly_allowance,
                ) ||
                Number(
                    allowLate?.time,
                ) ||
                0,

            status:
                String(
                    policyDetail?.status ||
                    policyDetail?.published ||
                    '',
                ).toLowerCase() ===
                    'active'
                    ? 1
                    : 0,

            display_date:
                policyDetail?.publicDate
                    ? dayjs(
                        policyDetail.publicDate,
                    )
                    : policyDetail?.publish_date
                        ? dayjs(
                            policyDetail.publish_date,
                        )
                        : policyDetail?.publishDate
                            ? dayjs(
                                policyDetail.publishDate,
                            )
                            : null,
        });
    }, [
        open,
        policyDetail,
        form,
    ]);

    /*
    =====================================================
    AUTO CHECK POLICY NAME
    =====================================================
    */

    useEffect(() => {
        const name =
            String(
                policyName || '',
            ).trim();

        if (
            policyNameTimerRef.current
        ) {
            clearTimeout(
                policyNameTimerRef.current,
            );
        }

        /*
        Empty
        */

        if (!name) {
            lastCheckedNameRef.current =
                '';

            setCheckingPolicyName(
                false,
            );

            form.setFields([
                {
                    name: 'policy_name',
                    errors: [],
                },
            ]);

            return;
        }

        /*
        Don't check same name
        */

        if (
            lastCheckedNameRef.current ===
            name
        ) {
            return;
        }

        /*
        Wait 1 second
        */

        policyNameTimerRef.current =
            setTimeout(
                async () => {
                    try {
                        setCheckingPolicyName(
                            true,
                        );

                        const token =
                            getAccessToken(
                                access_token,
                            );

                        const policyId =
                            getPolicyId(
                                policyDetail ||
                                policy,
                            );

                        const response =
                            await checkRulePolicyName(
                                {
                                    access_token:
                                        token,

                                    policyName:
                                        name,

                                    policyId:
                                        policyId ||
                                        undefined,
                                },
                            );

                        console.log(
                            'CHECK POLICY NAME RESPONSE:',
                            response,
                        );

                        const exists =
                            isPolicyNameExists(
                                response,
                            );

                        const responsePayload =
                            response?.data
                                ?.data ??
                            response?.data ??
                            response;

                        const backendMessage =
                            responsePayload?.message ||
                            '';

                        if (exists) {
                            form.setFields([
                                {
                                    name: 'policy_name',

                                    errors: [
                                        backendMessage ||
                                        'Policy name already exists',
                                    ],
                                },
                            ]);
                        } else {
                            form.setFields([
                                {
                                    name: 'policy_name',

                                    errors: [],
                                },
                            ]);
                        }

                        lastCheckedNameRef.current =
                            name;
                    } catch (error) {
                        console.log(
                            'Check policy name error:',
                            error,
                        );

                        const backendMessage =
                            error?.response
                                ?.data
                                ?.message ||
                            error?.response
                                ?.data
                                ?.msg ||
                            error?.message ||
                            '';

                        const message =
                            String(
                                backendMessage,
                            ).toLowerCase();

                        const isDuplicate =
                            message.includes(
                                'already exists',
                            ) ||
                            message.includes(
                                'already exist',
                            ) ||
                            message.includes(
                                'duplicate',
                            ) ||
                            message.includes(
                                'already used',
                            );

                        if (
                            isDuplicate
                        ) {
                            form.setFields([
                                {
                                    name: 'policy_name',

                                    errors: [
                                        backendMessage ||
                                        'Policy name already exists',
                                    ],
                                },
                            ]);
                        } else {
                            form.setFields([
                                {
                                    name: 'policy_name',

                                    errors: [
                                        'Unable to check policy name. Please try again.',
                                    ],
                                },
                            ]);
                        }
                    } finally {
                        setCheckingPolicyName(
                            false,
                        );
                    }
                },
                1000,
            );

        return () => {
            if (
                policyNameTimerRef.current
            ) {
                clearTimeout(
                    policyNameTimerRef.current,
                );
            }
        };
    }, [
        policyName,
        access_token,
        checkRulePolicyName,
        form,
        policyDetail,
        policy,
    ]);

    /*
    =====================================================
    TOGGLE PENALTY
    =====================================================
    */

    const handlePenaltyToggle = (
        checked,
    ) => {
        setApplyPenalty(
            checked,
        );

        /*
        When turning ON and
        there are no tiers,
        automatically create the
        first tier.

        This means:

        OFF
          ↓
        click switch
          ↓
        PenaltyTiers appears
          ↓
        Tier 1 appears
        */

        if (
            checked &&
            tiers.length === 0
        ) {
            setTiers([
                {
                    tierNo: 1,

                    condition:
                        CONDITION.LESS,

                    minute: 0,

                    fromMinute: 0,

                    toMinute: 0,

                    deductionType:
                        'Salary Deduction',

                    amount: 0,

                    _isNew: true,
                },
            ]);
        }
    };

    /*
    =====================================================
    CLOSE
    =====================================================
    */

    const handleClose = () => {
        if (
            policyNameTimerRef.current
        ) {
            clearTimeout(
                policyNameTimerRef.current,
            );
        }

        lastCheckedNameRef.current =
            '';

        setCheckingPolicyName(
            false,
        );

        setPolicyDetail(null);

        setTiers([]);

        setApplyPenalty(false);

        form.resetFields();

        setOpen(false);
    };

    /*
    =====================================================
    SECTION TITLE
    =====================================================
    */

    const SectionTitle = ({
        children,
    }) => (
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

    const handleSubmit =
        async () => {
            try {
                const values =
                    await form.validateFields();

                /*
                Don't submit while
                checking policy name
                */

                if (
                    checkingPolicyName
                ) {
                    return;
                }

                /*
                Don't submit if policy
                name has an error
                */

                const policyNameErrors =
                    form.getFieldError(
                        'policy_name',
                    );

                if (
                    policyNameErrors?.length >
                    0
                ) {
                    return;
                }

                /*
                =====================================================
                STATUS
                =====================================================
                */

                const status =
                    Number(
                        values?.status,
                    ) === 1
                        ? 'active'
                        : 'inactive';

                /*
                =====================================================
                PUBLIC DATE
                =====================================================
                */

                const publicDate =
                    values?.display_date
                        ? values.display_date.format(
                            'YYYY-MM-DD',
                        )
                        : null;

                /*
                =====================================================
                POLICY ID
                =====================================================
                */

                const policyId =
                    getPolicyId(
                        policyDetail ||
                        policy,
                    );

                /*
                =====================================================
                BUILD DOCUMENT
                =====================================================
                */
                const doc = {
                    policyName:
                        values?.policy_name,

                    status,

                    publicDate,

                    /*
                    IMPORTANT:
                    */

                    // penalty:
                    //     applyPenalty,
                };

                /*
                =====================================================
                PENALTY
                =====================================================
                */

                // if (
                //     applyPenalty
                // ) {
                //     /*
                //     Send ALL tiers.

                //     Existing tiers + newly
                //     added tiers.
                //     */

                //     const penaltyTiers =
                //         tiers.map(
                //             (
                //                 item,
                //                 index,
                //             ) =>
                //                 buildPenaltyTier(
                //                     item,
                //                     index,
                //                 ),
                //         );

                //     doc.penaltyTiers =
                //         penaltyTiers;
                // } else {
                //     /*
                //     Penalty OFF

                //     Clear penalty tiers.
                //     */

                //     doc.penaltyTiers =
                //         [];
                // }

                /*
                =====================================================
                PAYLOAD
                =====================================================
                */

                const payload = {
                    id: policyId,

                    doc,
                };

                console.log(
                    'UPDATE PAYLOAD:',
                    payload,
                );

                /*
                =====================================================
                UPDATE
                =====================================================
                */

                if (
                    typeof onUpdate ===
                    'function'
                ) {
                    await onUpdate(
                        payload,
                    );
                }

                setOpen(false);
            } catch (error) {
                console.log(
                    'Validation error:',
                    error,
                );
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
            title="Edit Rule Policy"
        >
            {loadingDetail ? (
                <div className="flex min-h-[400px] items-center justify-center">
                    <Spin size="large" />
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                >
                    <div className="px-5 pt-5">
                        <Row gutter={12}>
                            {/* =====================================================
                                POLICY NAME
                            ===================================================== */}

                            <Col span={12}>
                                <Form.Item
                                    label={
                                        <span>
                                            Policy Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </span>
                                    }
                                    name="policy_name"
                                    rules={[
                                        {
                                            required:
                                                true,

                                            message:
                                                'Please input policy name',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter policy name"
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
                                NO C/IN
                            ===================================================== */}

                            <Col span={12}>
                                <Form.Item
                                    label={
                                        <>
                                            <span className="text-red-500">
                                                *
                                            </span>{' '}
                                            <span>
                                                No C/In on Leaving Post
                                            </span>
                                        </>
                                    }
                                    name="leave_post"
                                >
                                    <Select
                                        disabled
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

                        <Form.Item
                            label="Daily Grace Period - minutes"
                            name="grace_period"
                        >
                            <Input
                                disabled
                                type="number"
                            />
                        </Form.Item>

                        <div className="-mt-6 text-sm text-gray-400">
                            Not recorded as late — no penalty.
                        </div>

                        {/* =====================================================
                            ALLOW LATE PER MONTH
                        ===================================================== */}

                        <SectionTitle>
                            ALLOW LATE PER MONTH
                        </SectionTitle>

                        <Row
                            gutter={12}
                            align="middle"
                        >
                            <Col span={11}>
                                <Form.Item
                                    label="From(minutes)"
                                    name="from_minute"
                                >
                                    <Input
                                        disabled
                                        type="number"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={2}>
                                <div className="mt-1 text-center text-gray-400">
                                    →
                                </div>
                            </Col>

                            <Col span={11}>
                                <Form.Item
                                    label="To(minutes)"
                                    name="to_minute"
                                >
                                    <Input
                                        disabled
                                        type="number"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Monthly Allowance (times per month)"
                            name="monthly_allowance"
                        >
                            <Input
                                disabled
                                type="number"
                            />
                        </Form.Item>

                        <div className="-mt-5 text-xs text-gray-400">
                            Exceeding this triggers the penalty structure below.
                        </div>

                        {/* =====================================================
                            PENALTY STRUCTURE
                        ===================================================== */}

                        <SectionTitle>
                            PENALTY STRUCTURE
                        </SectionTitle>

                        {/* =====================================================
                            APPLY PENALTY SWITCH
                        ===================================================== */}

                        <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div>
                                <div className="text-base font-medium text-gray-800">
                                    Apply penalty deductions
                                </div>

                                <div className="text-sm text-gray-400">
                                    Turn off if this policy has no salary or leave deductions
                                </div>
                            </div>

                            <Switch
                                checked={
                                    applyPenalty
                                }
                                onChange={
                                    handlePenaltyToggle
                                }
                            />
                        </div>

                        {/* =====================================================
                            PENALTY TIERS
                            
                            ONLY SHOW WHEN SWITCH IS ON
                        ===================================================== */}

                        {applyPenalty ? (
                            <PenaltyTiers
                                tiers={
                                    tiers
                                }
                                setTiers={
                                    setTiers
                                }
                                editMode
                            />
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-7 text-center text-base text-gray-400">
                                No penalty deductions — late arrivals are recorded but not penalised.
                            </div>
                        )}

                        {/* =====================================================
                            STATUS
                        ===================================================== */}

                        <SectionTitle>
                            STATUS
                        </SectionTitle>

                        <Form.Item
                            name="status"
                            rules={[
                                {
                                    required:
                                        true,

                                    message:
                                        'Please select status',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={1}>
                                    Active
                                </Radio>

                                <Radio value={0}>
                                    Inactive
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    {/* =====================================================
                        DISPLAY DATE
                    ===================================================== */}

                    <div className="mt-4 px-5">
                        <label className="font-medium">
                            ខែចេញបើកប្រកាស(Display only)
                        </label>

                        <Form.Item
                            name="display_date"
                            className="!mb-0"
                        >
                            <DatePicker
                                className="mt-2 w-full"
                                placeholder="Select date"
                            />
                        </Form.Item>
                    </div>

                    {/* =====================================================
                        FOOTER
                    ===================================================== */}

                    <div className="mt-6 border-t border-gray-200 px-5 py-4">
                        <div className="flex gap-3">
                            <Button
                                block
                                onClick={
                                    handleClose
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                block
                                type="primary"
                                className="
        !bg-[#F79421]
        !border-[#F79421]
        hover:!bg-[#F79421]
        hover:!border-[#F79421]
        active:!bg-[#F79421]
        active:!border-[#F79421]
    "
                                onClick={handleSubmit}
                                loading={checkingPolicyName}
                                disabled={checkingPolicyName}
                            >
                                ✓ Update Policy
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default EditLatePolicy;