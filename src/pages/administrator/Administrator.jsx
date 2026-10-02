import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Button, Input, Tabs, Breadcrumb, Modal, message, Space } from 'antd';

import { SearchOutlined, HomeOutlined } from '@ant-design/icons';

import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';
import { useUserManagementStore } from '../../stores/Administrator/userManagement.store';
import { useRolePermissionStore } from '../../stores/Administrator/rolePermission.store';
import { useModulePermissionStore } from '../../stores/Administrator/modulePermission.store';

import GroupBtn from 'components/GroupBtn';
import AdminHeader from './components/AdminHeader';
import AdminList from './components/AdminList';
import AssignUserCoreModal from './components/AssignUserCoreModal';
import UserForm from './forms/UserForm';
import RoleForm from './forms/RoleForm';
import ModuleForm from './forms/ModuleForm';

const getId = (item) => {
  if (!item) return undefined;

  if (typeof item === 'object') {
    return item._id || item.id || item.value;
  }

  return item;
};

const toBoolean = (value) => {
  return value === true || value === 1 || value === '1' || value === 'true';
};

const getText = (value) => {
  if (!value) return '';

  if (typeof value === 'object') {
    return value.name || value.title || value.label || value.username || value.system || value.detail || '';
  }

  return value;
};

const getFullName = (item) => {
  if (item?.name) {
    return item.name;
  }

  return `${item?.firstName || ''} ${item?.lastName || ''}`.trim();
};

const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';
};

const capitalize = (value) => {
  const text = String(value || '');

  return text.charAt(0).toUpperCase() + text.slice(1);
};

const Administrator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { access_token } = useContext(AuthContext);

  const { collapsed } = useOutletContext() || {};

  const { setContent } = useContent();

  const [search, setSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userSize, setUserSize] = useState(10);
  const [openAssignCore, setOpenAssignCore] = useState(false);

  const pathname = location.pathname;

  const tab = pathname.includes('/role') ? 'role' : pathname.includes('/module') ? 'module' : 'user';

  const isAdd = pathname.includes('/add');
  const isEdit = pathname.includes('/edit');
  const isForm = isAdd || isEdit;
  const mode = isForm ? tab : 'list';

  const editId = isEdit ? pathname.split('/').filter(Boolean).pop() : null;

  const users = useUserManagementStore((state) => state.users);

  const userDetail = useUserManagementStore((state) => state.userDetail);

  const userLoading = useUserManagementStore((state) => state.userLoading);

  const userSaving = useUserManagementStore((state) => state.userSaving);

  const userRemovingCore = useUserManagementStore((state) => state.userRemovingCore);

  const userTotal = useUserManagementStore((state) => state.userTotal);

  const Fetch_User_List = useUserManagementStore((state) => state.Fetch_User_List);

  const Remove_User_From_Core = useUserManagementStore((state) => state.Remove_User_From_Core);

  const roles = useRolePermissionStore((state) => state.roles);

  const roleLoading = useRolePermissionStore((state) => state.roleLoading);

  const roleSaving = useRolePermissionStore((state) => state.roleSaving);

  const Fetch_Role_List = useRolePermissionStore((state) => state.Fetch_Role_List);

  const Remove_Role = useRolePermissionStore((state) => state.Remove_Role);

  const moduleList = useModulePermissionStore((state) => state.modules);

  const moduleLoading = useModulePermissionStore((state) => state.moduleLoading);

  const moduleSaving = useModulePermissionStore((state) => state.moduleSaving);

  const Fetch_Module_List = useModulePermissionStore((state) => state.Fetch_Module_List);

  const Remove_Module = useModulePermissionStore((state) => state.Remove_Module);

  const fetchCurrentUserList = useCallback(async () => {
    return Fetch_User_List({
      access_token,
      doc: {
        search,
        page: userPage,
        size: userSize,
      },
    });
  }, [access_token, search, userPage, userSize, Fetch_User_List]);

  const executeRemoveUserFromCore = useCallback(
    async (record, { navigateAfterRemove = false } = {}) => {
      const userId = getId(record) || editId;

      if (!userId) {
        message.error('User ID was not found');
        return;
      }

      try {
        await Remove_User_From_Core({
          access_token,
          doc: {
            id: userId,
          },
        });

        message.success('User removed from System Core successfully');

        if (navigateAfterRemove) {
          navigate('/administrator/user');
          return;
        }

        await fetchCurrentUserList();
      } catch (error) {
        message.error(getErrorMessage(error));

        throw error;
      }
    },
    [access_token, editId, navigate, fetchCurrentUserList, Remove_User_From_Core]
  );

  const handleRemoveUserFromCore = useCallback(
    (record) => {
      const userName = record?.username || record?.fullName || 'this user';

      Modal.confirm({
        title: 'Remove user from System Core',
        content: (
          <div>
            Are you sure you want to remove <strong>{userName}</strong> from System Core?
          </div>
        ),
        okText: 'Remove',
        cancelText: 'Cancel',
        okButtonProps: {
          danger: true,
        },
        onOk: () => executeRemoveUserFromCore(record),
      });
    },
    [executeRemoveUserFromCore]
  );

  useEffect(() => {
    setContent(
      <div className="flex w-full items-center justify-between gap-3">
        {mode !== 'list' && (
          <AdminHeader
            title={`${isEdit ? 'Edit' : 'Add'} ${capitalize(mode)}`}
            form
            formId={`${mode}-form`}
            loading={
              (mode === 'user' && userSaving) || (mode === 'role' && roleSaving) || (mode === 'module' && moduleSaving)
            }
            removeCoreLoading={userRemovingCore}
            showRemoveFromCore={mode === 'user' && isEdit && toBoolean(userDetail?.systemCore)}
            onRemoveFromCore={
              mode === 'user' && isEdit
                ? () =>
                    executeRemoveUserFromCore(
                      userDetail || {
                        _id: editId,
                      },
                      {
                        navigateAfterRemove: true,
                      }
                    )
                : undefined
            }
            onBack={() => navigate(`/administrator/${mode}`)}
          />
        )}

        <GroupBtn collapsed={collapsed} />

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined className="cursor-pointer" onClick={() => navigate('/dashboard')} />,
            },
            {
              title: mode === 'list' ? 'Administrator' : `${isEdit ? 'Edit' : 'Add'} ${capitalize(mode)}`,
            },
          ]}
        />
      </div>
    );
  }, [
    collapsed,
    editId,
    executeRemoveUserFromCore,
    isEdit,
    mode,
    moduleSaving,
    navigate,
    roleSaving,
    setContent,
    userDetail,
    userRemovingCore,
    userSaving,
  ]);

  useEffect(() => {
    if (isForm) return;

    const timer = setTimeout(() => {
      if (tab === 'user') {
        fetchCurrentUserList();
      }

      if (tab === 'role') {
        Fetch_Role_List({
          access_token,
          doc: {
            search,
          },
        });
      }

      if (tab === 'module') {
        Fetch_Module_List({
          access_token,
          doc: {
            search,
          },
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [access_token, search, tab, isForm, fetchCurrentUserList, Fetch_Role_List, Fetch_Module_List]);

  const userRows = useMemo(() => {
    return users.map((item, index) => ({
      ...item,
      key: getId(item) || index,
      no: (userPage - 1) * userSize + index + 1,
      username: item.username || '',
      staffCode: item.staffCode || '',
      fullName: getFullName(item),
      gender: item.gender || '',
      status: item.status || '',
      isAdmin: toBoolean(item.isAdmin),
      systemCore: toBoolean(item.systemCore),
      systemApp: toBoolean(item.systemApp),
    }));
  }, [users, userPage, userSize]);

  const roleRows = useMemo(() => {
    return roles.map((item, index) => {
      const user = item.userId || item.user || item.assignedUser || item.staff || item.employee;

      return {
        ...item,
        key: getId(item) || index,
        no: index + 1,
        title: item.name || item.title || '',
        user: getText(user),
        company: getText(item.company),
        department: getText(item.department),
        description: item.description || '',
        permissionCount: Array.isArray(item.permissions) ? item.permissions.length : 0,
      };
    });
  }, [roles]);

  const moduleRows = useMemo(() => {
    return moduleList.map((item, index) => ({
      ...item,
      key: getId(item) || index,
      no: index + 1,
      title: item.name || item.title || '',
      company: getText(item.company),
      department: getText(item.department),
      description: item.description || '',
      permissionCount: Array.isArray(item.permissions) ? item.permissions.length : 0,
    }));
  }, [moduleList]);

  const currentData = useMemo(() => {
    if (tab === 'user') {
      return userRows;
    }

    if (tab === 'role') {
      return roleRows;
    }

    if (tab === 'module') {
      return moduleRows;
    }

    return [];
  }, [tab, userRows, roleRows, moduleRows]);

  const handleDeleteRole = (record) => {
    Modal.confirm({
      title: 'Delete role',
      content: `Are you sure you want to delete "${record?.title}"?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await Remove_Role({
            access_token,
            doc: {
              id: getId(record),
            },
          });

          message.success('Role deleted successfully');

          await Fetch_Role_List({
            access_token,
            doc: {
              search,
            },
          });
        } catch (error) {
          message.error(getErrorMessage(error));

          throw error;
        }
      },
    });
  };

  const handleDeleteModule = (record) => {
    Modal.confirm({
      title: 'Delete module',
      content: `Are you sure you want to delete "${record?.title}"?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await Remove_Module({
            access_token,
            doc: {
              id: getId(record),
            },
          });

          message.success('Module deleted successfully');

          await Fetch_Module_List({
            access_token,
            doc: {
              search,
            },
          });
        } catch (error) {
          message.error(getErrorMessage(error));

          throw error;
        }
      },
    });
  };

  const renderForm = () => {
    if (mode === 'user') {
      return (
        <UserForm formId="user-form" userId={editId} isEdit={isEdit} onDone={() => navigate('/administrator/user')} />
      );
    }

    if (mode === 'role') {
      return (
        <RoleForm formId="role-form" roleId={editId} isEdit={isEdit} onDone={() => navigate('/administrator/role')} />
      );
    }

    if (mode === 'module') {
      return (
        <ModuleForm
          formId="module-form"
          moduleId={editId}
          isEdit={isEdit}
          onDone={() => navigate('/administrator/module')}
        />
      );
    }

    return null;
  };

  if (mode !== 'list') {
    return <div className="min-h-screen p-2">{renderForm()}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="rounded-md py-5">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:w-[50%]">
            <Input
              allowClear
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setUserPage(1);
              }}
              prefix={<SearchOutlined className="text-blue-500" />}
              placeholder={`Search ${tab}`}
            />
          </div>

          <Space>
            {tab === 'user' && <Button onClick={() => setOpenAssignCore(true)}>Assign User To Core</Button>}

            <Button type="primary" onClick={() => navigate(`/administrator/${tab}/add`)}>
              Add
            </Button>
          </Space>
        </div>

        <Tabs
          activeKey={tab}
          onChange={(key) => {
            setSearch('');
            setUserPage(1);

            navigate(`/administrator/${key}`);
          }}
          items={[
            {
              key: 'user',
              label: 'User',
            },
            {
              key: 'role',
              label: 'Role',
            },
            {
              key: 'module',
              label: 'Module',
            },
          ]}
        />

        <AdminList
          type={tab}
          data={currentData}
          loading={
            (tab === 'user' && userLoading) || (tab === 'role' && roleLoading) || (tab === 'module' && moduleLoading)
          }
          pagination={
            tab === 'user'
              ? {
                  current: userPage,
                  pageSize: userSize,
                  total: userTotal || users.length,
                  showSizeChanger: true,
                }
              : {
                  pageSize: 10,
                }
          }
          onTableChange={(pagination) => {
            if (tab !== 'user') return;

            setUserPage(pagination.current || 1);

            setUserSize(pagination.pageSize || 10);
          }}
          onEdit={(record) => {
            const recordId = getId(record);

            if (!recordId) {
              message.error('Record ID was not found');
              return;
            }

            if (tab === 'user') {
              navigate(`/administrator/user/edit/${recordId}`);
            }

            if (tab === 'role') {
              navigate(`/administrator/role/edit/${recordId}`);
            }

            if (tab === 'module') {
              navigate(`/administrator/module/edit/${recordId}`);
            }
          }}
          onRemoveFromCore={tab === 'user' ? handleRemoveUserFromCore : undefined}
          onDelete={tab === 'role' ? handleDeleteRole : tab === 'module' ? handleDeleteModule : undefined}
        />

        <AssignUserCoreModal
          open={openAssignCore}
          onClose={() => setOpenAssignCore(false)}
          onDone={fetchCurrentUserList}
        />
      </div>
    </div>
  );
};

export default Administrator;
