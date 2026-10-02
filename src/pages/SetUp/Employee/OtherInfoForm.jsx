import { useContext } from 'react';
import { Button, Col, Divider, Form, Input, Row, Select, Space, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import { useEmployeeStore } from '../../../stores/employee.store';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const documents = [
  {
    value: 'id_card_or_passport',
    label: 'Identity Card/Passport',
    formDataKey: 'id_card',
    multiple: false,
    maxCount: 1,
  },
  {
    value: 'cv',
    label: 'CV',
    formDataKey: 'cv',
    multiple: false,
    maxCount: 1,
  },
  {
    value: 'driver_license',
    label: 'Driver License',
    formDataKey: 'driver_license',
    multiple: false,
    maxCount: 1,
  },
  {
    value: 'others',
    label: 'Others',
    formDataKey: 'others',
    multiple: true,
    maxCount: 4,
  },
];

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

const getUploadFile = (uploadFile) => {
  if (!uploadFile) return null;
  return uploadFile.originFileObj || uploadFile;
};

const appendSingleFile = (formData, key, fileList) => {
  const file = getUploadFile(fileList?.[0]);
  if (file) formData.append(key, file);
};

const appendMultipleFiles = (formData, key, fileList) => {
  if (!Array.isArray(fileList)) return;

  fileList.forEach((item) => {
    const file = getUploadFile(item);
    if (file) formData.append(key, file);
  });
};

const OtherInfoForm = (props) => {
  const { form, setCurrent, setOpen, personalInfoDoc, companyInfoDoc, Get_Employee } = props;

  const { access_token } = useContext(AuthContext);

  const [messageApi, contextHolder] = message.useMessage();

  const createEmployee = useEmployeeStore((s) => s.createEmployee);
  const createLoading = useEmployeeStore((s) => s.create_loading);

  const beforeUploadFile = (file) => {
    if (!file) return Upload.LIST_IGNORE;

    if (file.size > MAX_FILE_SIZE) {
      messageApi.error('File size must be less than 2MB');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const onFinish = async (values) => {
    if (!personalInfoDoc) {
      messageApi.warning('Please complete personal information first');
      setCurrent(0);
      return;
    }

    if (!companyInfoDoc) {
      messageApi.warning('Please complete company information first');
      setCurrent(1);
      return;
    }

    const { bank_name, acc_name, acc_no, open_payroll, id_card_or_passport, cv, driver_license, others } = values;

    const { images, ...cleanPersonalDoc } = personalInfoDoc;

    const doc = {
      ...cleanPersonalDoc,
      ...companyInfoDoc,
      other_info: {
        bank_name: bank_name || '',
        acc_name: acc_name || '',
        acc_no: acc_no || '',
        open_payroll: open_payroll || 'flexible',
      },
    };

    const formData = new FormData();
    formData.append('doc', JSON.stringify(doc));

    if (images) {
      formData.append('images', images);
    }

    appendSingleFile(formData, 'id_card', id_card_or_passport);
    appendSingleFile(formData, 'cv', cv);
    appendSingleFile(formData, 'driver_license', driver_license);
    appendMultipleFiles(formData, 'others', others);

    const ok = await createEmployee({
      access_token,
      doc: formData,
    });
    if (ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Employee & User Created',
        text: 'Employee & User has been created successfully.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#1677ff',
      });
      // messageApi.success('Add success')
      form.resetFields();
      setOpen(false);

      if (typeof Get_Employee === 'function') {
        Get_Employee();
      }
    } else {
      messageApi.warning('Add fail');
    }
  };

  return (
    <div>
      {contextHolder}

      <Form
        form={form}
        name="other_info_form"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          open_payroll: 'flexible',
        }}>
        <Row gutter={[8, 2]}>
          {/* <Col span={8}>
            <Form.Item name="bank_name" label="Bank">
              <Select
                placeholder="Bank"
                options={[
                  { label: 'ABA', value: 'ABA' },
                  { label: 'ACLEDA', value: 'ACLEDA' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="acc_name" label="Acc Name">
              <Input placeholder="Acc Name" />
            </Form.Item>
          </Col> */}
          {/* 
          <Col span={8}>
            <Form.Item name="acc_no" label="Acc No">
              <Input placeholder="Acc No" />
            </Form.Item>
          </Col> */}

          <Col span={8}>
            <Form.Item name="open_payroll" label="Open Payroll">
              <Select
                placeholder="Select open payroll"
                options={[
                  { label: 'Flexible', value: 'flexible' },
                  { label: 'End Of Month', value: 'end_of_month' },
                ]}
              />
            </Form.Item>
          </Col>

          <Divider orientation="left">Attachments</Divider>

          {documents.map((item) => (
            <Col key={item.value} xs={24} sm={12}>
              <Form.Item
                name={item.value}
                label={item.label}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                style={{
                  marginBottom: 4,
                }}
              >
                <Upload
                  accept="image/png,image/jpeg,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  beforeUpload={beforeUploadFile}
                  maxCount={item.maxCount}
                  multiple={item.multiple}
                  style={{ width: '100%' }}
                >
                  <Button
                    block
                    icon={<UploadOutlined />}
                    style={{
                      width: '100%',
                    }}
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          ))}

          <Divider />

          <Col span={24}>
            <Row gutter={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Col span={12} align="right">
                <Space>
                  <Button
                    onClick={() => {
                      setCurrent(1);
                    }}>
                    Previous
                  </Button>

                  <Button
                    loading={createLoading}
                    type="primary"
                    htmlType="submit"
                    style={{ background: '#1677ff' }}
                    className="cursor-pointer text-white">
                    Finish & Save
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OtherInfoForm;
