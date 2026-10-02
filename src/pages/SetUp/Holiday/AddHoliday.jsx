import { Card, Modal, Form, Row, Col, DatePicker, Button, Input, Empty, message } from 'antd';
import { CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useHolidayStore } from '../../../stores/holidday.store';

const { RangePicker } = DatePicker;

const buildHolidayDates = (start, end) => {
  const dates = [];
  let current = dayjs(start);
  const last = dayjs(end);

  while (current.isSame(last, 'day') || current.isBefore(last, 'day')) {
    dates.push({
      date: current.format('YYYY-MM-DD'),
      day: current.format('dddd'),
    });

    current = current.add(1, 'day');
  }

  return dates;
};

const AddHoliday = (props) => {
  const { form, setAddOpen, add_open, btn_loading, access_token } = props;

  const createHoliday = useHolidayStore((s) => s.createHoliday);

  const [holiday_date, setHolidayDate] = useState([]);

  useEffect(() => {
    if (add_open) {
      form.resetFields();
      setHolidayDate([]);
    }
  }, [add_open, form]);

  const handleCancel = useCallback(() => {
    setAddOpen(false);
    form.resetFields();
    setHolidayDate([]);
  }, [setAddOpen, form]);

  const handleChangeRange = useCallback((dates) => {
    if (!dates?.[0] || !dates?.[1]) {
      setHolidayDate([]);
      return;
    }

    setHolidayDate(buildHolidayDates(dates[0], dates[1]));
  }, []);

  const handleRemoveDate = useCallback((date) => {
    setHolidayDate((prev) => prev.filter((item) => item.date !== date));
  }, []);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const { holiday_en, holiday_kh, date_range } = values;

      if (!date_range?.[0] || !date_range?.[1]) {
        message.warning({ content: 'Please select date range' });
        return;
      }

      if (!holiday_date.length) {
        message.warning({ content: 'Please keep at least one holiday date' });
        return;
      }

      const doc = {
        holiday_en,
        holiday_kh,
        num_holiday_day: holiday_date.length,
        holiday_date: holiday_date.map((item) => ({
          date: item.date,
        })),
      };

      const ok = await createHoliday({
        doc,
        access_token,
      });

      if (ok) {
        message.success({ content: 'Add Success' });
        form.resetFields();
        setHolidayDate([]);
        setAddOpen(false);
      } else {
        message.error({ content: 'Add Fail' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dayCount = useMemo(() => holiday_date.length, [holiday_date]);

  return (
    <Modal
      open={add_open}
      onCancel={handleCancel}
      footer={
        <Button
          onClick={onFinish}
          loading={btn_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Save
        </Button>
      }
      closable={false}
      destroyOnClose>
      <Card
        title="Add Holiday"
        extra={
          <CloseCircleOutlined
            onClick={handleCancel}
            className="cursor-pointer"
            style={{ fontSize: 20, color: 'red' }}
          />
        }>
        <Form form={form} name="add_holiday" autoComplete="off">
          <Row>
            <Col xs={24} className="my-2">
              <Form.Item
                name="holiday_kh"
                label="Holiday(Khmer)"
                className="m-0 p-0"
                rules={[{ required: true, message: 'field required' }]}
                labelCol={{ span: 24 }}>
                <Input placeholder="khmer language" />
              </Form.Item>
            </Col>

            <Col xs={24} className="my-2">
              <Form.Item
                label="Holiday(English)"
                labelCol={{ span: 24 }}
                className="m-0 p-0"
                name="holiday_en"
                rules={[{ required: true, message: 'field required' }]}>
                <Input placeholder="english language" />
              </Form.Item>
            </Col>

            <Col xs={24} className="my-2">
              <Form.Item
                label="Date"
                name="date_range"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'field required' }]}>
                <RangePicker
                  placeholder={['From', 'To']}
                  className="w-full"
                  format="YYYY MMM DD"
                  style={{ width: '100%' }}
                  onChange={handleChangeRange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} className="my-2">
              <strong>Days: </strong>
              <strong style={{ color: 'blue' }}>{dayCount}</strong>
            </Col>

            <Col xs={24} className="my-2">
              {dayCount > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {holiday_date.map((item) => (
                    <div
                      key={item.date}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: 6,
                        padding: '8px 10px',
                        boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                      }}>
                      <div>
                        <div className="text-sm">{dayjs(item.date).format('YYYY-MMMM-D')}</div>
                        <div className="text-xs" style={{ color: '#888' }}>
                          {item.day}
                        </div>
                      </div>

                      {/* <Button
                        danger
                        size='small'
                        shape='circle'
                        icon={<MinusCircleOutlined />}
                        onClick={() => handleRemoveDate(item.date)}
                      /> */}
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="Please select date range" />
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
};

export default AddHoliday;
