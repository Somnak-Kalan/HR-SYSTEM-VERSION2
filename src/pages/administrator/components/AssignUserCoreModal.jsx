import { useContext, useEffect, useMemo } from 'react';
import { Form, Modal, Select, message } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { useUserManagementStore } from '../../../stores/Administrator/userManagement.store';

const getId = (item) => {
  if (!item) return undefined;
  if (typeof item === 'object') return item._id || item.id || item.value;
  return item;
};

const getLabel = (item) => {
  if (!item) return '';

  if (typeof item === 'object') {
    return item.label || item.name || item.title || item.username || item.staffCode || '';
  }

  return item;
};

const toOptions = (list) => {
  return (list || []).map((item) => ({
    value: getId(item),
    label: getLabel(item),
    disabled: item?.disabled === true,
  }));
};

const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';
};

const AssignUserCoreModal = ({ open, onClose, onDone }) => {
  const [form] = Form.useForm();
  const { access_token } = useContext(AuthContext);

  const userOptions = useUserManagementStore((s) => s.userOptions);
  const moduleOptions = useUserManagementStore((s) => s.moduleOptions);
  const optionLoading = useUserManagementStore((s) => s.optionLoading);
  const userSaving = useUserManagementStore((s) => s.userSaving);

  const Fetch_User_Options = useUserManagementStore((s) => s.Fetch_User_Options);
  const Fetch_Module_Options = useUserManagementStore((s) => s.Fetch_Module_Options);
  const Update_System_Core = useUserManagementStore((s) => s.Update_System_Core);

  const userSelectOptions = useMemo(() => toOptions(userOptions), [userOptions]);

  const moduleSelectOptions = useMemo(() => toOptions(moduleOptions), [moduleOptions]);

  useEffect(() => {
    if (!open) return;

    Fetch_User_Options({
      access_token,
      doc: {},
    });

    Fetch_Module_Options({
      access_token,
    });
  }, [open, access_token, Fetch_User_Options, Fetch_Module_Options]);

  const handleCancel = () => {
    form.resetFields();
    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const userId = values.userId;
      const moduleId = values.moduleId || [];

      await Update_System_Core({
        access_token,
        doc: {
          id: userId,
          formData: {
            moduleId,
          },
        },
      });

      message.success('User assigned to core successfully');
      form.resetFields();
      onDone?.();
      onClose?.();
    } catch (error) {
      if (error?.errorFields) return;
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      open={open}
      title="Assign User To Core"
      okText="Assign"
      cancelText="Cancel"
      confirmLoading={userSaving}
      onOk={handleSubmit}
      onCancel={handleCancel}
      destroyOnClose>
      <Form form={form} layout="vertical">
        <Form.Item label="User" name="userId" rules={[{ required: true, message: 'Please select user' }]}>
          <Select
            allowClear
            showSearch
            loading={optionLoading}
            placeholder="select user"
            options={userSelectOptions}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item label="Core Modules" name="moduleId">
          <Select
            mode="multiple"
            allowClear
            showSearch
            loading={optionLoading}
            placeholder="select modules or leave empty"
            options={moduleSelectOptions}
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignUserCoreModal;
