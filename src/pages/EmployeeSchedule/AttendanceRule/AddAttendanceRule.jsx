import { Card, Modal, Form, Button, message } from 'antd';
import { CloseCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCallback, useContext, useState } from 'react';
import CreateForm from './CreateForm';
import { AuthContext } from '../../../contexts/AuthContext';
import { useAttendanceRuleStore } from '../../../stores/EmployeeSchedule/attendanceRule.store';

const AddAttendanceRule = () => {
  const { access_token } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const btn_loading = useAttendanceRuleStore((s) => s.btn_loading);
  const createAttendanceRule = useAttendanceRuleStore((s) => s.createAttendanceRule);

  const showModal = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form]);

  const onSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const { break_time, type, duration, attendance_rule_name, round_off_control, time_control } = values;

      const doc = {
        attendance_rule_name,
        time_control,
        round_off_control,
        type,
      };

      if (type === 'break_time') {
        doc.duration = 0;

        doc.break_time = {
          start: dayjs(break_time?.[0]).format('HH:mm'),
          end: dayjs(break_time?.[1]).format('HH:mm'),
        };
      } else {
        doc.duration = Number(duration || 0);
      }

      const res = await createAttendanceRule({
        access_token,
        doc,
      });

      if (res) {
        message.success('Add Success');
        onClose();
      } else {
        message.warning('Add Fail');
      }
    } catch (e) {
      console.log(e);
    }
  }, [form, access_token, createAttendanceRule, onClose]);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: '#1677ff' }}
        className="cursor-pointer text-white">
        <UserAddOutlined />
        Add Attendance Rule
      </Button>

      <Modal
        open={open}
        onCancel={onClose}
        destroyOnHidden
        forceRender
        closable={false}
        footer={
          <Button
            onClick={onSave}
            loading={btn_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Save
          </Button>
        }>
        <Card
          title="Add Attendance Rule"
          extra={
            <CloseCircleOutlined
              onClick={onClose}
              className="cursor-pointer"
              style={{
                fontSize: 20,
                color: 'red',
              }}
            />
          }>
          <Form
            form={form}
            name="add_att_rule"
            initialValues={{
              time_control: 'scan_in',
              round_off_control: 'round_off',
              type: 'normal',
              duration: 0,
            }}
            autoComplete="off">
            <CreateForm />
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default AddAttendanceRule;
