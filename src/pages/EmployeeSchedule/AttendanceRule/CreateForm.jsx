import { Space, Form, Select, Radio, InputNumber, Input, TimePicker, Row, Col } from 'antd';

const CreateForm = () => {
  const form = Form.useFormInstance();
  const type = Form.useWatch('type', form);

  const options = [
    { label: 'Normal', value: 'normal' },
    { label: 'Late', value: 'late' },
    { label: 'Early', value: 'early' },
    { label: 'Break Time', value: 'break_time' },
    { label: 'Absence', value: 'absence' },
    { label: 'Scan 2 Time', value: 'scan_2_time' },
  ];

  return (
    <Row gutter={[8, 2]}>
      <Col xs={24} className="my-2">
        <Form.Item
          label="Attendance Rule Name"
          labelCol={{ span: 24 }}
          name="attendance_rule_name"
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <Input placeholder="Attendance Rule Name" />
        </Form.Item>
      </Col>

      <Col xs={24} className="my-2">
        <Form.Item
          name="type"
          label="Type"
          labelCol={{ span: 24 }}
          className="m-0 p-0"
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <Select options={options} placeholder="Select a value" />
        </Form.Item>
      </Col>

      <Col xs={24} className="my-2">
        <strong>Statistical Rule</strong>

        {type === 'break_time' ? (
          <Form.Item
            name="break_time"
            label="Break Time"
            className="m-0 p-0"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'field require',
              },
            ]}>
            <TimePicker.RangePicker format="HH:mm" className="w-full" />
          </Form.Item>
        ) : (
          <Form.Item
            name="duration"
            label="Duration (Min)"
            className="m-0 p-0"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'field require',
              },
            ]}>
            <InputNumber placeholder="duration(min)" className="w-full" min={0} />
          </Form.Item>
        )}
      </Col>

      <Col xs={24}>
        <Form.Item
          name="time_control"
          label="Time Control"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <Radio.Group>
            <Space>
              <Radio value="scan_in">Scan In</Radio>
              <Radio value="scan_out">Scan Out</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item
          name="round_off_control"
          label="Round Off Control"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'field require',
            },
          ]}>
          <Radio.Group>
            <Space wrap>
              <Radio value="round_down">Round Down</Radio>
              <Radio value="round_off">Round Off</Radio>
              <Radio value="round_up">Round Up</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default CreateForm;
