import { useContext, useEffect, useMemo, useState } from 'react';
import { Checkbox, Form, Input, Select, Spin, Tabs, message } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { useUserManagementStore } from '../../../stores/Administrator/userManagement.store';
import PermissionPanel from '../components/PermissionPanel';

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

const getText = (value) => {
  if (!value) return '';

  if (typeof value === 'object') {
    return value.name || value.title || value.label || value.username || '';
  }

  return value;
};

const toOptions = (list) => {
  return (list || []).map((item) => ({
    value: getId(item),
    label: getLabel(item),
  }));
};

const getNameParts = (user) => {
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';

  if (firstName || lastName) {
    return { firstName, lastName };
  }

  const name = String(user?.name || '').trim();
  const parts = name.split(' ');

  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
};

const getArrayIds = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(getId).filter(Boolean);
  }

  const id = getId(value);
  return id ? [id] : [];
};

const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';
};

const hasDuplicate = (res) => {
  return (
    res?.exists === true ||
    res?.data?.exists === true ||
    res?.isExist === true ||
    res?.data?.isExist === true ||
    res?.duplicate === true ||
    res?.data?.duplicate === true ||
    res?.available === false ||
    res?.data?.available === false
  );
};

const UserForm = ({ formId = 'user-form', userId, isEdit = false, onDone }) => {
  const [form] = Form.useForm();
  const { access_token } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('info');
  const [originalStaffCode, setOriginalStaffCode] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [checkisAdmin, setCheckIsAdmin] = useState(false);
  const selectedModules = Form.useWatch('moduleId', form) || [];

  const userDetail = useUserManagementStore((s) => s.userDetail);
  const userDetailLoading = useUserManagementStore((s) => s.userDetailLoading);
  const userSaving = useUserManagementStore((s) => s.userSaving);
  const optionLoading = useUserManagementStore((s) => s.optionLoading);
  const modulePermissionLoading = useUserManagementStore((s) => s.modulePermissionLoading);

  const moduleOptions = useUserManagementStore((s) => s.moduleOptions);
  const modulePermissionGroups = useUserManagementStore((s) => s.modulePermissionGroups);

  const Fetch_Module_Options = useUserManagementStore((s) => s.Fetch_Module_Options);
  const Fetch_Module_Permission = useUserManagementStore((s) => s.Fetch_Module_Permission);
  const Get_User_By_Id = useUserManagementStore((s) => s.Get_User_By_Id);
  const Create_User = useUserManagementStore((s) => s.Create_User);
  const Check_Staff_Code = useUserManagementStore((s) => s.Check_Staff_Code);
  const Check_Username = useUserManagementStore((s) => s.Check_Username);
  const Update_User_Info = useUserManagementStore((s) => s.Update_User_Info);
  const Update_User_Permission = useUserManagementStore((s) => s.Update_User_Permission);
  const Update_User_Password = useUserManagementStore((s) => s.Update_User_Password);
  const Clear_User_Detail = useUserManagementStore((s) => s.Clear_User_Detail);
  const Clear_Module_Permission = useUserManagementStore((s) => s.Clear_Module_Permission);

  const moduleSelectOptions = useMemo(() => {
    return toOptions(moduleOptions);
  }, [moduleOptions]);

  const selectedPermissionIds = useMemo(() => {
    const ids = [];

    modulePermissionGroups.forEach((group) => {
      (group.permissions || []).forEach((permission) => {
        const id = getId(permission);
        if (id) ids.push(id);
      });
    });

    return ids;
  }, [modulePermissionGroups]);

  const selectedModuleKey = useMemo(() => {
    return selectedModules.join(',');
  }, [selectedModules]);

  useEffect(() => {
    Fetch_Module_Options({ access_token });

    return () => {
      Clear_User_Detail();
      Clear_Module_Permission();
    };
  }, [access_token, Fetch_Module_Options, Clear_User_Detail, Clear_Module_Permission]);

  useEffect(() => {
    if (!isEdit || !userId) return;

    Get_User_By_Id({
      access_token,
      doc: { id: userId },
    });
  }, [access_token, isEdit, userId, Get_User_By_Id]);

  useEffect(() => {
    if (!isEdit || !userDetail) return;

    const { firstName, lastName } = getNameParts(userDetail);

    const moduleId = getArrayIds(
      userDetail.moduleId || userDetail.modules || userDetail.module || userDetail.permissionModules
    );

    const staffCode = userDetail.staffCode || '';
    const username = userDetail.username || '';

    setOriginalStaffCode(staffCode);
    setOriginalUsername(username);

    form.setFieldsValue({
      staffCode,
      username,
      firstName,
      lastName,
      gender: userDetail.gender || undefined,
      position: getText(userDetail.position),
      department: getText(userDetail.department),
      status: userDetail.status || 'active',
      isAdmin: userDetail.isAdmin || false,
      moduleId,
    });
    setCheckIsAdmin(userDetail.isAdmin || false);
  }, [form, isEdit, userDetail]);

  useEffect(() => {
    if (!selectedModules.length) {
      Clear_Module_Permission();
      return;
    }

    Fetch_Module_Permission({
      access_token,
      doc: {
        moduleId: selectedModules,
      },
    });
  }, [access_token, selectedModuleKey, Fetch_Module_Permission, Clear_Module_Permission]);

  const validateStaffCode = async (_, value) => {
    if (!value) return Promise.resolve();

    if (isEdit && value === originalStaffCode) {
      return Promise.resolve();
    }

    try {
      const res = await Check_Staff_Code({
        access_token,
        doc: { staffCode: value },
      });

      if (hasDuplicate(res)) {
        return Promise.reject(new Error('Staff code already exists'));
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(getErrorMessage(error)));
    }
  };

  const validateUsername = async (_, value) => {
    if (!value) return Promise.resolve();

    if (isEdit && value === originalUsername) {
      return Promise.resolve();
    }

    try {
      const res = await Check_Username({
        access_token,
        doc: { username: value },
      });

      if (hasDuplicate(res)) {
        return Promise.reject(new Error('Username already exists'));
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(getErrorMessage(error)));
    }
  };

  const handleSubmit = async (values) => {
    const moduleId = values.moduleId || [];

    try {
      if (!isEdit) {
        await Create_User({
          access_token,
          doc: {
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            username: values.username,
            staffCode: values.staffCode,
            status: values.status,
            password: values.password,
            isAdmin: values.isAdmin || false,
            moduleId,
          },
        });

        message.success('User created successfully');
        onDone?.();
        return;
      }

      if (activeTab === 'info') {
        await Update_User_Info({
          access_token,
          doc: {
            id: userId,
            formData: {
              firstName: values.firstName,
              lastName: values.lastName,
              gender: values.gender,
              status: values.status,
            },
          },
        });

        message.success('User information updated successfully');
      }

      if (activeTab === 'permission') {
        await Update_User_Permission({
          access_token,
          doc: {
            id: userId,
            formData: {
              isAdmin: values.isAdmin || false,
              moduleId,
            },
          },
        });

        message.success('User permission updated successfully');
      }

      if (activeTab === 'password') {
        await Update_User_Password({
          access_token,
          doc: {
            id: userId,
            formData: {
              password: values.password,
            },
          },
        });

        form.setFieldsValue({
          password: '',
          confirmPassword: '',
        });

        message.success('User password updated successfully');
      }
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const renderUserInfo = () => (
    <div className="pt-10">
      <h2 className="mb-7 text-[22px] font-semibold text-gray-800">User Information</h2>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-4">
        <Form.Item
          label="Staff Code"
          name="staffCode"
          rules={[{ required: true, message: 'Please input staff code' }, { validator: validateStaffCode }]}>
          <Input disabled={isEdit} placeholder="staff code" />
        </Form.Item>

        <Form.Item
          label="User Name"
          name="username"
          rules={[{ required: true, message: 'Please input username' }, { validator: validateUsername }]}>
          <Input disabled={isEdit} placeholder="username" />
        </Form.Item>

        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input first name' }]}>
          <Input placeholder="first name" />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input last name' }]}>
          <Input placeholder="last name" />
        </Form.Item>

        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender' }]}>
          <Select
            placeholder="gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
          <Select
            placeholder="status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </Form.Item>
      </div>
    </div>
  );

  const renderUserPermission = () => (
    <div className="pt-10">
      <div className="max-w-[800px]">
        <Form.Item label="Module" name="moduleId">
          <Select
            mode="multiple"
            allowClear
            showSearch
            loading={optionLoading}
            placeholder="select module"
            options={moduleSelectOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        {checkisAdmin && (
          <Form.Item name="isAdmin" valuePropName="checked">
            <Checkbox disabled>isAdmin</Checkbox>
          </Form.Item>
        )}
      </div>

      <div className="mb-2 mt-6 border-b pb-1 font-semibold text-gray-700">Permissions</div>

      <Spin spinning={modulePermissionLoading}>
        <PermissionPanel
          groups={modulePermissionGroups}
          selectedPermissions={selectedPermissionIds}
          disabledPermissions={selectedPermissionIds}
          readonly
        />
      </Spin>
    </div>
  );

  const renderUserPassword = () => (
    <div className="pt-10">
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
        <Form.Item
          label={isEdit ? 'New Password' : 'Password'}
          name="password"
          rules={[
            {
              validator(_, value) {
                if (isEdit && activeTab !== 'password') {
                  return Promise.resolve();
                }

                if (!value) {
                  return Promise.reject(new Error('Please input password'));
                }

                return Promise.resolve();
              },
            },
          ]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item
          label={isEdit ? 'Confirm New Password' : 'Confirm Password'}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const password = getFieldValue('password');

                if (isEdit && activeTab !== 'password') {
                  return Promise.resolve();
                }

                if (!value) {
                  return Promise.reject(new Error('Please confirm password'));
                }

                if (password && value !== password) {
                  return Promise.reject(new Error('Password does not match'));
                }

                return Promise.resolve();
              },
            }),
          ]}>
          <Input.Password placeholder="confirm password" />
        </Form.Item>
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <>
      {renderUserInfo()}
      {renderUserPermission()}
      {renderUserPassword()}
    </>
  );

  const renderEditForm = () => (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      destroyInactiveTabPane={false}
      items={[
        {
          key: 'info',
          label: 'User Info',
          children: renderUserInfo(),
        },
        {
          key: 'permission',
          label: 'User Permission',
          children: renderUserPermission(),
        },
        {
          key: 'password',
          label: 'User Password',
          children: renderUserPassword(),
        },
      ]}
    />
  );

  return (
    <div className="rounded-md bg-white p-7">
      <Spin spinning={userDetailLoading || userSaving}>
        <Form
          id={formId}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: 'male',
            status: 'active',
            isAdmin: false,
            moduleId: [],
          }}>
          {isEdit ? renderEditForm() : renderCreateForm()}
        </Form>
      </Spin>
    </div>
  );
};

export default UserForm;
