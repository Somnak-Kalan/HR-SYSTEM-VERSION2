import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../../../contexts/AuthContext';

import {
  CloseCircleOutlined,
  InboxOutlined,
  CameraFilled,
} from '@ant-design/icons';

import {
  Button,
  Card,
  Form,
  Modal,
  Upload,
  Image,
  Avatar,
  Badge,
} from 'antd';

import { getFile } from '../../../../../utils/helpFuntions';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';

const { Dragger } = Upload;

const normFile = (e) => {
  if (Array.isArray(e)) return e;

  return e?.fileList ?? [];
};

const UpdateProfileImage = ({
  profile_photo,
  firstName,
  lastName,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [form] = Form.useForm();

  const { id } = useParams();

  const { username, access_token } = useContext(AuthContext);

  const updateProfileImage = useEmployeeDetailStore(
    (s) => s.updateProfileImage
  );

  const loading = useEmployeeDetailStore(
    (s) => s.loading
  );

  // ========================================
  // PROFILE IMAGE URL
  // ========================================

  const imageUrl = useMemo(() => {
    if (
      !profile_photo ||
      profile_photo === 'null' ||
      profile_photo === 'undefined'
    ) {
      return null;
    }

    return getFile(profile_photo);
  }, [profile_photo]);

  // ========================================
  // GENERATE INITIALS
  // Somnak Kalan => SK
  // John Doe => JD
  // ========================================

  const initials = useMemo(() => {
    const first = String(firstName || '')
      .trim()
      .charAt(0);

    const last = String(lastName || '')
      .trim()
      .charAt(0);

    const result = `${first}${last}`.toUpperCase();

    return result || 'NA';
  }, [firstName, lastName]);

  // ========================================
  // OPEN MODAL
  // ========================================

  const onModal = () => {
    setModalVisible(true);

    setExistingImage(
      profile_photo || null
    );

    setImagePreview(null);
  };

  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleCancel = () => {
    setModalVisible(false);

    form.resetFields();

    setImagePreview(null);

    setExistingImage(null);
  };

  // ========================================
  // RESET FORM
  // ========================================

  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue({
        images: [],
      });
    }
  }, [modalVisible, form]);

  // ========================================
  // PREVIEW NEW IMAGE
  // ========================================

  const beforeUpload = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    return false;
  };

  // ========================================
  // UPDATE IMAGE
  // ========================================

  const onFinish = async () => {
    try {
      await form.validateFields();

      const fileList =
        form.getFieldValue('images') ?? [];

      const imagesFile =
        fileList?.[0]?.originFileObj;

      if (!imagesFile) return;

      const ok = await updateProfileImage({
        id,
        imagesFile,
        username,
        access_token,
      });

      if (ok) {
        setModalVisible(false);

        form.resetFields();

        setImagePreview(null);

        setExistingImage(null);
      }
    } catch (error) {
      console.log(
        'Update profile image error:',
        error
      );
    }
  };

  // ========================================
  // EXISTING IMAGE FOR MODAL
  // ========================================

  let existingImageUrl = null;

  if (
    existingImage &&
    existingImage !== 'null' &&
    existingImage !== 'undefined'
  ) {
    existingImageUrl = getFile(existingImage);
  }

  const previewSrc =
    imagePreview ||
    existingImageUrl ||
    null;

  return (
    <>
      {/* =====================================
          PROFILE CIRCLE
      ====================================== */}

      <div
        onClick={onModal}
        style={{
          display: 'inline-flex',
          cursor: 'pointer',
        }}
      >
        <Badge
          count={
            <div
              style={{
                width: 22,
                height: 22,

                borderRadius: '50%',
                marginRight: '10px',

                background: '#d9d9d9',

                // border: '3px solid #ffffff',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxSizing: 'border-box',
              }}
            >
              <CameraFilled
                style={{
                  color: '#ffffff',
                  fontSize: 10,
                }}
              />
            </div>
          }

          // camera at bottom-right like your UI
          offset={[-3, 62]}
        >
          <Avatar
            size={70}

            src={imageUrl || undefined}

            style={{
              backgroundColor: imageUrl
                ? undefined
                : '#dbeafe',

              color: '#0958d9',

              fontSize: 20,

              fontWeight: 600,

              userSelect: 'none',
            }}
          >
            {!imageUrl && initials}
          </Avatar>
        </Badge>
      </div>

      {/* =====================================
          UPDATE MODAL
      ====================================== */}

      <Modal
        open={modalVisible}
        onCancel={handleCancel}
        closable={false}
        width={500}
        footer={
          <Button
            onClick={onFinish}
            loading={loading}
            type="primary"
            style={{
              background: '#1677ff',
            }}
          >
            Update
          </Button>
        }
      >
        <Card
          title="Change Profile Image"
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              style={{
                fontSize: 20,
                color: 'red',
                cursor: 'pointer',
              }}
            />
          }
        >
          <Form
            form={form}
            name="profile_photo"
            initialValues={{
              images: [],
            }}
          >
            <Form.Item
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: 'Please upload image',
                },
              ]}
            >
              <Dragger
                maxCount={1}
                multiple={false}
                accept="image/png,image/jpeg,image/jpg"
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                {previewSrc ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      width={150}
                      height={150}
                      src={previewSrc}
                      preview={false}
                      style={{
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>

                    <p className="ant-upload-text">
                      Click or drag image file to upload
                    </p>
                  </>
                )}
              </Dragger>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdateProfileImage;