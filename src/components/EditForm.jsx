import { Card, Form } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect } from 'react';
const EditForm = (props) => {
  const { propData, emitEditData, emitCloseModal } = props;
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await emitEditData(values);
    await form.resetFields();
  };
  const onCloseModal = async () => {
    await form.resetFields();
    await emitCloseModal(false);
  };
  useEffect(() => {
    // Set the form fields value when initialValue changes
    form.setFieldsValue({
      ...propData,
      date_create: dayjs(propData.date_create),
    });
  }, [form, propData]);
  const onFinishFailed = () => {};
  return (
    <>
      <Card
        title="Simple"
        extra={
          <CloseCircleOutlined
            onClick={() => onCloseModal()}
            className="cursor-pointer"
            style={{ fontSize: '20px', color: 'red' }}
          />
        }>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 5,
          }}
          labelAlign="left"
          wrapperCol={{
            span: 16,
          }}
          style={{ width: 400 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="flex justify-center pt-4 ">
          <div>
            {/* -------//--------- */}
            {/* code here */}
            {/* -------//--------- */}

            {/* -------//--------- */}
            {/* end code here */}
            {/* -------//--------- */}
          </div>
        </Form>
      </Card>
    </>
  );
};
export default EditForm;
