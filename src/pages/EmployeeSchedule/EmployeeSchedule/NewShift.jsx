import { TimePicker, Row, Col, Form, Input, Checkbox, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DAYS, DayLabels } from './schedule.utils';
import { useShiftManagementStore } from '../../../stores/EmployeeSchedule/shiftManagement.store';

const defaultMorning = [dayjs('08:00', 'HH:mm'), dayjs('12:00', 'HH:mm')];
const defaultAfternoon = [dayjs('13:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];

const getEmptyCheckDay = () =>
  DAYS.reduce((acc, d) => {
    acc[d] = false;
    return acc;
  }, {});

const NewShift = (props) => {
  const { list_attendance_rule, form } = props;

  const validateShiftName = useShiftManagementStore((s) => s.validateShiftName);

  const [checkDay, setCheckDay] = useState(getEmptyCheckDay);

  useEffect(() => {
    const values = {
      shift_name: null,
      attendance_rule_id: [],
    };

    DAYS.forEach((day) => {
      values[day] = false;
      values[`${day}_morning`] = null;
      values[`${day}_afternoon`] = null;
    });

    setCheckDay(getEmptyCheckDay());
    form.setFieldsValue(values);
  }, [form]);

  const attendanceRuleOptions = useMemo(() => {
    return (Array.isArray(list_attendance_rule) ? list_attendance_rule : []).map((option) => ({
      label: option?.attendance_rule_name || option?.label || '-',
      value: option?.id || option?._id || option?.value,
    }));
  }, [list_attendance_rule]);

  const handleCheckDay = (day, checked) => {
    setCheckDay((pre) => ({
      ...pre,
      [day]: checked,
    }));

    form.setFieldsValue({
      [day]: checked,
      [`${day}_morning`]: checked ? defaultMorning : null,
      [`${day}_afternoon`]: checked ? defaultAfternoon : null,
    });
  };

  return (
    <>
      <Row className="mb-5" gutter={[8, 2]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Shift Name"
            labelCol={{ span: 24 }}
            name="shift_name"
            rules={[
              { required: true, message: 'Field is required' },
              {
                validator: async (_, value) => {
                  const v = (value || '').trim();

                  if (!v) return Promise.resolve();

                  if (typeof validateShiftName !== 'function') {
                    return Promise.resolve();
                  }

                  const exists = await validateShiftName(v);

                  if (exists === true) {
                    return Promise.reject(new Error('Shift Name already exists'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger="onBlur">
            <Input placeholder="Shift Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Form.Item
            label="Attendance Rule"
            labelCol={{ span: 24 }}
            name="attendance_rule_id"
            rules={[{ required: true, message: 'field require' }]}>
            <Select
              mode="multiple"
              placeholder="select attendance rule"
              optionLabelProp="label"
              options={attendanceRuleOptions}
            />
          </Form.Item>
        </Col>
      </Row>

      {DAYS.map((day) => {
        const enabled = !!checkDay[day];

        return (
          <Row gutter={[8, 2]} key={day}>
            <Col xs={8} lg={4} xl={4}>
              <label>{DayLabels[day]}</label>
            </Col>

            <Col xs={4} lg={1} xl={1}>
              :
            </Col>

            <Col lg={1} xl={1}>
              <Form.Item name={day} valuePropName="checked" className="mb-4">
                <Checkbox className="mb-2" checked={enabled} onChange={(e) => handleCheckDay(day, e.target.checked)} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} lg={18} xl={18}>
              <div className="md:block xl:flex">
                <div className="xl:mx-1">
                  <Form.Item label="Morning" labelCol={{ span: 24 }} name={`${day}_morning`} className="m-0 p-0">
                    <TimePicker.RangePicker allowEmpty format="HH:mm" disabled={!enabled} className="sm:w-full" />
                  </Form.Item>
                </div>

                <div className="xl:mx-1">
                  <Form.Item label="Afternoon" labelCol={{ span: 24 }} name={`${day}_afternoon`} className="m-0 p-0">
                    <TimePicker.RangePicker allowEmpty format="HH:mm" disabled={!enabled} className="sm:w-full" />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default NewShift;
