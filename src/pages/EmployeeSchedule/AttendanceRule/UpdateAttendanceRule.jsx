import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Button, Card, Input, Modal, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useAttendanceRuleStore } from '../../../stores/EmployeeSchedule/attendanceRule.store';
import CreateForm from './CreateForm';

const getRowId = (row) => row?._id || row?.id;

const toBreakRange = (break_time) => {
  if (!break_time?.start || !break_time?.end) return undefined;

  const s = dayjs(break_time.start, 'HH:mm');
  const e = dayjs(break_time.end, 'HH:mm');

  if (!s.isValid() || !e.isValid()) return undefined;

  return [s, e];
};

const UpdateAttendanceRule = (props) => {
  const { open, setOpen, propData, onUpdated } = props;

  const { access_token } = useContext(AuthContext);
  const [form] = Form.useForm();

  const btn_loading = useAttendanceRuleStore((s) => s.btn_loading);
  const detail_loading = useAttendanceRuleStore((s) => s.detail_loading);
  const updateAttendanceRule = useAttendanceRuleStore((s) => s.updateAttendanceRule);

  const onClose = useCallback(() => {
    form.resetFields();
    setOpen(false);
  }, [form, setOpen]);

  useEffect(() => {
    if (!open) return;

    const id = getRowId(propData);

    if (!id) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      id,
      attendance_rule_name: propData?.attendance_rule_name || '',
      type: propData?.type || 'normal',
      duration: propData?.duration ?? 0,
      break_time: toBreakRange(propData?.break_time),
      time_control: propData?.time_control || 'scan_in',
      round_off_control: propData?.round_off_control || 'round_off',
    });
  }, [open, propData?._id, propData?.id]);

  const onUpdate = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const { id, break_time, type, duration, attendance_rule_name, round_off_control, time_control } = values;

      if (!id) {
        message.warning('No attendance rule selected');
        return;
      }

      const doc = {
        attendance_rule_name,
        time_control,
        round_off_control,
        type,
      };

      if (type === 'break_time') {
        if (!break_time || break_time.length !== 2) {
          message.warning('Please select break time');
          return;
        }

        doc.duration = 0;
        doc.break_time = {
          start: dayjs(break_time[0]).format('HH:mm'),
          end: dayjs(break_time[1]).format('HH:mm'),
        };
      } else {
        doc.duration = Number(duration || 0);
      }

      const res = await updateAttendanceRule({
        access_token,
        id,
        doc,
      });

      if (res) {
        message.success('Update Success');
        onUpdated?.();
        onClose();
      } else {
        message.warning('Update Fail');
      }
    } catch (e) {
      console.log(e);
    }
  }, [form, access_token, updateAttendanceRule, onClose, onUpdated]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      destroyOnHidden
      forceRender
      closable={false}
      footer={
        <Button
          onClick={onUpdate}
          loading={btn_loading}
          disabled={detail_loading}
          type="primary"
          style={{ background: '#1677ff' }}
          className="cursor-pointer text-white">
          Update
        </Button>
      }>
      <Card
        title="Update Attendance Rule"
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
        {detail_loading ? (
          <div style={{ textAlign: 'center', padding: 30 }}>
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            name="update_att_rule"
            initialValues={{
              time_control: 'scan_in',
              round_off_control: 'round_off',
              type: 'normal',
              duration: 0,
            }}
            autoComplete="off">
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <CreateForm />
          </Form>
        )}
      </Card>
    </Modal>
  );
};

export default UpdateAttendanceRule;
