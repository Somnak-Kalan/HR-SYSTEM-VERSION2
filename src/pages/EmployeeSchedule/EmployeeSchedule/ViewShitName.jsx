import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Col, Input, Modal, Row, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import ReadMoreComponent from '../../../components/ReadMore';

const { Text } = Typography;

const getEmployeeRows = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  const arrays = [payload?.data?.data, payload?.data, payload?.employees, payload?.employee, payload?.employee_list];

  const found = arrays.find((item) => Array.isArray(item) && item.length > 0);

  if (found) return found;

  if (typeof payload === 'object') {
    const numericRows = Object.keys(payload)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => payload[key])
      .filter(Boolean);

    if (numericRows.length > 0) return numericRows;
  }

  return [];
};

const ViewShiftName = (props) => {
  const { open, setOpen, propData } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');

  const list_employee = useMemo(() => {
    return getEmployeeRows(propData);
  }, [propData]);

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setSearch('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = String(search || '')
      .trim()
      .toLowerCase();

    if (!q) return list_employee;

    return list_employee.filter((item) => {
      const employeeId = String(item?.employee_id || '').toLowerCase();
      const name = String(item?.name || '').toLowerCase();
      const nameLatin = String(item?.name_latin || '').toLowerCase();
      const company = String(item?.company || '').toLowerCase();
      const department = String(item?.department || '').toLowerCase();
      const position = String(item?.position || '').toLowerCase();

      return (
        employeeId.includes(q) ||
        name.includes(q) ||
        nameLatin.includes(q) ||
        company.includes(q) ||
        department.includes(q) ||
        position.includes(q)
      );
    });
  }, [list_employee, search]);

  const total_employee =
    list_employee.length || propData?.employee || propData?.employee_count || propData?.total_employee || 0;

  const shiftName = propData?.shift_name || propData?.shift_management?.shift_name || propData?.label || '-';

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      onChange: (page) => setCurrentPage(page),
      total: filtered.length,
      showSizeChanger: false,
    }),
    [currentPage, pageSize, filtered.length]
  );

  const columns = useMemo(
    () => [
      {
        title: 'No',
        key: 'no',
        width: 60,
        align: 'center',
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: 'ID',
        dataIndex: 'employee_id',
        key: 'employee_id',
        width: 120,
        align: 'center',
        render: (value) => <Text strong>{value || '-'}</Text>,
      },
      {
        title: 'Name',
        key: 'name',
        align: 'left',
        render: (_, record) => (
          <div>
            <ReadMoreComponent text={record?.name || '-'} />

            {record?.name_latin ? (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.name_latin}
                </Text>
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        align: 'left',
        render: (value) => value || '-',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        align: 'center',
        width: 140,
        render: (value) => value || '-',
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        align: 'center',
        width: 140,
        render: (value) => value || '-',
      },
    ],
    [currentPage, pageSize]
  );

  const close = () => {
    setOpen(false);
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      width="65vw"
      footer={null}
      closable={false}
      centered
      styles={{
        body: {
          padding: 16,
        },
      }}>
      <Card
        title={
          <div style={{ fontWeight: 'normal' }}>
            <Row gutter={[8, 6]}>
              <Col sm={7}>Shift Name</Col>
              <Col sm={1}>:</Col>
              <Col sm={16} style={{ color: 'blue' }}>
                {shiftName}
              </Col>

              <Col sm={7}>Total Employee</Col>
              <Col sm={1}>:</Col>
              <Col sm={8} style={{ color: 'blue' }}>
                {total_employee}
              </Col>
            </Row>
          </div>
        }
        extra={
          <CloseCircleOutlined onClick={close} className="cursor-pointer" style={{ fontSize: 20, color: 'red' }} />
        }>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={14} lg={12} xl={10} className="mb-5">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                background: '#fff',
                height: 38,
                padding: '0 10px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}>
              <SearchOutlined
                style={{
                  fontSize: 17,
                  color: '#1677ff',
                  marginRight: 8,
                }}
              />

              <Input
                variant="borderless"
                allowClear
                value={search}
                placeholder="Search by employee ID, name, department, position"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  paddingLeft: 0,
                }}
              />
            </div>
          </Col>
        </Row>

        <Table
          rowKey={(row) => row?._id || row?.id || row?.employee_id}
          dataSource={filtered}
          pagination={paginationConfig}
          columns={columns}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          className="nowrap-table"
        />
      </Card>
    </Modal>
  );
};

export default ViewShiftName;
