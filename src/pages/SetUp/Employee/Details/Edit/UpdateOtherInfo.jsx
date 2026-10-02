import { Select, Form, Input, Flex, Button, Card, Modal, Row, Col, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';
import { AuthContext } from '../../../../../contexts/AuthContext';
import EditIcon from '../../../../../assets/icons/white_edit.svg'
const UpdateOtherInfo = (props) => {
  const { other_info } = props;

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const updateOtherInfo = useEmployeeDetailStore((s) => s.updateOtherInfo);
  const loading = useEmployeeDetailStore((s) => s.loading);

  const { username, access_token } = useContext(AuthContext);
  const { id } = useParams();

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      bank_name: other_info?.bank_name || '',
      acc_name: other_info?.acc_name || '',
      acc_no: other_info?.acc_no || '',
      open_payroll: other_info?.open_payroll || '',
    });
  }, [form, other_info, open]);

  const onFinish = async (values) => {
    try {
      const { bank_name, acc_name, acc_no, open_payroll } = values || {};

      const doc = {
        id,
        jsonData: {
          bank_name: bank_name || '',
          acc_name: acc_name || '',
          acc_no: acc_no || '',
          open_payroll: open_payroll || '',
        },
        user: username,
      };

      console.log(doc, 'update other info doc');

      const ok = await updateOtherInfo({
        id,
        access_token,
        doc,
      });

      if (ok) {
        messageApi.success('Update Success');
        setOpen(false);
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      console.log('update other info error:', error);
      console.log('backend response:', error?.response?.data);

      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Update Fail');
    }
  };

  const onFinishFailed = () => { };

  return (
    <>
      {contextHolder}

      <div>
        <Button

          type="primary"
          icon={<img src={EditIcon} />}
          onClick={showModal}
          style={{
            width: 28,
            height: 28,
            minWidth: 28,
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            background: '#fa8c16',
            borderColor: '#fa8c16',
            boxShadow: 'none',
          }}
        />

      </div>

      <Modal open={open} onCancel={handleCancel} footer="" width="50vw" closable={false}>
        <Card
          title="Update Other Information"
          extra={
            <CloseCircleOutlined
              onClick={onCloseModal}
              className="cursor-pointer"
              style={{ fontSize: '20px', color: 'red' }}
            />
          }>
          <Form
            form={form}
            name="edit_other_info"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Row gutter={[8, 2]}>
              {/* <Col xs={24} sm={24} md={24} lg={12} className="my-2">
                <Form.Item label="Bank" labelCol={{ span: 24 }} name="bank_name" className="m-0 p-0">
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Select bank name"
                    options={[
                      { value: 'ACLIDA', label: 'ACLIDA' },
                      { value: 'WING', label: 'WING' },
                      { value: 'ABA', label: 'ABA' },
                    ]}
                  />
                </Form.Item>
              </Col> */}
              {/* 
              <Col xs={24} sm={24} md={24} lg={12} className="my-2">
                <Form.Item name="acc_name" label="Acc Name" labelCol={{ span: 24 }} className="m-0 p-0">
                  <Input placeholder="Acc Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} className="my-2">
                <Form.Item name="acc_no" label="Acc No" labelCol={{ span: 24 }} className="m-0 p-0">
                  <Input placeholder="Acc No" />
                </Form.Item>
              </Col> */}

              <Col xs={24} sm={24} md={24} lg={12} className="my-2">
                <Form.Item
                  label="Open Payroll"
                  labelCol={{ span: 24 }}
                  name="open_payroll"
                  className="m-0 p-0"
                  rules={[                                    
                    {
                      required: true,
                      message: 'Please select Open Payroll',
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Select open payroll"
                    options={[
                      { value: 'Flexible', label: 'Flexible' },
                      { value: 'End Of Month', label: 'End Of Month' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="right" className="mt-5">
              <Form.Item className="m-0 p-0">
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  style={{ background: '#1677ff' }}
                  className="cursor-pointer text-white">
                  Update
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdateOtherInfo;
