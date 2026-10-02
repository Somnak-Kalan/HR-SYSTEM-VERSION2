import { Breadcrumb, Button, Card, Col, Input, Row, Table, Tabs, Tag, Modal, message } from 'antd';

import { HomeOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

import { useNavigate, useOutletContext } from 'react-router-dom';

import { useContext, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';

import GroupBtn from 'components/GroupBtn';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';

import useRulePolicyStore from '../../../stores/setup/rulePolicy.store';

import LateDetail from './Detail';

import HistoryIcon from '../../../assets/icons/history1.svg';

import AddLatePolicy from './LatePolicy/AddLatePolicy';
import EditLatePolicy from './LatePolicy/EditLatePolicy';

// =====================================================
// HELPERS
// =====================================================

const getRowId = (item) => item?._id || item?.id || item?.policyId || '';

const getErrorMessage = (error, fallback = 'Something went wrong') =>
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

const toNumber = (value, fallback = 0) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
};

// =====================================================
// DURATION
// =====================================================

const formatPenaltyDuration = (from, to, condition) => {
    const fromMinute = toNumber(from);
    const toMinute = toNumber(to);

    const type = String(condition || '').toLowerCase();

    // =============================================
    // GREATER
    // =============================================

    if (type.includes('greater')) {
        if (fromMinute < 60) {
            return `≥ ${fromMinute}min`;
        }

        const hour = Math.floor(fromMinute / 60);

        const minute = fromMinute % 60;

        return `≥ ${hour}:${String(minute).padStart(2, '0')} hours`;
    }

    // =============================================
    // BETWEEN
    // =============================================

    if (type.includes('between')) {
        // 16 - 60
        if (fromMinute < 60 && toMinute === 60) {
            return `from ${fromMinute}min - 1 hour`;
        }

        // 61 - 120
        if (fromMinute >= 60 && toMinute >= 60) {
            const fromHour = Math.floor(fromMinute / 60);

            const fromRemaining = fromMinute % 60;

            const toHour = Math.floor(toMinute / 60);

            const toRemaining = toMinute % 60;

            return `${fromHour}:${String(fromRemaining).padStart(2, '0')} - ${toHour}:${String(toRemaining).padStart(
                2,
                '0'
            )} hours`;
        }

        if (fromMinute < 60 && toMinute < 60) {
            return `${fromMinute}min - ${toMinute}min`;
        }

        return `${fromMinute}min - ${toMinute}min`;
    }

    // =============================================
    // LESS
    // =============================================

    if (fromMinute < 60) {
        return `≤ ${fromMinute} min`;
    }

    const hour = Math.floor(fromMinute / 60);

    const minute = fromMinute % 60;

    return `≤ ${hour}:${String(minute).padStart(2, '0')} hours`;
};

// =====================================================
// PENALTY TYPE
// =====================================================

const normalizeDeductionType = (value) => {
    if (value === 'Salary Deduction') {
        return 'Salary';
    }

    return value || 'Salary';
};

// =====================================================
// PENALTY TIER
// =====================================================

const normalizeTier = (tier, index) => {
    const deductionType = normalizeDeductionType(tier?.deductionType || tier?.deduction_type || tier?.type);

    const from = toNumber(tier?.from ?? tier?.fromMinute ?? tier?.from_minute ?? tier?.minute);

    const to = toNumber(tier?.to ?? tier?.toMinute ?? tier?.to_minute);

    const condition = tier?.condition || 'less';

    const amount = Number(tier?.amount) || 0;

    return {
        ...tier,

        tierNo: tier?.tierNo || index + 1,

        from,

        to,

        condition,

        deductionType,

        type: deductionType,

        amount,

        duration: tier?.duration || formatPenaltyDuration(from, to, condition),

        displayAmount: deductionType === 'Annual Leave' ? `${amount} day` : `$${amount}`,

        description:
            tier?.description ||
            (deductionType === 'Annual Leave' ? `Deduct ${amount} day from Annual Leave` : `Salary deduction of $${amount}`),
    };
};

// =====================================================
// NORMALIZE POLICY
// =====================================================

const normalizePolicy = (record) => {
    const item = record || {};

    const allowLate = item?.allowLatePerMonth || item?.allow_late_per_month || {};

    const penaltySource = item?.penaltyTiers || item?.penalty_tiers || item?.penalty || [];

    const penaltyTiers = Array.isArray(penaltySource) ? penaltySource.map(normalizeTier) : [];

    const gracePeriod = toNumber(item?.dailyGracePeriod ?? item?.grace_period);

    const allowFrom = toNumber(allowLate?.from ?? item?.fromMinute ?? item?.from_minute);

    const allowTo = toNumber(allowLate?.to ?? item?.toMinute ?? item?.to_minute);

    const monthlyAllowance = toNumber(
        allowLate?.time ?? allowLate?.times ?? item?.monthlyAllowance ?? item?.monthly_allowance
    );

    const departments = Array.isArray(item?.departmentData)
        ? item.departmentData
            .map((department) => department?.departments || department?.name || department?.department_name)
            .filter(Boolean)
        : [];

    const employees = Array.isArray(item?.employeeData)
        ? item.employeeData
            .map((employee) => employee?.nameLatin || employee?.name || employee?.code || employee?.employee_code)
            .filter(Boolean)
        : [];

    const status = String(item?.status ?? item?.published ?? '').toLowerCase();

    return {
        ...item,

        id: getRowId(item),

        policy_name: item?.policyName || item?.policy_name || '-',

        type: item?.policyType || item?.policy_type || item?.type || '-',

        grace_period: item?.grace_period !== undefined ? item.grace_period : `${gracePeriod} min`,

        allow_range: item?.allow_range || (allowFrom === 0 && allowTo === 0 ? 'No' : `${allowFrom}–${allowTo} min`),

        monthly_allowance: item?.monthly_allowance || (monthlyAllowance === 0 ? 'No' : `${monthlyAllowance}x/month`),

        tiers: item?.tiers || (penaltyTiers.length > 0 ? `${penaltyTiers.length} tiers` : 'No penalty'),

        penalty_tiers: penaltyTiers,

        penalty: penaltyTiers,

        apply_penalty: item?.apply_penalty !== undefined ? Boolean(item.apply_penalty) : penaltyTiers.length > 0,

        published: status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : 'Waiting publish',

        publish_date: dayjs(item?.publicDate).format('YYYY-MM-DD') || item?.publishDate || item?.publish_date || null,

        created_by: item?.createdBy?.username || item?.createdBy?.name || item?.createdBy || item?.created_by || '-',

        created_at: dayjs(item?.createdAt).format('YYYY-MM-DD') || item?.created_at || '',

        updated_by: item?.updatedBy?.username || item?.updatedBy?.name || item?.updatedBy || item?.updated_by || '',

        updated_at: dayjs(item?.updatedAt).format('YYYY-MM-DD') || item?.updated_at || '',

        apply: [...departments, ...employees],
    };
};

// =====================================================
// UNWRAP API RESPONSE
// =====================================================

const unwrapPolicyResponse = (response) => {
    return response?.data?.data || response?.data || response?.result || response;
};

// =====================================================
// PAGE
// =====================================================

const Late = () => {
    const { setContent } = useContent();

    const { collapsed } = useOutletContext();

    const navigate = useNavigate();

    const { access_token } = useContext(AuthContext);

    const [selected, setSelected] = useState(null);

    const [search, setSearch] = useState('');

    const [activeTab, setActiveTab] = useState('policy');

    const [detailData, setDetailData] = useState(null);

    const [detailLoading, setDetailLoading] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [copyPolicy, setCopyPolicy] = useState(null);

    const [messageApi, messageContextHolder] = message.useMessage();

    // =================================================
    // STORE
    // =================================================

    const list = useRulePolicyStore((state) => state.list);

    const loading = useRulePolicyStore((state) => state.loading);

    const buttonLoading = useRulePolicyStore((state) => state.buttonLoading);

    const fetchRulePolicies = useRulePolicyStore((state) => state.fetchRulePolicies);

    const fetchRulePolicyById = useRulePolicyStore((state) => state.fetchRulePolicyById);

    const createRulePolicy = useRulePolicyStore((state) => state.createRulePolicy);

    const updateRulePolicy = useRulePolicyStore((state) => state.updateRulePolicy);

    const removeRulePolicy = useRulePolicyStore((state) => state.removeRulePolicy);

    // =================================================
    // LIST ONLY
    // =================================================

    useEffect(() => {
        if (!access_token) {
            return;
        }

        fetchRulePolicies({
            access_token,
            search: '',
        }).catch((error) => {
            messageApi.error(getErrorMessage(error, 'Cannot get rule policies'));
        });
    }, [access_token, fetchRulePolicies]);

    // =================================================
    // SEARCH
    // =================================================

    useEffect(() => {
        if (!access_token) {
            return;
        }

        const timer = setTimeout(() => {
            fetchRulePolicies({
                access_token,
                search,
            }).catch((error) => {
                messageApi.error(getErrorMessage(error, 'Cannot search rule policies'));
            });
        }, 350);

        return () => clearTimeout(timer);
    }, [access_token, search, fetchRulePolicies]);

    // =================================================
    // LIST DATA
    // =================================================

    const dataSource = useMemo(() => {
        if (!Array.isArray(list)) {
            return [];
        }

        return list.map(normalizePolicy);
    }, [list]);

    // =================================================
    // DETAIL
    // IMPORTANT:
    // GET BY ID ONLY WHEN USER CLICKS POLICY
    // =================================================

    const handleOpenDetail = async (row) => {
        const id = getRowId(row);

        if (!id) {
            messageApi.error('Policy ID not found');

            return;
        }

        try {
            setDetailLoading(true);

            const response = await fetchRulePolicyById({
                access_token,
                id,
            });

            const detail = unwrapPolicyResponse(response);

            setDetailData(normalizePolicy(detail));

            setActiveTab('detail');
        } catch (error) {
            messageApi.error(getErrorMessage(error, 'Cannot get policy detail'));
        } finally {
            setDetailLoading(false);
        }
    };

    // =================================================
    // CREATE
    // =================================================

    const handleCreate = async (payload) => {
        try {
            await createRulePolicy({
                access_token,
                doc: payload,
            });

            messageApi.success('Create success');

            setCopyPolicy(null);
            setOpenAdd(false);

            await fetchRulePolicies({
                access_token,
                search,
            });
        } catch (error) {
            messageApi.error(getErrorMessage(error, 'Create failed'));

            throw error;
        }
    };

    // =================================================
    // UPDATE
    // =================================================

    const handleUpdate = async (payload) => {
        const id = payload?.id || payload?._id || payload?.policyId;

        const doc = payload?.doc || payload;

        if (!id) {
            messageApi.error('Policy ID is required');

            return;
        }

        if (!doc) {
            messageApi.error('Update data is required');

            return;
        }

        try {
            console.log('UPDATE POLICY:', {
                id,
                doc,
            });

            await updateRulePolicy({
                access_token,
                id,
                doc,
            });

            messageApi.success('Update success');

            setOpenEdit(false);

            setSelected(null);

            // Refresh list
            await fetchRulePolicies({
                access_token,
                search,
            });
        } catch (error) {
            console.error('UPDATE POLICY ERROR:', error);

            messageApi.error(getErrorMessage(error, 'Update failed'));

            throw error;
        }
    };

    // =================================================
    // DELETE
    // =================================================

    const selectedId = getRowId(selected);

    const handleDelete = () => {
        if (!selectedId) {
            messageApi.warning('Please select policy first');

            return;
        }

        Modal.confirm({
            title: 'Confirm',
            content: 'Confirm to delete this policy?',
            okText: 'Delete',

            okButtonProps: {
                danger: true,
                loading: buttonLoading,
            },

            onOk: async () => {
                try {
                    await removeRulePolicy({
                        access_token,
                        id: selectedId,
                    });

                    messageApi.success('Delete success');

                    setSelected(null);

                    await fetchRulePolicies({
                        access_token,
                        search,
                    });
                } catch (error) {
                    messageApi.error(getErrorMessage(error, 'Delete failed'));

                    throw error;
                }
            },
        });
    };

    // =================================================
    // TABLE COLUMNS
    // =================================================

    const columns = useMemo(
        () => [
            {
                title: 'No',
                width: 50,
                align: 'center',

                render: (_, __, index) => index + 1,
            },

            {
                title: 'Policy Name',
                width: 220,

                render: (_, row) => (
                    <div className="cursor-pointer text-blue-600 hover:underline" onClick={() => handleOpenDetail(row)}>
                        {row.policy_name}
                    </div>
                ),
            },

            {
                title: 'Type',
                dataIndex: 'type',
                width: 100,
            },

            {
                title: 'Grace Period',
                dataIndex: 'grace_period',
                width: 120,
            },

            {
                title: 'Allow Range',
                dataIndex: 'allow_range',
                width: 120,
            },

            {
                title: 'Monthly Allowance',
                dataIndex: 'monthly_allowance',
            },

            {
                title: 'Tiers',
                width: 120,

                render: (_, row) => (
                    <Tag
                        style={{
                            border: 'none',
                            borderRadius: '20px',
                            fontWeight: 'bold',

                            background: row.tiers === 'No penalty' ? '#E5E7EB' : '#FFF1E6',

                            color: row.tiers === 'No penalty' ? '#374151' : '#CA3500',
                        }}
                    >
                        {row.tiers}
                    </Tag>
                ),
            },

            {
                title: 'Published',

                width: 180,

                render: (_, row) => (
                    <div className="flex flex-col gap-1">
                        <Tag
                            style={{
                                width: 'fit-content',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                padding: '2px 14px',
                                fontSize: '12px',

                                background:
                                    row.published === 'Active' ? '#DCFCE7' : row.published === 'Inactive' ? '#E5E7EB' : '#FFF1E6',

                                color: row.published === 'Active' ? '#047857' : row.published === 'Inactive' ? '#374151' : '#DE7600',
                            }}
                        >
                            {row.published}
                        </Tag>

                        {row.published === 'Waiting publish' && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <img src={HistoryIcon} alt="history" />

                                <span>In 1 day</span>
                            </div>
                        )}

                        {row.publish_date && (
                            <div className="text-sm text-gray-600">{row.publish_date}</div>
                        )}
                    </div>
                ),
            },

            {
                title: 'Created',
                width: 140,

                render: (_, row) => (
                    <div>
                        <div>{row.created_by}</div>

                        <div className="text-xs text-gray-500">{row.created_at}</div>
                    </div>
                ),
            },

            {
                title: 'Updated',
                width: 140,

                render: (_, row) => (
                    <div>
                        <div>{row.updated_by}</div>

                        <div className="text-xs text-gray-500">{row.updated_at}</div>
                    </div>
                ),
            },
        ],
        []
    );

    // =================================================
    // ROW SELECTION
    // =================================================

    const rowSelection = {
        type: 'radio',

        selectedRowKeys: selectedId ? [selectedId] : [],

        onChange: (_, rows) => {
            setSelected(rows?.[0] || null);
        },
    };

    // =================================================
    // HEADER BUTTONS
    // =================================================

    useEffect(() => {
        setContent(
            <div className="flex justify-between">
                <GroupBtn
                    collapsed={collapsed}

                    editBtn={activeTab !== 'detail' && !!selectedId}

                    showEditBtn={activeTab !== 'detail'}

                    onEditBtnClick={() => setOpenEdit(true)}

                    showCustomBtn={activeTab !== 'detail'}

                    customButtons={[
                        {
                            text: 'Copy & Create New',

                            enabled: !!selectedId,

                            icon: <EditOutlined />,

                            onClick: () => {
                                if (!selected) {
                                    messageApi.warning('Please select policy first');

                                    return;
                                }

                                setCopyPolicy(selected);

                                setOpenAdd(true);
                            },
                        },
                    ]}

                    deleteBtn={activeTab !== 'detail' && !!selectedId}

                    showDeleteBtn={activeTab !== 'detail'}

                    onDeleteBtnClick={handleDelete}
                />

                <Breadcrumb
                    items={[
                        {
                            title: <HomeOutlined onClick={() => navigate('/')} />,
                        },

                        {
                            title: 'Late',
                        },
                    ]}
                />
            </div>
        );
    }, [collapsed, navigate, selectedId, selected, setContent, activeTab]);

    // =================================================
    // RENDER
    // =================================================

    return (
        <>
            {messageContextHolder}

            {/* ADD / COPY */}
            <AddLatePolicy
                open={openAdd}
                setOpen={setOpenAdd}
                copyPolicy={copyPolicy}
                access_token={access_token}
                onCreate={handleCreate}
            />

            {/* EDIT */}
            <EditLatePolicy
                open={openEdit}
                setOpen={setOpenEdit}
                policy={selected}
                access_token={access_token}
                onUpdate={handleUpdate}
            />

            <Card
                className="late-card"

                title={
                    <div className="text-base font-semibold">
                        {activeTab === 'detail' && detailData ? detailData.policy_name : 'RULE POLICY MANAGEMENT'}
                    </div>
                }

                extra={
                    activeTab === 'policy' && (
                        <Button
                            type="primary"
                            onClick={() => {
                                setCopyPolicy(null);

                                setOpenAdd(true);
                            }}
                            style={{
                                background: '#1677ff',
                            }}
                        >
                            <PlusOutlined />
                            Add Late Policy
                        </Button>
                    )
                }
            >
                <Tabs
                    activeKey={activeTab}

                    onChange={(key) => {
                        setActiveTab(key);
                    }}

                    items={[
                        {
                            key: 'policy',

                            label: 'List Policy',

                            children: (
                                <>
                                    <Row gutter={16} className="mb-4">
                                        <Col xs={24} md={8}>
                                            <Input
                                                placeholder="Search by policy name"

                                                prefix={
                                                    <SearchOutlined
                                                        style={{
                                                            color: '#1677ff',
                                                        }}
                                                    />
                                                }

                                                value={search}

                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </Col>
                                    </Row>

                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <div className="mb-3 text-sm font-semibold">Policies ({dataSource.length})</div>

                                        <Table
                                            rowKey={getRowId}

                                            rowSelection={rowSelection}

                                            columns={columns}

                                            dataSource={dataSource}

                                            loading={loading}

                                            bordered

                                            size="small"

                                            pagination={{
                                                pageSize: 10,
                                            }}

                                            scroll={{
                                                x: 'max-content',
                                            }}
                                        />
                                    </div>
                                </>
                            ),
                        },

                        ...(activeTab === 'detail'
                            ? [
                                {
                                    key: 'detail',

                                    label: 'Details',

                                    children: detailLoading ? (
                                        <div className="flex min-h-[400px] items-center justify-center">
                                            <div className="text-sm text-gray-400">Loading policy details...</div>
                                        </div>
                                    ) : (
                                        <LateDetail policy={detailData} />
                                    ),
                                },
                            ]
                            : []),
                    ]}
                />
            </Card>
        </>
    );
};

export default Late;
