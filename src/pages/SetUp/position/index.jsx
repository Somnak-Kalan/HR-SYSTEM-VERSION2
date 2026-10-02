import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Input, Breadcrumb, Row, Col, Space, message, Form, Button, Table, Modal, Pagination } from 'antd';
import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import GroupBtn from 'components/GroupBtn';
import AddPosition from './AddPosition';
import UpdatePosition from './UpdatePosition';
import ReadMoreComponent from '../../../components/ReadMore';
import { useContent } from '../../../contexts/ContentContext';
import { AuthContext } from '../../../contexts/AuthContext';

import CompanyOptionService from '../../../services/options/company';
import DepartmentOptionService from '../../../services/options/department';

import { usePositionStore } from '../../../stores/position.store';

const getRowId = (item) => {
  return item?.id || item?._id || item?.position_id || item?.key;
};

const getCompanyRows = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.docs)) return res.docs;

  return [];
};

const formatCompanyOptions = (res) => {
  return getCompanyRows(res)
    .map((item) => ({
      value: item?.id || item?._id || item?.company_id,
      label: item?.company_name || item?.label || item?.name,
    }))
    .filter((item) => item.value && item.label);
};

const getDepartmentRows = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.docs)) return res.docs;

  return [];
};

const formatDepartmentOptions = (res) => {
  return getDepartmentRows(res)
    .map((item) => ({
      value: item?.id || item?._id || item?.department_id,
      label: item?.department_name || item?.label || item?.name,
    }))
    .filter((item) => item.value && item.label);
};

const MainPositionPage = () => {
  const { setContent } = useContent();
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { username, access_token } = useContext(AuthContext);

  const [open_update, setOpenUpdate] = useState(false);
  const [open_add, setOpenAdd] = useState(false);
  const [propData, setPropData] = useState(null);

  const [form_update] = Form.useForm();
  const [form_add] = Form.useForm();

  const [company_list, setCompanyList] = useState([]);
  const [department_list, setDepartmentList] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const positions = usePositionStore((s) => s.positions);
  const loading = usePositionStore((s) => s.loading);
  const positionTotal = usePositionStore((s) => s.positionTotal);
  const Get_Position_Store = usePositionStore((s) => s.Get_Position);
  const Remove_Position_Store = usePositionStore((s) => s.Remove_Position);

  const didFetchRef = useRef(false);
  const searchTimerRef = useRef(null);

  const success = (content) => messageApi.success({ content });
  const warning = (content) => messageApi.warning({ content });

  const fetchPositionList = ({ searchText = search, page = currentPage } = {}) => {
    if (!access_token) return;

    return Get_Position_Store({
      access_token,
      doc: {
        search: searchText,
        page,
        size: pageSize,
      },
      force: true,
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (!access_token) return;
    if (didFetchRef.current) return;

    didFetchRef.current = true;

    fetchPositionList({
      searchText: '',
      page: 1,
    });
  }, [access_token]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);
    setCurrentPage(1);
    setSelectedRowKeys([]);
    setPropData(null);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      fetchPositionList({
        searchText: value,
        page: 1,
      });
    }, 350);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedRowKeys([]);
    setPropData(null);

    fetchPositionList({
      searchText: search,
      page,
    });
  };

  const Get_Company = async (searchText = '') => {
    try {
      setCompanyLoading(true);

      const res = await CompanyOptionService.Get_Company_Option({
        access_token,
        doc: {
          search: searchText,
        },
      });

      setCompanyList(formatCompanyOptions(res));
    } catch (error) {
      console.log(error);
      setCompanyList([]);
    } finally {
      setCompanyLoading(false);
    }
  };

  const Get_Department_By_Company = async (companyId) => {
    if (!companyId) {
      setDepartmentList([]);
      return;
    }

    try {
      setDepartmentLoading(true);

      const doc = {
        id: companyId,
      };

      const res = await DepartmentOptionService.Get_Department_By_Id({
        doc,
        access_token,
      });

      setDepartmentList(formatDepartmentOptions(res));
    } catch (error) {
      console.log(error);
      setDepartmentList([]);
    } finally {
      setDepartmentLoading(false);
    }
  };

  const removePosition = async () => {
    const id = getRowId(propData);

    if (!id) {
      warning('Please select position first');
      return;
    }

    const doc = {
      id,
      user: username,
    };

    const res = await Remove_Position_Store({
      doc,
      access_token,
    });

    if (res) {
      success('Remove Success');
      setSelectedRowKeys([]);
      setPropData(null);
    }
  };

  const showConfirmation = () => {
    modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: removePosition,
    });
  };

  const rowSelection = useMemo(() => {
    return {
      type: 'radio',
      selectedRowKeys,
      onChange: (_, selectedRows) => {
        const selectedRow = selectedRows?.[0];

        if (!selectedRow) {
          setSelectedRowKeys([]);
          setPropData(null);
          return;
        }

        const selectedId = getRowId(selectedRow);

        if (!selectedId) {
          warning('This row has no id');
          setSelectedRowKeys([]);
          setPropData(null);
          return;
        }

        setSelectedRowKeys([selectedId]);
        setPropData({
          ...selectedRow,
          id: selectedId,
        });
      },
    };
  }, [selectedRowKeys]);

  const tableData = positions || [];
  const total = positionTotal || tableData.length;

  const renderNo = (_, __, index) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const paginationConfig = {
    current: currentPage,
    pageSize,
    onChange: handlePageChange,
    total,
    showSizeChanger: false,
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      width: 50,
      align: 'center',
      render: renderNo,
    },
    {
      title: 'Position',
      dataIndex: 'position_name',
      key: 'position_name',
      width: 250,
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department_name',
      width: 250,
    },
    {
      title: 'Description',
      dataIndex: 'position_description',
      key: 'position_description',
      render: (_, { position_description }) => <ReadMoreComponent text={position_description} />,
    },
    {
      title: 'Date Create',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, record) => (
        <Space>
          {record?.createdAt && dayjs(record.createdAt).isValid()
            ? dayjs(record.createdAt).format('YYYY-MM-DD')
            : record?.createdAt && dayjs(record.createdAt).isValid()
              ? dayjs(record.createdAt).format('YYYY-MM-DD')
              : ''}
        </Space>
      ),
    },
  ];

  const selectCard = (item) => {
    const selectedId = getRowId(item);

    if (!selectedId) {
      warning('This card has no id');
      return;
    }

    setSelectedRowKeys([selectedId]);
    setPropData({
      ...item,
      id: selectedId,
    });
  };

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            editBtn={!!propData}
            showEditBtn
            onEditBtnClick={() => setOpenUpdate(true)}
            deleteBtn={!!propData}
            showDeleteBtn
            onDeleteBtnClick={showConfirmation}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },
            {
              title: 'position',
            },
          ]}
        />
      </div>
    );
  }, [setContent, propData, collapsed, navigate]);

  return (
    <div>
      {contextHolder}
      {modalContextHolder}

      <Card
        extra={
          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={() => setOpenAdd(true)}>
            <UserAddOutlined /> Add Position
          </Button>
        }
        title="POSITION">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="search by position or department"
              value={search}
              onChange={handleSearchChange}
              style={{
                paddingTop: 5,
                paddingBottom: 5,
              }}
              prefix={
                <SearchOutlined
                  style={{
                    fontSize: 16,
                    color: '#1890ff',
                  }}
                />
              }
              allowClear
            />
          </Col>
        </Row>

        <AddPosition
          username={username}
          form={form_add}
          open_add={open_add}
          setOpenAdd={setOpenAdd}
          Get_Company={Get_Company}
          company_list={company_list}
          department_list={department_list}
          Emit_Company_Id={Get_Department_By_Company}
          companyLoading={companyLoading}
          departmentLoading={departmentLoading}
        />

        <UpdatePosition
          propData={propData}
          username={username}
          form={form_update}
          open_update={open_update}
          setOpenUpdate={setOpenUpdate}
          Get_Company={Get_Company}
          company_list={company_list}
          department_list={department_list}
          Emit_Company_Id={Get_Department_By_Company}
          companyLoading={companyLoading}
          departmentLoading={departmentLoading}
        />

        <div className="hidden max-[480px]:block">
          <div className="grid gap-3">
            {tableData.map((item) => {
              const rowId = getRowId(item);
              const selected = selectedRowKeys.includes(rowId);

              return (
                <div
                  key={rowId}
                  onClick={() => selectCard(item)}
                  className={[
                    'rounded-xl border p-3 cursor-pointer transition',
                    selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300',
                  ].join(' ')}>
                  <div className="flex items-start gap-3">
                    <div
                      className={[
                        'mt-1 h-4 w-4 rounded-full border',
                        selected ? 'border-blue-500 bg-blue-500' : 'border-slate-400',
                      ].join(' ')}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold break-words">{item?.position_name || '-'}</div>

                      <div className="text-sm mt-1 break-words">
                        <span className="font-medium">Department:</span> {item?.department_name || '-'}
                      </div>

                      <div className="mt-2">
                        <ReadMoreComponent text={item?.position_description || ''} />
                      </div>

                      <div className="text-xs mt-2">
                        {item?.created_at && dayjs(item.created_at).isValid()
                          ? dayjs(item.created_at).format('YYYY-MM-DD')
                          : item?.date_create && dayjs(item.date_create).isValid()
                            ? dayjs(item.date_create).format('YYYY-MM-DD')
                            : ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {total > pageSize ? (
            <div className="mt-3 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
                size="small"
                simple
              />
            </div>
          ) : null}
        </div>

        <div className="block max-[480px]:hidden">
          <Table
            rowKey={(row) => getRowId(row)}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            pagination={paginationConfig}
            bordered
            loading={loading}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default MainPositionPage;
