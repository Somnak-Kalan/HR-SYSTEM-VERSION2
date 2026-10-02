import { Form, Input, Row, Col, InputNumber } from 'antd';

const AddQrCode = () => {
  return (
    <Row gutter={[8, 2]}>
      <Col xs={24} className="mx-1 my-2">
        <Form.Item
          label="Destination"
          name="title"
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <Input placeholder="destination" />
        </Form.Item>
      </Col>

      <Col xs={24} className="mx-1 my-2">
        <Form.Item
          name="latitude"
          label="Latitude"
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <InputNumber style={{ width: '100%' }} placeholder="latitude" step="0.000001" />
        </Form.Item>
      </Col>

      <Col xs={24} className="mx-1 my-2">
        <Form.Item
          name="longitude"
          label="Longitude"
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <InputNumber style={{ width: '100%' }} placeholder="longitude" step="0.000001" />
        </Form.Item>
      </Col>

      <Col xs={24} className="mx-1 my-2">
        <Form.Item
          label="Round (m)"
          name="round"
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <InputNumber style={{ width: '100%' }} placeholder="round (m)" min={0} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default AddQrCode;
