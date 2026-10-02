import React, { useMemo } from 'react';

import { Table } from 'antd';

import { buildProbationColumns } from './ProbationColumns';

export default function ProbationTable({
    data = [],
    setOpen,
    loading = false,
}) {
    const columns = useMemo(
        () => buildProbationColumns(setOpen),

        [setOpen]
    );

    return (
        <>
            <Table
                className="employee-table-fixed"

                rowKey={(row) => row.id}

                columns={columns}

                dataSource={data}

                bordered

                size="small"

                loading={loading}

                pagination={{
                    pageSize: 10,

                    showSizeChanger: true,

                    pageSizeOptions: ['10', '20', '50', '100'],

                    showTotal: (total) => `${total} Total Amount`,
                }}

                scroll={{
                    x: 1400,
                }}

                tableLayout="fixed"
            />
        </>
    );
}
