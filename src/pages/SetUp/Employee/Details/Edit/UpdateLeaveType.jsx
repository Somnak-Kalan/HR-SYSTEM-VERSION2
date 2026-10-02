import { Select, Form, Button, Card, Modal, Row, Col, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../../../../../contexts/AuthContext';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';
import LeaveTypeOptServices from '../../../../../services/options/setup/leaveTypeOtp';

const getId = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;

  return item?._id || item?.id || item?.value || null;
};

const normalizeSelectedIds = (value) => {
  if (!value) return [];

  const list = Array.isArray(value) ? value : [value];

  return list.map(getId).filter(Boolean);
};

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.rows)) return res.rows;

  return [];
};

const normalizeOption = (item) => {
  if (!item) return null;

  const value = item?.value || item?._id || item?.id;
  const label = item?.label || item?.leave_type_name || item?.leave_type_name_kh || item?.name || '-';

  if (!value) return null;

  return {
    ...item,
    value,
    label,
  };
};

const buildSelectedOptions = (selectedIds, options) => {
  if (!Array.isArray(selectedIds) || !Array.isArray(options)) return [];

  return selectedIds
    .map((id) => {
      const found = options.find((option) => String(option.value) === String(id));

      if (!found) return null;

      return {
        value: found.value,
        label: found.label,
      };
    })
    .filter(Boolean);
};

const UpdateLeaveType = (props) => {
  const { leave_type, success, onUpdated, open, setOpen } = props;
  const [form] = Form.useForm();

  const { id } = useParams();
  const { username, access_token } = useContext(AuthContext);

  const updateEmployeeLeaveType = useEmployeeDetailStore((s) => s.updateEmployeeLeaveType);
  const loading = useEmployeeDetailStore((s) => s.loading);

  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const selectedIds = useMemo(() => {
    return normalizeSelectedIds(leave_type);
  }, [leave_type]);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setLeaveTypeOptions([]);
  };

  const fetchLeaveTypeOptions = async () => {
    if (!access_token) return [];

    setOptionLoading(true);

    try {
      const res = await LeaveTypeOptServices.Get_Leave_Type_Otp({
        access_token,
      });

      const list = toArray(res).map(normalizeOption).filter(Boolean);

      setLeaveTypeOptions(list);

      return list;
    } catch (error) {
      console.log('fetch leave type option error:', error);

      messageApi.error(
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        'Failed to load leave type options'
      );

      setLeaveTypeOptions([]);

      return [];
    } finally {
      setOptionLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const init = async () => {
      form.setFieldsValue({
        leave_type: [],
      });

      const options = await fetchLeaveTypeOptions();

      const selectedOptions = buildSelectedOptions(selectedIds, options);

      form.setFieldsValue({
        leave_type: selectedOptions,
      });
    };

    init();
  }, [open, access_token, selectedIds, form]);

  const onFinish = async (values) => {
    const leaveTypeIds = normalizeSelectedIds(values?.leave_type);

    if (!leaveTypeIds.length) {
      messageApi.warning('Please select leave type');
      return;
    }

    try {
      const ok = await updateEmployeeLeaveType({
        id,
        leave_type: leaveTypeIds,
        username,
        access_token,
      });

      if (ok) {
        if (success) {
          success({ content: 'Update Success' });
        } else {
          messageApi.success('Update Success');
        }

        setOpen(false);
        form.resetFields();
        setLeaveTypeOptions([]);

        if (onUpdated) {
          onUpdated(leaveTypeIds);
        }
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      console.log('update leave type error:', error);

      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Update Fail');
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
        closable={false}
        styles={{
          body: {
            padding: 16,
          },
        }}>
        <Card
          title="Update Leave Type"
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              className="cursor-pointer"
              style={{ fontSize: 20, color: 'red' }}
            />
          }
          styles={{
            body: {
              paddingTop: 16,
            },
          }}>
          <Form form={form} name="edit_leave_type" layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Leave Type"
                  name="leave_type"
                  rules={[
                    {
                      required: true,
                      message: 'Please select leave type',
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    labelInValue
                    mode="multiple"
                    placeholder="Select leave type"
                    optionLabelProp="label"
                    optionFilterProp="label"
                    loading={optionLoading}
                    disabled={optionLoading}
                    style={{ width: '100%' }}
                    options={leaveTypeOptions.map((option) => ({
                      value: option.value,
                      label: option.label,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    block
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    style={{
                      height: 40,
                      borderRadius: 8,
                      background: '#1677ff',
                    }}
                    className="cursor-pointer text-white">
                    Update
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default UpdateLeaveType;
