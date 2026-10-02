import { useOutletContext, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { Card, Input, Breadcrumb, Modal, Row, Col, message, Button, Table, Avatar } from 'antd';
import { HomeOutlined, SearchOutlined, FileAddOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import GroupBtn from 'components/GroupBtn';

import AddDocument from './Add';
import UpdateDocument from './Update';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import { getFile, getFileImageWithBaseUrl } from '../../../utils/ShowImage';
import { useDocumentStore } from '../../../stores/document.store';

const getRowId = (item) => {
  return item?.id || item?._id || item?.document_file_id || item?.key;
};

const MainDocumentPage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { username, access_token } = useContext(AuthContext);

  const [open_add, setOpenAdd] = useState(false);
  const [open_update, setOpenUpdate] = useState(false);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const loading = useDocumentStore((s) => s.loading);
  const btn_loading = useDocumentStore((s) => s.btn_loading);
  const documents = useDocumentStore((s) => s.documents);
  const selectedRowKeys = useDocumentStore((s) => s.selectedRowKeys);
  const selected = useDocumentStore((s) => s.selected);

  const fetchDocuments = useDocumentStore((s) => s.fetchDocuments);
  const removeDocument = useDocumentStore((s) => s.removeDocument);
  const setSelectedRowKeys = useDocumentStore((s) => s.setSelectedRowKeys);
  const setSelected = useDocumentStore((s) => s.setSelected);

  const selectedId = getRowId(selected);

  const fetchedRef = useRef(false);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    setContentRef.current = setContent;
  }, [setContent]);

  const success = useCallback((content) => message.success({ content }), []);
  const warning = useCallback((content) => message.warning({ content }), []);

  const fetchList = ({ searchText = search } = {}) => {
    if (!access_token) return;

    return fetchDocuments({
      access_token,
      doc: {
        search: searchText,
      },
      force: true,
    });
  };

  useEffect(() => {
    if (!access_token) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchList({
      searchText: '',
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
    setSelected(null);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      fetchList({
        searchText: value,
      });
    }, 350);
  };

  const tableData = Array.isArray(documents) ? documents : [];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedData = tableData.slice(startIndex, endIndex);

  const previewDocument = useCallback(
    async (filePath) => {
      try {
        if (!filePath) {
          warning('No file found');
          return;
        }

        const Swal = (await import('sweetalert2')).default;

        const rawUrl = getFileImageWithBaseUrl(filePath);
        const fileUrl = encodeURI(rawUrl);

        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error('Cannot load PDF');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));

        Swal.fire({
          title: 'Document Preview',
          html: `
          <div style="width:100%; height:70vh;">
            <iframe
              src="${blobUrl}#toolbar=1&navpanes=0&scrollbar=1"
              style="width:100%; height:100%; border:none;"
            ></iframe>
          </div>

          <div style="margin-top:10px; text-align:right;">
            <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">
              Open PDF
            </a>
          </div>
        `,
          width: '85%',
          showCloseButton: true,
          focusConfirm: false,
          showConfirmButton: false,
          willClose: () => {
            URL.revokeObjectURL(blobUrl);
          },
        });
      } catch (error) {
        console.log(error);
        warning('Preview failed');
      }
    },
    [warning]
  );
  const renderNo = useCallback(
    (_, __, index) => {
      return (currentPage - 1) * pageSize + index + 1;
    },
    [currentPage]
  );

  const columns = useMemo(
    () => [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 50,
        align: 'center',
        render: renderNo,
      },
      {
        title: 'File',
        dataIndex: 'file_url',
        key: 'file_url',
        width: 120,
        align: 'center',
        render: (_, record) => (
          <div
            onClick={() => previewDocument(record?.file_path || record?.file_url)}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
            <Avatar shape="square" icon={<FilePdfOutlined />} size={40} />
          </div>
        ),
      },
      {
        title: 'File Name',
        dataIndex: 'file_name',
        key: 'file_name',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 110,
        render: (_, record) =>
          record?.createdAt && dayjs(record.createdAt).isValid()
            ? dayjs(record.createdAt).format('YYYY-MM-DD')
            : record?.created_at && dayjs(record.created_at).isValid()
              ? dayjs(record.created_at).format('YYYY-MM-DD')
              : '',
      },
    ],
    [renderNo, previewDocument]
  );

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      onChange: (page) => setCurrentPage(page),
      total: tableData.length,
      showSizeChanger: false,
    }),
    [currentPage, tableData.length]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'radio',
      selectedRowKeys,
      onChange: (_, rows) => {
        const row = rows?.[0];

        if (!row) {
          setSelectedRowKeys([]);
          setSelected(null);
          return;
        }

        const id = getRowId(row);

        if (!id) {
          warning('This row has no id');
          setSelectedRowKeys([]);
          setSelected(null);
          return;
        }

        setSelectedRowKeys([id]);
        setSelected({
          ...row,
          id,
        });
      },
    }),
    [selectedRowKeys, setSelectedRowKeys, setSelected, warning]
  );

  const onDelete = useCallback(() => {
    if (!selectedId) {
      warning('Please select document first');
      return;
    }

    Modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: async () => {
        const res = await removeDocument({
          id: selectedId,
          access_token,
        });

        res ? success('Remove successful') : warning('Remove unsuccess');
      },
    });
  }, [selectedId, removeDocument, access_token, success, warning]);

  useEffect(() => {
    setContentRef.current(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            editBtn={!!selectedId}
            showEditBtn
            onEditBtnClick={() => setOpenUpdate(true)}
            deleteBtn={!!selectedId}
            showDeleteBtn
            onDeleteBtnClick={onDelete}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />,
            },
            {
              title: 'Document',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, onDelete, navigate]);

  return (
    <div>
      <Card
        title="DOCUMENT"
        extra={
          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={() => setOpenAdd(true)}>
            <FileAddOutlined />
            Add Document
          </Button>
        }>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
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
              placeholder="Search by file name"
              value={search}
              onChange={handleSearchChange}
              allowClear
            />
          </Col>
        </Row>

        <AddDocument open={open_add} setOpen={setOpenAdd} access_token={access_token} username={username} />

        <UpdateDocument
          open={open_update}
          setOpen={setOpenUpdate}
          access_token={access_token}
          username={username}
          propData={selected}
        />

        <Table
          rowKey={(row) => getRowId(row)}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={pagedData}
          pagination={paginationConfig}
          bordered
          size="small"
          loading={loading || btn_loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default MainDocumentPage;
