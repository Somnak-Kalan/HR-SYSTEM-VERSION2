//main point
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState, useMemo } from 'react';
/*---------------ant design----------------*/
import { Card, Input, Breadcrumb, Modal, Row, Col, message, Form, Button, Table, Pagination } from 'antd';
import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
/*---------------end ant-design------------*/
//-------------***-----------------
/*--------------components-------------*/
import GroupBtn from 'components/GroupBtn';
/*--------------end components-------------*/
/*------------dayjs format date-------------*/
/*------------end dayjs format date-------------*/
import dayjs from 'dayjs';
/*-----------------company part----------------*/
import AddCompany from './AddCompany';
import UpdateCompany from './UpdateCompany';
import { AuthContext } from '../../../contexts/AuthContext';
/*----------------end company part--------------*/
//
import ReadMoreComponent from '../../../components/ReadMore';
//
import { useContent } from '../../../contexts/ContentContext';

//  zustand
import { useCompanyStore } from '../../../stores/comapny.store';

//
//------------main part------------
const MainCompanyPage = () => {
  const { setContent } = useContent();

  //-------------***-----------------
  //collapsed and navigation
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  /*------------------------Loading------------------------*/
  const [btn_loading, setBtnLoading] = useState(false);
  /*------------------------End Loading---------------------*/
  const { username, access_token } = useContext(AuthContext);

  //  zustand state
  const company = useCompanyStore((state) => state.company);
  const loading = useCompanyStore((state) => state.loading);
  const Get_Company_Store = useCompanyStore((state) => state.Get_Company);
  const Remove_Company_Store = useCompanyStore((state) => state.Remove_Company);

  //**--------------open_update and setOpenUpdate modal and props data-------------**//
  const [open_update, setOpenUpdate] = useState(false);
  const [propData, setPropData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form_update] = Form.useForm();
  const [form_add] = Form.useForm();
  const [open_add, setOpenAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const fetchedRef = useRef(false);

  const companyData = useMemo(() => {
    return (company || []).map((item) => ({
      ...item,
      id: item?.id || item?._id,
    }));
  }, [company]);
  useEffect(() => {
    if (!selectedRowKeys.length) return;

    const selectedId = selectedRowKeys[0];

    const latestSelectedRow = companyData.find((row) => row.id === selectedId);

    if (latestSelectedRow) {
      setPropData(latestSelectedRow);
    } else {
      setPropData();
      setSelectedRowKeys([]);
    }
  }, [companyData, selectedRowKeys]);
  //=====================Confirm success==================
  const success = ({ content }) => {
    messageApi.success({ content });
  };

  const warning = ({ content }) => {
    messageApi.warning({ content });
  };

  //confirm when delete
  const Show_Confirmation = () => {
    modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm ',
      onOk() {
        Remove_Company();
      },
      onCancel() {
        return false;
      },
    });
  };

  //=====================end confirm success==============
  /*------------------Main function ---------------------*/
  //[Get_Company] list company
  useEffect(() => {
    if (!access_token) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    Get_Company_Store({ access_token }).catch(() => { });
  }, [Get_Company_Store, access_token]);

  //end [Get_Company] list company

  //*---------- edit part---------------*//
  const emitDataRowSelection = (emitData) => {
    setPropData(emitData);
  };

  /*----------------[onDelete] Delete Company----------------*/
  const Remove_Company = () => {
    setOpenUpdate(false);

    const id = propData?.id || propData?._id;
    if (!id) return;

    const doc = {
      id: id,
      user: username,
    };

    Remove_Company_Store({ doc, access_token }).then((res) => {
      if (res) {
        success({ content: 'Remove Success' });
        setPropData();
        setSelectedRowKeys([]);
      } else {
        warning({ content: 'Cannot remove record' });
      }
    });
  };
  /*----------------end [onDelete] Delete Company----------------*/

  const getRowSelection = () => ({
    type: 'radio',
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      const selectedRow = selectedRows?.[0];

      if (!selectedRow) {
        setSelectedRowKeys([]);
        setPropData();
        return;
      }

      const selectedId = newSelectedRowKeys?.[0] || selectedRow?.id || selectedRow?._id;

      setSelectedRowKeys([selectedId]);

      setPropData({
        ...selectedRow,
        id: selectedId,
      });
    },
  });

  // search company
  const handleSearch = () => {
    if (!search) return companyData;

    const search_text = search.toLowerCase().replace(/\s+/g, '');

    const filteredData = companyData.filter((item) => {
      const companyName = item?.company_name ? item.company_name.toLowerCase().replace(/\s+/g, '') : '';
      return companyName.includes(search_text);
    });
    return filteredData;
  };

  // card pagination uses same currentPage/pageSize
  const filtered = handleSearch() || [];
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedData = filtered.slice(startIndex, endIndex);

  // select by card click (keep selection concept)
  const onSelectCard = (item) => {
    const id = item?.id || item?._id;
    setSelectedRowKeys([id]);
    setPropData({
      ...item,
      id,
    });
  };

  const renderNo = (_, __, index) => {
    const calculatedIndex = (currentPage - 1) * pageSize + index + 1;
    return calculatedIndex;
  };

  // Pagination config (table)
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    onChange: (page) => setCurrentPage(page),
    total: filtered.length,
    showSizeChanger: false,
  };

  //table column and data of company
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'No',
      width: 50,
      align: 'center',
      render: renderNo,
    },
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Description',
      dataIndex: 'company_description',
      key: 'company_description',
      render: (_, { company_description }) => <ReadMoreComponent text={company_description} />,
    },
    {
      title: 'Establish',
      dataIndex: 'company_established',
      key: 'company_established',
      render: (_, { company_established }) =>
        company_established ? dayjs(company_established).format('YYYY-MM-DD') : '',
    },
  ];

  useEffect(() => {
    setContent(
      <>
        {/*  Tailwind responsive header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <GroupBtn
              collapsed={collapsed}
              editBtn={propData !== undefined ? true : false}
              showEditBtn
              onEditBtnClick={() => setOpenUpdate(true)}
              deleteBtn={propData !== undefined ? true : false}
              showDeleteBtn
              onDeleteBtnClick={() => Show_Confirmation()}
            />
          </div>

          <Breadcrumb items={[{ title: <HomeOutlined style={{ cursor: 'pointer' }} /> }, { title: 'company' }]} />
        </div>
      </>
    );
  }, [setContent, propData, collapsed]);

  return (
    <div>
      {contextHolder}
      {modalContextHolder}

      <Card
        extra={
          //  hide extra button on very small screen (Tailwind)
          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white max-[480px]:hidden"
            onClick={() => setOpenAdd(true)}>
            <UserAddOutlined />
            Add Company
          </Button>
        }
        title="COMPANY">
        {/*  show full width add button on very small screen */}
        <div className="hidden max-[480px]:block mb-3">
          <Button
            block
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={() => setOpenAdd(true)}>
            <UserAddOutlined />
            Add Company
          </Button>
        </div>

        {/* search */}
        <div>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              <Input
                className="mb-5"
                style={{ paddingTop: '5px', paddingBottom: '5px' }}
                prefix={<SearchOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
                placeholder="search by company name"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                allowClear
              />
            </Col>
          </Row>
        </div>

        {/* add company */}
        <AddCompany
          username={username}
          btn_loading={btn_loading}
          setBtnLoading={setBtnLoading}
          form={form_add}
          open_add={open_add}
          setOpenAdd={setOpenAdd}
        />

        {/* Edit modal form */}
        <UpdateCompany
          propData={propData}
          username={username}
          btn_loading={btn_loading}
          form={form_update}
          setBtnLoading={setBtnLoading}
          open_update={open_update}
          setOpenUpdate={setOpenUpdate}
        />

        {/*  CARD VIEW (<= 480px) */}
        <div className="hidden max-[600px]:block">
          <div className="grid gap-3">
            {pagedData?.map((item) => {
              const selected = selectedRowKeys.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectCard(item)}
                  className={[
                    'rounded-xl border p-3 cursor-pointer transition',
                    selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300',
                  ].join(' ')}>
                  <div className="flex gap-3">
                    {/* radio indicator */}
                    <div
                      className={[
                        'mt-1 h-4 w-4 rounded-full border',
                        selected ? 'border-blue-500 bg-blue-500' : 'border-slate-400',
                      ].join(' ')}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold break-words">{item?.company_name || '-'}</div>

                      <div className="mt-1 text-xs text-slate-500">
                        Establish:{' '}
                        {item?.company_established ? dayjs(item.company_established).format('YYYY-MM-DD') : '-'}
                      </div>

                      <div className="mt-2">
                        <ReadMoreComponent text={item?.company_description || ''} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* pagination for card view */}
          {filtered.length > pageSize ? (
            <div className="mt-3 flex justify-end max-[320px]:justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filtered.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                size="small"
                simple
              />
            </div>
          ) : null}
        </div>

        {/*  TABLE VIEW (> 480px) */}
        <div className="block max-[600px]:hidden">
          <Table
            rowKey={(row) => row.id}
            rowSelection={getRowSelection()}
            columns={columns}
            dataSource={filtered}
            pagination={paginationConfig}
            bordered
            size="small"
            loading={loading}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>

    </div>
  );
};

export default MainCompanyPage;
