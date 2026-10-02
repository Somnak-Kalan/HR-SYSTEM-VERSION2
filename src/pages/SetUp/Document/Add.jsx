import React, { useCallback, useEffect } from 'react';
import { Card, Modal, Form, Input, Button, Row, Col, Upload, message } from 'antd';
import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useDocumentStore } from '../../../stores/document.store';

const { Dragger } = Upload;

const normFile = (e) => {
  return Array.isArray(e) ? e : e?.fileList;
};

const AddDocument = (props) => {
  const { open, setOpen, access_token, username } = props;

  const [form] = Form.useForm();

  const btn_loading = useDocumentStore((s) => s.btn_loading);
  const createDocument = useDocumentStore((s) => s.createDocument);

  const onClose = useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [setOpen, form]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const onSave = useCallback(async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
      const uploadItem = values?.upload?.[0];

      const fileObj = uploadItem?.originFileObj || uploadItem?.file || uploadItem;

      if (!fileObj || !(fileObj instanceof File)) {
        message.warning({
          content: 'Please upload a real PDF file',
        });
        return;
      }

      const formData = new FormData();

      formData.append('file_name', values.file_name);
      formData.append('file', fileObj, fileObj.name);
      formData.append('username', username || '');

      // Debug FormData correctly
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await createDocument({
        formData,
        access_token,
      });

      if (!res) {
        message.warning({
          content: 'Add fail',
        });
        return;
      }

      message.success({
        content: 'Add Success',
      });

      onClose();
    } catch (error) {
      if (error?.errorFields) return;

      console.log(error);
      message.error({
        content: 'Add failed',
      });
    }
  }, [form, createDocument, access_token, username, onClose]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closable={false}
      destroyOnHidden
      footer={
        <Button
          onClick={onSave}
          loading={btn_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Save
        </Button>
      }>
      <Card
        title="Add Document"
        extra={
          <CloseCircleOutlined onClick={onClose} className="cursor-pointer" style={{ fontSize: 20, color: 'red' }} />
        }>
        <Form form={form} name="add_document" labelAlign="top" autoComplete="off">
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
                rules={[{ required: true, message: 'Please upload a PDF file' }]}
                labelCol={{ span: 24 }}>
                <Dragger
                  name="file"
                  multiple={false}
                  maxCount={1}
                  accept=".pdf,application/pdf"
                  beforeUpload={(file) => {
                    const isPdf = file.type === 'application/pdf';

                    if (!isPdf) {
                      message.warning({
                        content: 'Only PDF file is allowed',
                      });
                    }

                    return false;
                  }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-hint">Upload PDF file only.</p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default AddDocument;
