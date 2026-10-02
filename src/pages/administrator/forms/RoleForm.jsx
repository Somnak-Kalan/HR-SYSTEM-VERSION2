import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Form, Input, Select, message } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { useRolePermissionStore } from '../../../stores/Administrator/rolePermission.store';
import PermissionPanel from '../components/PermissionPanel';

const normalizeId = (item) => {
  if (!item) return undefined;

  const value =
    typeof item === 'object' ? item._id || item.id || item.value || item.permissionId || item.permission_id : item;

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return String(value);
};

const getLabel = (item) => {
  if (!item) return '';

  if (typeof item === 'object') {
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();

    return (
      item.label ||
      item.username ||
      fullName ||
      item.name ||
      item.title ||
      item.staffCode ||
      item.email ||
      item.system ||
      item.detail ||
      ''
    );
  }

  return String(item);
};

const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';
};

const toOptions = (list, currentValue) => {
  const currentId = normalizeId(currentValue);

  return (list || [])
    .map((item) => {
      const value = normalizeId(item);

      if (!value) {
        return null;
      }

      return {
        value,
        label: getLabel(item) || value,
        disabled: item?.disabled === true && value !== currentId,
      };
    })
    .filter(Boolean);
};

const RoleForm = ({ formId = 'role-form', roleId, isEdit = false, onDone }) => {
  const [form] = Form.useForm();
  const { access_token } = useContext(AuthContext);

  /*
   * Permissions belonging to the role currently
   * being created or edited.
   */
  const [permissionIds, setPermissionIds] = useState([]);

  /*
   * Prevent duplicate employee-info requests when
   * React StrictMode runs effects twice.
   */
  const checkedEditUserRef = useRef(null);

  const selectedUserId = Form.useWatch('userId', form);

  const permissionGroups = useRolePermissionStore((state) => state.permissionGroups);

  const companyOptions = useRolePermissionStore((state) => state.companyOptions);

  const departmentOptions = useRolePermissionStore((state) => state.departmentOptions);

  const userOptions = useRolePermissionStore((state) => state.userOptions);

  const roleDetail = useRolePermissionStore((state) => state.roleDetail);

  const optionLoading = useRolePermissionStore((state) => state.optionLoading);

  const userPermissionInfo = useRolePermissionStore((state) => state.userPermissionInfo);

  const userPermissionIds = useRolePermissionStore((state) => state.userPermissionIds);

  const userPermissionUserId = useRolePermissionStore((state) => state.userPermissionUserId);

  const userPermissionLoading = useRolePermissionStore((state) => state.userPermissionLoading);

  const Fetch_System_Permission_Options = useRolePermissionStore((state) => state.Fetch_System_Permission_Options);

  const Fetch_Company_Options = useRolePermissionStore((state) => state.Fetch_Company_Options);

  const Fetch_Department_Options = useRolePermissionStore((state) => state.Fetch_Department_Options);

  const Fetch_Role_User_Options = useRolePermissionStore((state) => state.Fetch_Role_User_Options);

  const Fetch_Role_User_Info_By_Id = useRolePermissionStore((state) => state.Fetch_Role_User_Info_By_Id);

  const Get_Role_By_Id = useRolePermissionStore((state) => state.Get_Role_By_Id);

  const Create_Role = useRolePermissionStore((state) => state.Create_Role);

  const Update_Role = useRolePermissionStore((state) => state.Update_Role);

  const Clear_Role_Detail = useRolePermissionStore((state) => state.Clear_Role_Detail);

  const Clear_Department_Options = useRolePermissionStore((state) => state.Clear_Department_Options);

  const Clear_User_Permission_Info = useRolePermissionStore((state) => state.Clear_User_Permission_Info);

  const roleUserId = useMemo(() => {
    return normalizeId(
      roleDetail?.userId || roleDetail?.user || roleDetail?.assignedUser || roleDetail?.staff || roleDetail?.employee
    );
  }, [roleDetail]);

  const currentUserObject = useMemo(() => {
    const roleUser =
      roleDetail?.userId || roleDetail?.user || roleDetail?.assignedUser || roleDetail?.staff || roleDetail?.employee;

    if (roleUser && typeof roleUser === 'object') {
      return roleUser;
    }

    const infoUser =
      userPermissionInfo?.user ||
      userPermissionInfo?.userId ||
      userPermissionInfo?.employee ||
      userPermissionInfo?.staff;

    if (infoUser && typeof infoUser === 'object') {
      return infoUser;
    }

    if (
      userPermissionInfo?.username ||
      userPermissionInfo?.firstName ||
      userPermissionInfo?.lastName ||
      userPermissionInfo?.staffCode ||
      userPermissionInfo?.email
    ) {
      return userPermissionInfo;
    }

    return null;
  }, [roleDetail, userPermissionInfo]);

  const userSelectOptions = useMemo(() => {
    const options = toOptions(userOptions, selectedUserId);

    const currentId = normalizeId(selectedUserId) || roleUserId;

    /*
     * The options API may remove users who already
     * have a role. Add the edit user manually so the
     * Select can still display a value.
     */
    if (currentId && !options.some((option) => option.value === currentId)) {
      options.unshift({
        value: currentId,
        label: getLabel(currentUserObject) || currentId,
        disabled: false,
      });
    }

    return options;
  }, [userOptions, selectedUserId, roleUserId, currentUserObject]);

  /*
   * These permission IDs come from:
   *
   * GET /group-permission/role/user-info/:userId
   *
   * They must be disabled during both create and edit.
   */
  const disabledPermissionIds = useMemo(() => {
    const selectedId = normalizeId(selectedUserId);

    if (!selectedId || selectedId !== userPermissionUserId) {
      return [];
    }

    return userPermissionIds.map(normalizeId).filter(Boolean);
  }, [selectedUserId, userPermissionIds, userPermissionUserId]);

  const checkingUserPermissions = useMemo(() => {
    const selectedId = normalizeId(selectedUserId);

    return Boolean(selectedId) && selectedId === userPermissionUserId && userPermissionLoading;
  }, [selectedUserId, userPermissionUserId, userPermissionLoading]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        await Promise.all([
          Fetch_System_Permission_Options({
            access_token,
          }),
          Fetch_Company_Options({
            access_token,
          }),
          Fetch_Role_User_Options({
            access_token,
          }),
        ]);
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    };

    loadOptions();

    return () => {
      checkedEditUserRef.current = null;

      Clear_Role_Detail();
      Clear_Department_Options();
      Clear_User_Permission_Info();
    };
  }, [
    access_token,
    Fetch_System_Permission_Options,
    Fetch_Company_Options,
    Fetch_Role_User_Options,
    Clear_Role_Detail,
    Clear_Department_Options,
    Clear_User_Permission_Info,
  ]);

  useEffect(() => {
    if (!roleId) return;

    const loadRole = async () => {
      try {
        await Get_Role_By_Id({
          access_token,
          doc: {
            id: roleId,
          },
        });
      } catch (error) {
        message.error(getErrorMessage(error));
      }
    };

    loadRole();
  }, [access_token, roleId, Get_Role_By_Id]);

  /*
   * Edit mode:
   *
   * 1. Fill the role form.
   * 2. Check permissions saved in the role.
   * 3. Fetch all existing permissions for roleDetail.userId.
   * 4. Disable permissions returned by the employee-info API.
   */
  useEffect(() => {
    if (!isEdit || !roleDetail) return;

    const company = normalizeId(roleDetail.company);

    const department = normalizeId(roleDetail.department);

    const userId = normalizeId(
      roleDetail.userId || roleDetail.user || roleDetail.assignedUser || roleDetail.staff || roleDetail.employee
    );

    const rolePermissions = (roleDetail.permissions || []).map(normalizeId).filter(Boolean);

    form.setFieldsValue({
      name: roleDetail.name || roleDetail.title || '',
      userId,
      company,
      department,
      description: roleDetail.description || '',
    });

    /*
     * These permissions belong to the role being edited.
     * They are submitted again during update.
     */
    setPermissionIds(rolePermissions);

    if (company) {
      Fetch_Department_Options({
        access_token,
        doc: {
          company,
        },
      }).catch((error) => {
        message.error(getErrorMessage(error));
      });
    }

    if (userId) {
      const requestKey = `${roleId || ''}:${userId}`;

      if (checkedEditUserRef.current !== requestKey) {
        checkedEditUserRef.current = requestKey;

        Fetch_Role_User_Info_By_Id({
          access_token,
          doc: {
            userId,
          },
        }).catch((error) => {
          message.error(getErrorMessage(error));
        });
      }
    }
  }, [access_token, form, isEdit, roleId, roleDetail, Fetch_Department_Options, Fetch_Role_User_Info_By_Id]);

  /*
   * Create mode only:
   *
   * If the user selected a permission before the
   * employee-info request finished, remove that permission
   * when the API says the employee already owns it.
   *
   * Do not run this during edit because role permissions
   * must remain inside permissionIds for the update payload.
   */
  useEffect(() => {
    if (isEdit || !disabledPermissionIds.length) {
      return;
    }

    const disabledSet = new Set(disabledPermissionIds);

    setPermissionIds((current) =>
      current.filter((permissionId) => {
        const id = normalizeId(permissionId);

        return !disabledSet.has(id);
      })
    );
  }, [isEdit, disabledPermissionIds]);

  const handleUserChange = async (userId) => {
    /*
     * Clear permissions selected for the previous employee.
     */
    setPermissionIds([]);
    Clear_User_Permission_Info();

    if (!userId) {
      return;
    }

    try {
      await Fetch_Role_User_Info_By_Id({
        access_token,
        doc: {
          userId,
        },
      });
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const handleCompanyChange = (company) => {
    form.setFieldValue('department', undefined);

    Clear_Department_Options();

    if (!company) {
      return;
    }

    Fetch_Department_Options({
      access_token,
      doc: {
        company,
      },
    }).catch((error) => {
      message.error(getErrorMessage(error));
    });
  };

  const handleSubmit = async (values) => {
    if (!values.userId) {
      message.error('Please select user');
      return;
    }

    if (!permissionIds.length) {
      message.error('Please select at least one permission');
      return;
    }

    /*
     * Important:
     *
     * disabledPermissionIds are not merged into this payload.
     *
     * Some disabled permissions may belong to another role.
     * Only the current role permissionIds are submitted.
     */
    const doc = {
      name: values.name,
      company: values.company,
      department: values.department,
      description: values.description || '',
      permissions: [...new Set(permissionIds.map(normalizeId).filter(Boolean))],
    };

    if (!isEdit) {
      doc.userId = values.userId;
    }

    try {
      if (isEdit) {
        await Update_Role({
          access_token,
          doc: {
            id: roleId,
            formData: doc,
          },
        });

        message.success('Role updated successfully');
      } else {
        await Create_Role({
          access_token,
          doc: {
            ...doc,
            userId: values.userId,
          },
        });

        message.success('Role created successfully');
      }

      onDone?.();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div className="rounded-md p-7">
      <Form id={formId} form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            label="Title"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input title',
              },
            ]}>
            <Input placeholder="title" />
          </Form.Item>

          <Form.Item
            label="User"
            name="userId"
            rules={[
              {
                required: true,
                message: 'Please select user',
              },
            ]}>
            <Select
              showSearch
              allowClear={!isEdit}
              disabled={isEdit}
              loading={optionLoading || checkingUserPermissions}
              placeholder="user"
              options={userSelectOptions}
              optionFilterProp="label"
              onChange={handleUserChange}
            />
          </Form.Item>

          <Form.Item
            label="Company"
            name="company"
            rules={[
              {
                required: true,
                message: 'Please select company',
              },
            ]}>
            <Select
              showSearch
              allowClear
              loading={optionLoading}
              placeholder="company"
              options={toOptions(companyOptions)}
              optionFilterProp="label"
              onChange={handleCompanyChange}
            />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: 'Please select department',
              },
            ]}>
            <Select
              showSearch
              allowClear
              loading={optionLoading}
              placeholder="department"
              options={toOptions(departmentOptions)}
              optionFilterProp="label"
            />
          </Form.Item>
        </div>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="description" rows={5} />
        </Form.Item>

        <div className="mb-2 mt-6 border-b pb-2 font-semibold text-gray-700">Permissions</div>

        <PermissionPanel
          groups={permissionGroups}
          selectedPermissions={permissionIds}
          disabledPermissions={disabledPermissionIds}
          loading={checkingUserPermissions}
          onPermissionChange={setPermissionIds}
        />
      </Form>
    </div>
  );
};

export default RoleForm;
