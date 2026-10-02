import { Card, Modal, Form, Flex, DatePicker, Input, Button, Row, Col, message } from 'antd';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

//  zustand + auth
import { useCompanyStore } from '../../../stores/comapny.store';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

const AddCompany = (props) => {
  const { username, open_add, form, btn_loading, setOpenAdd, setBtnLoading } = props;

  const { access_token } = useContext(AuthContext);

  const Create_Company_Store = useCompanyStore((state) => state.Create_Company);
  const Get_Company_Store = useCompanyStore((state) => state.Get_Company);
  const [messageApi, contextHolder] = message.useMessage();
  const handleCancel = () => {
    setOpenAdd(false);
  };

  const onFinish = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const { company_name, company_description, company_established } = values;

      const doc = {
        company_name: company_name,
        company_description: company_description,
        company_established: company_established ? dayjs(company_established).format('YYYY-MM-DD') : null,
        // user: username,
      };

      setBtnLoading(true);
      await new Promise((set_second) => setTimeout(set_second, 500));

      await Create_Company_Store({ doc, access_token }).then((res) => {
        if (res) {
          messageApi.success({ content: 'Add Success' });
          setBtnLoading(false);
          setOpenAdd(false);
          form.resetFields();
        }
      });
    } catch (error) {
      setBtnLoading(false);
      console.log(error);
    }
  };

  const onFinishFailed = () => {};

  return (
    <>
      {contextHolder}
      <Modal
        open={open_add}
        onCancel={handleCancel}
        footer={
          <Button
            onClick={onFinish}
            loading={btn_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white  "
            htmlType="submit">
            Save
          </Button>
        }
        closable={false}>
        <Card
          title="Add Company"
          extra={
            <CloseCircleOutlined
              onClick={() => setOpenAdd(false)}
              className="cursor-pointer"
              style={{ fontSize: '20px', color: 'red' }}
            />
          }>
          <Form
            form={form}
            name="basic"
            labelAlign="top"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <div>
              <Row>
                <Col xs={24} className="my-2">
                  <Form.Item
                    label="Company Name"
                    name="company_name"
                    className="m-0 p-0"
                    rules={[{ required: true, message: 'field require' }]}
                    labelCol={{ span: 24 }}>
                    <Input placeholder="Title" />
                  </Form.Item>
                </Col>
                <Col xs={24} className="my-2">
                  <Form.Item name="company_established" label="Established" className="m-0 p-0" labelCol={{ span: 24 }}>
                    <DatePicker placeholder="YYYY-MM-DD" style={{ width: '100%' }} inputStyle={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} className=" my-2">
                  <Form.Item name="company_description" label="Description" className="m-0 p-0" labelCol={{ span: 24 }}>
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
export default AddCompany;
