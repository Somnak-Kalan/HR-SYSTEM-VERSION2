import { Select, Form, Button, Card, Modal, Row, Col, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ShiftManagementService from '../../../../../services/options/employeeSchedule/ShiftManagement';
import { AuthContext } from '../../../../../contexts/AuthContext';
import { useEmployeeDetailStore } from '../../../../../stores/employeeDetail.store';

const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.list)) return res.list;
  return [];
};

const UpdateShift = (props) => {
  const { schedule_List, shift_management_id, open, setOpen } = props;

  const { username, access_token } = useContext(AuthContext);
  const { id } = useParams();

  const updateShiftManagement = useEmployeeDetailStore((s) => s.updateShiftManagement);
  const storeLoading = useEmployeeDetailStore((s) => s.loading);


  const [shiftList, setShiftList] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const selectedShiftId = useMemo(() => {
    return shift_management_id || schedule_List?.shift_management_id || schedule_List?._id || '';
  }, [shift_management_id, schedule_List]);



  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const fetchShiftOptions = async () => {
    if (!access_token) return;

    setOptionLoading(true);

    try {
      const res = await ShiftManagementService.Get_Shift_Management_Options({
        access_token,
      });

      const list = toArray(res);

      setShiftList(list);
    } catch (error) {
      console.log('fetch shift option error:', error);
      messageApi.error(error?.response?.data?.message || error?.response?.data?.msg || 'Failed to load shift list');
    } finally {
      setOptionLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      shift_management_id: selectedShiftId,
    });

    fetchShiftOptions();
  }, [open, selectedShiftId]);

  const onFinish = async (values) => {
    const shiftId = values?.shift_management_id;

    if (!id) {
      messageApi.warning('Employee id not found');
      return;
    }

    if (!shiftId) {
      messageApi.warning('Please select shift');
      return;
    }

    try {
      const doc = {
        id,
        formData: {
          shift_management_id: shiftId,
        },
      };

      const ok = await updateShiftManagement({
        id,
        doc,
        access_token,
      });

      if (ok) {
        messageApi.success('Update Success');
        setOpen(false);
        form.resetFields();
      } else {
        messageApi.warning('Update Fail');
      }
    } catch (error) {
      console.log('update shift error:', error);

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
        width={520}
        centered
        closable={false}
        styles={{
          body: {
            padding: 16,
          },
        }}>
        <Card
          title="Update Shift Management"
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
          <Form form={form} name="edit_shift" layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Shift Name"
                  name="shift_management_id"
                  rules={[
                    {
                      required: true,
                      message: 'Please select shift',
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    loading={optionLoading}
                    placeholder="Select shift name"
                    style={{ width: '100%' }}
                    optionFilterProp="label"
                    options={shiftList.map((option) => ({
                      value: option?.value || option?._id,
                      label: option?.label || option?.shift_name || '-',
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    block
                    loading={storeLoading}
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

export default UpdateShift;
