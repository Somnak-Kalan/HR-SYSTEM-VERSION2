import React, { memo, useMemo } from 'react';
import { CheckSquareOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Checkbox, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';

const getColor = (value) => {
  if (value === 'H' || value === 'E' || value === 'MS') return '#FFBF00';
  if (value === 'S' || value === 'AL' || value === 'UL' || value === 'N') return 'blue';
  if (value === 'Sh') return 'black';
  return 'red';
};

const TableAttReport = (props) => {
  const {
    columns,
    loading,
    data,
    check_all,
    checkedList,
    onCheckAllChange,
    on_Change_Checkbox,
    copyToClipboard,
    openNewTab,
    ReadMoreComponent,
  } = props;

  const checkedSet = useMemo(() => new Set(checkedList || []), [checkedList]);

  const dayMaps = useMemo(() => {
    const m = new Map();
    (Array.isArray(data) ? data : []).forEach((row) => {
      const map = new Map();
      (Array.isArray(row?.days) ? row.days : []).forEach((d) => {
        const k = dayjs(d?.date).format('YYYY-MM-DD');
        map.set(k, d);
      });
      m.set(row?.id, map);
    });
    return m;
  }, [data]);

  const fixedHeaderStyle = {
    background: '#333a40',
    color: 'white',
    border: '1px solid #dddddd',
    textAlign: 'center',
    padding: '6px 10px',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  };

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map((c, idx) => {
            const isToday = c.type === 'day' && c.key === dayjs().format('YYYY-MM-DD');
            return (
              <th
                key={c.key}
                style={{
                  ...fixedHeaderStyle,
                  background: isToday ? 'blue' : fixedHeaderStyle.background,
                  minWidth: idx === 0 ? 90 : c.key === 'full_name' ? 160 : c.key === 'department_name' ? 180 : 70,
                }}>
                {c.label}
              </th>
            );
          })}
        </tr>

        <tr>
          {columns.map((c, idx) => {
            const isFixed = idx <= 3;
            return (
              <th
                key={`${c.key}-sub`}
                style={{
                  border: '1px solid #dddddd',
                  textAlign: 'center',
                  padding: '5px 10px',
                  position: 'sticky',
                  top: 38,
                  zIndex: 39,
                  background: isFixed ? '#333a40' : c.day === 'Sun' ? '#e50000' : 'green',
                  color: 'white',
                }}>
                {idx === 0 ? <Checkbox onChange={onCheckAllChange} checked={check_all} /> : isFixed ? '' : c.day}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
                <Spin size="large" />
              </div>
            </td>
          </tr>
        ) : (
          (Array.isArray(data) ? data : []).map((row) => {
            const map = dayMaps.get(row?.id) || new Map();

            return (
              <tr key={row?.id} style={{ border: '1px solid #dddddd' }}>
                {columns.map((c, idx) => {
                  const baseStyle = {
                    padding: '2px 6px',
                    border: '1px solid rgb(240, 240, 240)',
                    textAlign: 'center',
                  };

                  if (idx === 0) {
                    return (
                      <td key={`${row.id}-actions`} style={baseStyle}>
                        <Checkbox
                          checked={checkedSet.has(row.id)}
                          onChange={(e) => on_Change_Checkbox(e.target.checked, row)}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(row?.id)}
                          style={{ marginLeft: 8, border: 'white solid 1px' }}
                        />
                      </td>
                    );
                  }

                  if (c.key === 'vts_code') {
                    return (
                      <td key={`${row.id}-vts`} style={baseStyle}>
                        <Button onClick={() => openNewTab(row)} type="link" size="small">
                          {row?.info?.employee_id}
                        </Button>
                      </td>
                    );
                  }

                  if (c.key === 'full_name') {
                    return (
                      <td key={`${row.id}-name`} style={baseStyle}>
                        <span className="cursor-pointer text-blue-500" onClick={() => openNewTab(row)}>
                          <ReadMoreComponent
                            text={`${row?.info?.first_name || ''} ${row?.info?.last_name || ''}`.trim()}
                          />
                        </span>
                      </td>
                    );
                  }

                  if (c.key === 'department_name') {
                    return (
                      <td key={`${row.id}-dept`} style={baseStyle}>
                        {row?.department_name}
                      </td>
                    );
                  }

                  const day = map.get(c.key);
                  const value = day?.value;

                  return (
                    <td key={`${row.id}-${c.key}`} style={baseStyle}>
                      {value ? (
                        <Tooltip placement="top" title={day?.note} className="cursor-pointer">
                          <span style={{ color: getColor(value) }}>
                            {value === 'S' ? (
                              <CheckSquareOutlined />
                            ) : value === 'AL' ? (
                              day?.date_leave?.[0]?.status_request === 'afternoon' ||
                              day?.date_leave?.[0]?.status_request === 'morning' ? (
                                'AL1/2'
                              ) : (
                                value
                              )
                            ) : (
                              value
                            )}
                          </span>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default memo(TableAttReport);
