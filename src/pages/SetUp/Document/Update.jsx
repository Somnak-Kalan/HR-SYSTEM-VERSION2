import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Modal, Form, Input, Button, Row, Col, Upload, message, Spin } from 'antd';
import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useDocumentStore } from '../../../stores/document.store';

const { Dragger } = Upload;

const normFile = (e) => {
  return Array.isArray(e) ? e : e?.fileList;
};

const getRowId = (item) => {
  return item?.id || item?._id || item?.document_file_id || item?.key;
};

const getDocumentObject = (res) => {
  if (!res) return null;

  if (res?.data?.data && typeof res.data.data === 'object') {
    return res.data.data;
  }

  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }

  if (res?.document && typeof res.document === 'object') {
    return res.document;
  }

  if (typeof res === 'object' && !Array.isArray(res)) {
    return res;
  }

  return null;
};

const UpdateDocument = (props) => {
  const { open, setOpen, access_token, username, propData } = props;

  const [form] = Form.useForm();

  const btn_loading = useDocumentStore((s) => s.btn_loading);
  const updateDocument = useDocumentStore((s) => s.updateDocument);
  const getDocumentById = useDocumentStore((s) => s.getDocumentById);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailReady, setDetailReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const lastObjectUrlRef = useRef(null);
  const requestRef = useRef(0);

  const clearObjectUrl = () => {
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }

    setPreviewUrl(null);
  };

  const setFormData = (data) => {
    if (!data) return;

    const id = getRowId(data);

    form.setFieldsValue({
      id,
      file_name: data?.file_name || '',
      upload: [],
    });
  };

  const onClose = useCallback(() => {
    requestRef.current += 1;
    setOpen(false);
    form.resetFields();
    clearObjectUrl();
    setDetailLoading(false);
    setDetailReady(false);
  }, [setOpen, form]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!open) return;

      const id = getRowId(propData);

      if (!id) {
        message.warning({
          content: 'Please select document first',
        });

        setOpen(false);
        return;
      }

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;

      form.resetFields();
      clearObjectUrl();

      // Show normal field first from selected row.
      setFormData({
        ...propData,
        id,
      });
      setDetailReady(true);

      try {
        setDetailLoading(true);

        const res = await getDocumentById({
          access_token,
          doc: {
            id,
          },
        });

        if (requestRef.current !== requestId) return;

        const apiData = getDocumentObject(res);

        if (apiData && Object.keys(apiData).length > 0) {
          setFormData({
            ...apiData,
            id: getRowId(apiData) || id,
          });
        }
      } catch (error) {
        if (requestRef.current !== requestId) return;

        console.log(error);
        message.warning({
          content: 'Using selected data because detail API failed',
        });
      } finally {
        if (requestRef.current === requestId) {
          setDetailLoading(false);
          setDetailReady(true);
        }
      }
    };

    fetchDetail();
  }, [open, propData]);

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      clearObjectUrl();
    };
  }, []);

  const handleUploadChange = useCallback((info) => {
    const fileObj = info?.file?.originFileObj;

    if (!fileObj) return;

    clearObjectUrl();

    const url = URL.createObjectURL(fileObj);
    lastObjectUrlRef.current = url;
    setPreviewUrl(url);
  }, []);

  const onUpdate = useCallback(async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
      const id = values.id || getRowId(propData);

      const fileList = values?.upload || [];
      const fileObj = fileList?.[0]?.originFileObj;

      const formData = new FormData();

      formData.append('file_name', values.file_name);
      formData.append('username', username || '');

      if (fileObj) {
        formData.append('file', fileObj);
      }

      const res = await updateDocument({
        id,
        formData,
        access_token,
      });

      if (!res) {
        message.warning({
          content: 'Update UnSuccess',
        });
        return;
      }

      message.success({
        content: 'Update Success',
      });

      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      console.log(error);
      message.error({
        content: 'Update failed',
      });
    }
  }, [form, updateDocument, access_token, username, onClose, propData]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closable={false}
      destroyOnHidden={false}
      maskClosable={false}
      centered
      afterOpenChange={(visible) => {
        if (!visible) {
          requestRef.current += 1;
          form.resetFields();
          clearObjectUrl();
          setDetailLoading(false);
          setDetailReady(false);
        }
      }}
      footer={
        <Button
          onClick={onUpdate}
          loading={btn_loading}
          disabled={!detailReady}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Update
        </Button>
      }>
      <Card
        title="Update Document"
        extra={
          <CloseCircleOutlined onClick={onClose} className="cursor-pointer" style={{ fontSize: 20, color: 'red' }} />
        }>
        {!detailReady ? (
          <div
            style={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Spin tip="Preparing form..." />
          </div>
        ) : (
          <Spin spinning={detailLoading} tip="Loading latest data...">
            <Form form={form} name="update_document" labelAlign="top" autoComplete="off">
              <Form.Item hidden name="id" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} className="my-2">
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    label="File Name"
                    name="file_name"
                    rules={[{ required: true, message: 'File name is required' }]}
                    labelCol={{ span: 24 }}>
                    <Input placeholder="Enter file name" />
                  </Form.Item>
                </Col>

                <Col xs={24} className="my-2">
                  <Form.Item
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    labelCol={{ span: 24 }}>
                    <Dragger
                      name="file"
                      multiple={false}
                      maxCount={1}
                      accept=".pdf,application/pdf"
                      beforeUpload={() => false}
                      onChange={handleUploadChange}
                      onRemove={() => {
                        clearObjectUrl();
                      }}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-hint">Upload PDF file only optional.</p>
                    </Dragger>
                  </Form.Item>
                </Col>
              </Row>

              {previewUrl ? <div className="text-xs text-gray-500">New file selected.</div> : null}
            </Form>
          </Spin>
        )}
      </Card>
    </Modal>
  );
};

export default UpdateDocument;
