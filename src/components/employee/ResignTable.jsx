import React, { useMemo } from 'react';

import { Table } from 'antd';

import { buildResignColumns } from './ResignColumns';

const getRowId = (row) => {
    return row?.id || row?._id || row?.employee_id;
};

export default function ResignTable({
    data = [],

    loading = false,

    selectedRowId,

    onSelectRow,
}) {
    const columns = useMemo(() => buildResignColumns(), []);

    const paginationConfig = {
        pageSize: 10,

        showSizeChanger: true,

        pageSizeOptions: ['10', '20', '50', '100'],

        showTotal: (total) => `${total} Total Amount`,
    };

    return (
        <Table
            className="employee-table-fixed"

            rowKey={(row) => getRowId(row)}

            rowSelection={{
                type: 'radio',

                fixed: true,

                columnWidth: 45,

                selectedRowKeys: selectedRowId ? [selectedRowId] : [],

                onChange: (_, selectedRows) => {
                    const row = selectedRows?.[0];

                    if (!row) {
                        onSelectRow?.(null);

                        return;
                    }

                    onSelectRow?.({
                        ...row,

                        id: getRowId(row),
                    });
                },
            }}

            columns={columns}

            dataSource={data}

            bordered

            size="small"

            loading={loading}

            pagination={paginationConfig}

            scroll={{
                x: 2200,
            }}

            tableLayout="fixed"
        />
    );
}
