import { useContext, useEffect, useState } from 'react';
import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Row, Col, Upload, message, Typography } from 'antd';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../../../contexts/AuthContext';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';

const { Text } = Typography;
const { Dragger } = Upload;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

const UpdateFile = (props) => {
  const { open_modal_file, setOpenModalFile, documents } = props;

  const { id } = useParams();
  const { username, access_token } = useContext(AuthContext);

  const updateEmployeeFile = useEmployeeDetailStore((s) => s.updateEmployeeFile);
  const storeLoading = useEmployeeDetailStore((s) => s.loading);

  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const currentDocument = Array.isArray(documents) ? documents[0] : null;
  const currentFileType = currentDocument?.value;

  const handleCancel = () => {
    setOpenModalFile(false);
    form.resetFields();
  };

  const beforeUpload = (file) => {
    if (!file) return Upload.LIST_IGNORE;

    if (file.size > MAX_FILE_SIZE) {
      messageApi.error('File size must be less than 2MB');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const onFinish = async (values) => {
    if (!id || !currentFileType) return;

    const fileList = values?.[currentFileType] || [];

    if (!fileList.length) {
      messageApi.warning('Please select file');
      return;
    }

    setBtnLoading(true);

    try {
      const ok = await updateEmployeeFile({
        id,
        access_token,
        username,
        fileType: currentFileType,
        fileList,
      });

      if (ok) {
        messageApi.success('Update Success');
        setOpenModalFile(false);
        form.resetFields();
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      console.log('update file error:', error);
      console.log('backend response:', error?.response?.data);

      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Update Fail');
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (!open_modal_file) return;
    form.resetFields();
  }, [form, open_modal_file, documents]);

  return (
    <>
      {contextHolder}

      <Modal
        open={open_modal_file}
        onCancel={handleCancel}
        footer={null}
        width={720}
        closable={false}
        centered
        styles={{
          body: {
            padding: 16,
          },
        }}>
        <Card
          title="Update File"
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              className="cursor-pointer"
              style={{ fontSize: 20, color: 'red' }}
            />
          }
          styles={{
            body: {
              paddingTop: 16,
            },
          }}>
          <Form form={form} name="edit_file" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
              {Array.isArray(documents) &&
                documents.map((item) => {
                  const isOthers = item.value === 'others';

                  return (
                    <Col span={24} key={item.value}>
                      <Form.Item
                        name={item.value}
                        labelCol={{ span: 24 }}
                        rules={[
                          {
                            required: true,
                            message: 'Please select file',
                          },
                        ]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        style={{ width: '100%', marginBottom: 0 }}>
                        <Dragger
                          accept="image/png,image/jpeg,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          beforeUpload={beforeUpload}
                          maxCount={isOthers ? 4 : 1}
                          multiple={isOthers}
                          listType="text"
                          style={{
                            width: '100%',
                            minHeight: 220,
                            borderRadius: 14,
                            background: '#ffffff',
                            borderColor: '#d9d9d9',
                            padding: '20px 12px',
                          }}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined
                              style={{
                                color: '#1677ff',
                                fontSize: 54,
                              }}
                            />
                          </p>

                          <p
                            className="ant-upload-text"
                            style={{
                              fontSize: 20,
                              fontWeight: 500,
                              marginBottom: 8,
                            }}>
                            Click or drag file to this area to upload
                          </p>

                          <p
                            className="ant-upload-hint"
                            style={{
                              fontSize: 15,
                              color: '#8c8c8c',
                              maxWidth: 520,
                              margin: '0 auto',
                              lineHeight: 1.7,
                            }}>
                            Support {isOthers ? 'multiple files' : 'single file'}. PNG, JPG, PDF, DOC, DOCX and XML are
                            allowed.
                          </p>
                          {/* 
                          <Text
                            type="secondary"
                            style={{
                              display: 'block',
                              marginTop: 8,
                              fontSize: 13,
                            }}
                          >
                            Maximum file size: 2MB
                          </Text> */}
                        </Dragger>
                      </Form.Item>
                    </Col>
                  );
                })}

              <Col span={24}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    style={{
                      height: 42,
                      borderRadius: 8,
                      background: '#1677ff',
                    }}
                    className="cursor-pointer text-white w-full"
                    loading={btnLoading || storeLoading}
                    type="primary"
                    htmlType="submit"
                    block>
                    Update
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdateFile;
