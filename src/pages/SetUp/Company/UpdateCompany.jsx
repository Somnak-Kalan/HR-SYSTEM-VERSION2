import { Card, DatePicker, Form, Modal, Input, Button, Row, Col, message } from 'antd';
const { TextArea } = Input;
import { CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useContext } from 'react';

import { useCompanyStore } from '../../../stores/comapny.store';
import { AuthContext } from '../../../contexts/AuthContext';
const toValidDayjs = (v) => {
  if (!v) return null;
  const d = dayjs(v);
  return d.isValid() ? d : null;
};

const UpdateCompany = (props) => {
  const { propData, username, btn_loading, form, open_update, setOpenUpdate, setBtnLoading } = props;

  const { access_token } = useContext(AuthContext);

  const [messageApi, contextHolder] = message.useMessage();

  const Update_Company_Store = useCompanyStore((state) => state.Update_Company);

  const onFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const { id, company_name, company_description, company_established } = values;
      const est = company_established ? dayjs(company_established) : null;
      const doc = {
        id: id,
        formData: {
          company_name: company_name,
          company_description: company_description,
          company_established: est && est.isValid() ? est.format('YYYY-MM-DD') : null,
        },

        // user: username,
      };

      setBtnLoading(true);
      await new Promise((set_second) => setTimeout(set_second, 500));

      const res = await Update_Company_Store({ doc, access_token });
      if (res) {
        messageApi.success({ content: 'Update Success' });
        setBtnLoading(false);
        setOpenUpdate(false);
      }
    } catch (error) {
      setBtnLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (open_update === true) {
      if (propData) {
        const { id, company_name, company_description, company_established } = propData;

        form?.setFieldsValue({
          id,
          company_name,
          company_description,
          company_established: toValidDayjs(company_established),
        });
      }
    }
  }, [form, propData, open_update]);

  const onFinishFailed = () => {};
  const handleCancel = () => {
    setOpenUpdate(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open_update}
        onCancel={handleCancel}
        footer={
          <Button
            loading={btn_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            htmlType="submit"
            onClick={onFinish}>
            Update
          </Button>
        }
        closable={false}>
        <Card
          title="Update Company"
          extra={
            <CloseCircleOutlined
              onClick={() => setOpenUpdate(false)}
              className="cursor-pointer"
              style={{ fontSize: '20px', color: 'red' }}
            />
          }>
          <Form form={form} name="edit_company" onFinishFailed={onFinishFailed} autoComplete="off">
            <div>
              <Form.Item hidden name="id">
                <Input />
              </Form.Item>

              <Row>
                <Col xs={24} className="my-2">
                  <Form.Item
                    name="company_name"
                    label="Company Name"
                    className="m-0 p-0"
                    rules={[{ required: true, message: 'field require' }]}
                    labelCol={{ span: 24 }}>
                    <Input placeholder="company name" />
                  </Form.Item>
                </Col>

                <Col xs={24} className="my-2">
                  <Form.Item name="company_established" className="m-0 p-0" label="Established" labelCol={{ span: 24 }}>
                    <DatePicker placeholder="YYYY-MM-DD" style={{ width: '100%' }} inputStyle={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} className="my-2">
                  <Form.Item name="company_description" className="m-0 p-0" label="Description" labelCol={{ span: 24 }}>
                    <TextArea placeholder="description" rows={4} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdateCompany;
