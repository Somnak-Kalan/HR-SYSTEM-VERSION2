import {
    Button,
    Select,
    Input,
    Card,
} from 'antd';

import {
    PlusOutlined,
    CloseOutlined,
} from '@ant-design/icons';

import PenaltyTierForm from './PenaltyTierForm';

import { CONDITION } from './penaltyHelpers';

const DEFAULT_TIER = {
    condition: CONDITION.LESS,
    minute: 0,
    fromMinute: 0,
    toMinute: 0,
    deductionType: 'Salary Deduction',
    amount: 0,
    _isNew: true,
};

const PenaltyTiers = ({
    tiers,
    setTiers,
    editMode = false,
}) => {
    const addTier = () => {
        setTiers((prev) => [
            ...prev,
            {
                ...DEFAULT_TIER,
                tierNo: prev.length + 1,
            },
        ]);
    };

    const removeTier = (index) => {
        const tier = tiers[index];

        if (editMode && !tier?._isNew) {
            return;
        }

        setTiers((prev) =>
            prev.filter(
                (_, tierIndex) => tierIndex !== index,
            ),
        );
    };

    const updateTier = (index, key, value) => {
        const tier = tiers[index];

        if (editMode && !tier?._isNew) {
            return;
        }

        setTiers((prev) =>
            prev.map((item, tierIndex) => {
                if (tierIndex !== index) {
                    return item;
                }

                return {
                    ...item,
                    [key]: value,
                };
            }),
        );
    };

    return (
        <div className="rounded-lg border border-blue-300 bg-blue-50 p-5">
            <div className="mb-5 text-base font-semibold text-gray-700">
                Penalty Tiers
            </div>

            {tiers.map((tier, index) => {
                const locked =
                    editMode && !tier?._isNew;
                return (
                    <Card
                        key={tier?.tierNo || index}
                        className="mb-4"
                        bodyStyle={{ padding: 16 }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="font-medium text-gray-700">
                                Tier {index + 1}
                            </div>

                            <Button
                                type="text"
                                danger
                                disabled={locked}
                                icon={<CloseOutlined className='text-[#99A1AF]' />}
                                onClick={() =>
                                    removeTier(index)
                                }
                            />
                        </div>

                        <PenaltyTierForm
                            tier={tier}
                            index={index}
                            locked={locked}
                            updateTier={updateTier}
                        />
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">
                                    <span className="text-red-500">*</span>{' '}
                                    Deduction Type
                                </label>

                                <Select
                                    disabled={locked}
                                    className="mt-2 w-full"
                                    value={
                                        tier?.deductionType
                                    }
                                    onChange={(value) =>
                                        updateTier(
                                            index,
                                            'deductionType',
                                            value,
                                        )
                                    }
                                    options={[
                                        {
                                            label: 'Salary Deduction',
                                            value: 'Salary Deduction',
                                        },
                                        {
                                            label: 'Annual Leave Deduction',
                                            value: 'Annual Leave Deduction',
                                        },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    {tier?.deductionType ===
                                        'Annual Leave Deduction'
                                        ? 'Amount (days)'
                                        : 'Amount ($)'}
                                </label>

                                <Input
                                    disabled={locked}
                                    className="mt-2"
                                    value={tier?.amount}
                                    min={0}
                                    step={
                                        tier?.deductionType ===
                                            'Annual Leave'
                                            ? 0.5
                                            : 1
                                    }
                                    onChange={(e) =>
                                        updateTier(
                                            index,
                                            'amount',
                                            e.target.value,
                                        )
                                    }
                                    type="number"
                                />
                            </div>
                        </div>
                    </Card>
                );
            })}

            <Button
                block
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={addTier}
            >
                Add Tier
            </Button>
        </div>
    );
};

export default PenaltyTiers;
