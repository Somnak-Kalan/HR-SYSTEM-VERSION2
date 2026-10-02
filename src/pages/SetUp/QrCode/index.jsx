/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card, Breadcrumb, Row, Col, Input, Space, Button, message, Modal, Table, QRCode } from 'antd';
import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import GroupBtn from 'components/GroupBtn';
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dayjs from 'dayjs';

import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';

import StepAddQrCode from './StepAddQrCode';
import StepUpdateQrCode from './StepUpdateQRCode';
import ViewQR from './ViewQR';
import { useQRCodeStore } from '../../../stores/qrCode.store';

const getRowId = (row) => row?._id || row?.id;

const extractNumber = (value) => {
  const match = String(value || '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const downloadCanvasQRCode = (container, filename) => {
  if (!container) return false;

  const canvas = container.querySelector('canvas');
  if (!canvas) return false;

  const link = document.createElement('a');
  link.download = `${filename || 'qr-code'}.png`;
  link.href = canvas.toDataURL('image/png');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

const MainQRCodePage = () => {
  const { setContent } = useContent();
  const setContentRef = useRef(setContent);

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const [open_add, setOpenAdd] = useState(false);
  const [open_update, setOpenUpdate] = useState(false);
  const [open_qr_code, setOpenQRCode] = useState(false);

  const [modalData, setModalData] = useState(null);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const hiddenQrRef = useRef(null);
  const fetchedRef = useRef(false);
  const searchTimerRef = useRef(null);

  const loading = useQRCodeStore((s) => s.loading);
  const qr_list = useQRCodeStore((s) => s.qr_list);
  const selectedRowKeys = useQRCodeStore((s) => s.selectedRowKeys);
  const selected = useQRCodeStore((s) => s.selected);

  const fetchQRCodes = useQRCodeStore((s) => s.fetchQRCodes);
  const getQRCodeById = useQRCodeStore((s) => s.getQRCodeById);
  const removeQRCode = useQRCodeStore((s) => s.removeQRCode);
  const setSelectedRowKeys = useQRCodeStore((s) => s.setSelectedRowKeys);
  const setSelected = useQRCodeStore((s) => s.setSelected);

  const selectedId = getRowId(selected);

  useEffect(() => {
    setContentRef.current = setContent;
  }, [setContent]);

  const success = useCallback((content) => {
    message.success({ content });
  }, []);

  const warning = useCallback((content) => {
    message.warning({ content });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelected(null);
    setModalData(null);
  }, [setSelectedRowKeys, setSelected]);

  const fetchList = useCallback(
    async (searchText) => {
      if (!access_token) return false;

      return fetchQRCodes({
        access_token,
        doc: {
          search: searchText || '',
        },
        force: true,
      });
    },
    [access_token, fetchQRCodes]
  );

  const closeUpdateModal = useCallback(
    (value) => {
      setOpenUpdate(value);

      if (!value) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  const closeViewModal = useCallback(
    (value) => {
      setOpenQRCode(value);

      if (!value) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  useEffect(() => {
    if (!access_token) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchList('');
  }, [access_token, fetchList]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;

      setSearch(value);
      setCurrentPage(1);
      clearSelection();

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        fetchList(value);
      }, 350);
    },
    [clearSelection, fetchList]
  );

  // no local search here. backend already returned searched data
  const tableData = useMemo(() => {
    const base = Array.isArray(qr_list) ? [...qr_list] : [];

    base.sort((a, b) => {
      return extractNumber(a?.title) - extractNumber(b?.title);
    });

    return base;
  }, [qr_list]);

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
        title: 'Destination',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Latitude & Longitude',
        dataIndex: 'lat_lon',
        key: 'lat_lon',
        render: (_, record) => {
          const latitude = record?.latitude ?? record?.Latitude;
          const longitude = record?.longitude ?? record?.Longitude;

          return latitude && longitude ? `${latitude}, ${longitude}` : '-';
        },
      },
      {
        title: 'Round (M)',
        dataIndex: 'round',
        key: 'round',
        align: 'center',
        width: 100,
        render: (value) => value || '-',
      },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   align: 'center',
      //   width: 120,
      //   render: (_, record) => {
      //     const status = String(record?.status || '').toLowerCase()

      //     const isActive = status === 'active'
      //     const isPending = status === 'pending'

      //     let label = 'Inactive'
      //     let className =
      //       'bg-red-500 outline-none border-none rounded-sm text-white px-5'

      //     if (isActive) {
      //       label = 'Active'
      //       className =
      //         'bg-green-500 outline-none border-none rounded-sm text-white px-6'
      //     }
      //     if (isPending) {
      //       label = 'Pending'
      //       className =
      //         'bg-yellow-500 outline-none border-none rounded-sm text-white px-5'
      //     }

      //     return (
      //       <button
      //         style={{
      //           boxShadow:
      //             'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
      //         }}
      //         className={className}
      //       >
      //         <strong>{label}</strong>
      //       </button>
      //     )
      //   },
      // },
      {
        title: 'Created Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 160,
        render: (_, record) => {
          const date = record?.createdAt || record?.created_at;

          if (!date || !dayjs(date).isValid()) {
            return <span style={{ color: '#999' }}>-</span>;
          }

          return (
            <Space direction="vertical" size={0}>
              <span style={{ fontWeight: 600 }}>{dayjs(date).format('YYYY-MM-DD')}</span>
              <span style={{ fontSize: 12, color: '#888' }}>{dayjs(date).format('hh:mm A')}</span>
            </Space>
          );
        },
      },
    ],
    [renderNo]
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

  const selectRow = useCallback(
    (row) => {
      const id = getRowId(row);

      setSelectedRowKeys(id ? [id] : []);
      setSelected(row || null);
      setModalData(row || null);
    },
    [setSelectedRowKeys, setSelected]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'radio',
      selectedRowKeys,
      onChange: (_, selectedRows) => {
        const row = selectedRows?.[0];
        selectRow(row || null);
      },
    }),
    [selectedRowKeys, selectRow]
  );

  const openEditModal = useCallback(async () => {
    if (!selectedId) {
      warning('Please select QR code first');
      return;
    }

    const rec = await getQRCodeById({
      access_token,
      id: selectedId,
    });

    if (!rec) {
      warning('Cannot get QR detail');
      return;
    }

    setModalData(rec);
    setOpenUpdate(true);
  }, [selectedId, access_token, getQRCodeById, warning]);

  const openViewModal = useCallback(async () => {
    if (!selectedId) {
      warning('Please select QR code first');
      return;
    }

    const rec = await getQRCodeById({
      access_token,
      id: selectedId,
    });

    if (!rec) {
      warning('Cannot get QR detail');
      return;
    }

    setModalData(rec);
    setOpenQRCode(true);
  }, [selectedId, access_token, getQRCodeById, warning]);

  const onRemove = useCallback(() => {
    if (!selectedId) {
      warning('Please select QR code first');
      return;
    }

    Modal.confirm({
      title: 'Confirm',
      content: 'Confirm to Delete',
      okText: 'Delete',
      className: 'custom-message-modal-confirm',
      onOk: async () => {
        const ok = await removeQRCode({
          id: selectedId,
          access_token,
        });

        if (ok) {
          success('remove success');
          clearSelection();
        } else {
          warning('remove fail');
        }
      },
    });
  }, [selectedId, access_token, removeQRCode, success, warning, clearSelection]);

  const onDownloadFromList = useCallback(() => {
    if (!selectedId) {
      warning('Please select QR code first');
      return;
    }

    const ok = downloadCanvasQRCode(hiddenQrRef.current, selected?.title);

    if (ok) {
      success('download success');
      clearSelection();
    } else {
      warning('No QR image');
    }
  }, [selectedId, selected, success, warning, clearSelection]);

  useEffect(() => {
    setContentRef.current(
      <div className="flex justify-between">
        <div>
          <GroupBtn
            collapsed={collapsed}
            editBtn={!!selectedId}
            showEditBtn
            onEditBtnClick={openEditModal}
            deleteBtn={!!selectedId}
            showDeleteBtn
            onDeleteBtnClick={onRemove}
            viewBtn={!!selectedId}
            showViewBtn
            onViewBtnClick={openViewModal}
            qrCodeBtn={!!selectedId}
            showQRCode
            onQRCodeBtnClick={onDownloadFromList}
          />
        </div>

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />,
            },
            {
              title: 'qr code',
            },
          ]}
        />
      </div>
    );
  }, [collapsed, selectedId, openEditModal, openViewModal, onRemove, onDownloadFromList, navigate]);

  return (
    <div>
      <Card
        extra={
          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={() => setOpenAdd(true)}>
            <UserAddOutlined />
            Add QR Code
          </Button>
        }
        title="QR CODE">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Input
              className="mb-5"
              placeholder="Search by destination, latitude, longitude, or QR ID"
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

        <StepAddQrCode open={open_add} setOpen={setOpenAdd} access_token={access_token} />

        <StepUpdateQrCode
          open={open_update}
          setOpen={closeUpdateModal}
          access_token={access_token}
          propData={modalData}
          onUpdated={clearSelection}
        />

        <ViewQR open={open_qr_code} setOpen={closeViewModal} propData={modalData} />

        <Table
          rowKey={(row) => getRowId(row)}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={paginationConfig}
          bordered
          size="small"
          loading={loading}
          scroll={{ x: 'max-content' }}
          onRow={(record) => ({
            onClick: (event) => {
              const target = event.target;

              if (
                target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('.ant-radio') ||
                target.closest('.ant-radio-wrapper')
              ) {
                return;
              }

              const id = getRowId(record);

              if (selectedRowKeys.includes(id)) {
                clearSelection();
              } else {
                selectRow(record);
              }
            },
          })}
        />

        <div
          ref={hiddenQrRef}
          style={{
            position: 'fixed',
            left: -10000,
            top: -10000,
            width: 260,
            height: 260,
            background: '#fff',
            padding: 10,
          }}>
          {selectedId ? <QRCode type="canvas" value={selectedId} size={240} /> : null}
        </div>
      </Card>
    </div>
  );
};

export default MainQRCodePage;
