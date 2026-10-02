import { Input, Select } from 'antd';

import {
    CONDITION,
    conditionToApi,
    getRangeText,
} from './penaltyHelpers';

const PenaltyTierForm = ({
    tier,
    index,
    locked,
    updateTier,
}) => {
    const condition = conditionToApi(tier?.condition);

    const update = (key, value) => {
        updateTier(index, key, value);
    };

    return (
        <div>
            <label className="text-sm text-gray-600">
                <span className="text-red-500">*</span>{' '}
                Condition
            </label>

            <Select
                className="mt-2 w-full"
                value={tier?.condition || CONDITION.LESS}
                disabled={locked}
                onChange={(value) => {
                    update('condition', value);

                    if (value === CONDITION.BETWEEN) {
                        update('fromMinute', tier?.fromMinute ?? tier?.minute ?? 0);
                        update('toMinute', tier?.toMinute ?? 0);
                    } else {
                        update('minute', tier?.minute ?? tier?.fromMinute ?? 0);
                        update('fromMinute', tier?.fromMinute ?? tier?.minute ?? 0);
                        update('toMinute', 0);
                    }
                }}
                options={[
                    {
                        label: CONDITION.LESS,
                        value: CONDITION.LESS,
                    },
                    {
                        label: CONDITION.BETWEEN,
                        value: CONDITION.BETWEEN,
                    },
                    {
                        label: CONDITION.GREATER,
                        value: CONDITION.GREATER,
                    },
                ]}
            />

            {condition === 'between' ? (
                <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-500">
                            Starting from(ចាប់ពី)
                        </label>

                        <div className="mt-1 flex items-center gap-2">
                            <Input
                                disabled={locked}
                                type="number"
                                min={0}
                                value={tier?.fromMinute ?? 0}
                                onChange={(e) =>
                                    update(
                                        'fromMinute',
                                        e.target.value,
                                    )
                                }
                            />
                            <span className="text-gray-500">m</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">
                            To(ដល់)
                        </label>

                        <div className="mt-1 flex items-center gap-2">
                            <Input
                                disabled={locked}
                                type="number"
                                min={0}
                                value={tier?.toMinute ?? 0}
                                onChange={(e) =>
                                    update(
                                        'toMinute',
                                        e.target.value,
                                    )
                                }
                            />
                            <span className="text-gray-500">m</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    {condition === 'greater' && (
                        <label className="text-sm text-gray-500">
                            Starting from(ចាប់ពី)
                        </label>
                    )}

                    <div className="flex items-center gap-2">
                        <Input
                            disabled={locked}
                            type="number"
                            min={0}
                            value={tier?.minute ?? tier?.fromMinute ?? 0}
                            onChange={(e) => {
                                const value = e.target.value;
                                update('minute', value);
                                update('fromMinute', value);
                            }}
                        />
                        <span className="text-gray-500">m</span>
                    </div>
                </div>
            )}

            <div className="mt-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-500">
                Range:{' '}
                <b className="text-gray-700">
                    {getRangeText(tier)}
                </b>
            </div>
        </div>
    );
};

export default PenaltyTierForm;
