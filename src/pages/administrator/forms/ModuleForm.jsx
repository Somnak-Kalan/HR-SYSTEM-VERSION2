import { useContext, useEffect, useState } from 'react';
import { Form, Input, Select, message } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { useModulePermissionStore } from '../../../stores/Administrator/modulePermission.store';
import PermissionPanel from '../components/PermissionPanel';

const getId = (item) => {
  if (!item) return undefined;
  if (typeof item === 'object') return item._id || item.id || item.value;
  return item;
};

const getLabel = (item) => {
  if (!item) return '';

  if (typeof item === 'object') {
    return item.name || item.title || item.label || item.system || item.detail || '';
  }

  return item;
};

const toOptions = (list) => {
  return (list || []).map((item) => ({
    value: getId(item),
    label: getLabel(item),
  }));
};

const ModuleForm = ({ formId = 'module-form', moduleId, isEdit = false, onDone }) => {
  const [form] = Form.useForm();
  const { access_token } = useContext(AuthContext);
  const [permissionIds, setPermissionIds] = useState([]);

  const permissionGroups = useModulePermissionStore((s) => s.permissionGroups);
  const companyOptions = useModulePermissionStore((s) => s.companyOptions);
  const departmentOptions = useModulePermissionStore((s) => s.departmentOptions);
  const moduleDetail = useModulePermissionStore((s) => s.moduleDetail);
  const optionLoading = useModulePermissionStore((s) => s.optionLoading);

  const Fetch_System_Permission_Options = useModulePermissionStore((s) => s.Fetch_System_Permission_Options);
  const Fetch_Company_Options = useModulePermissionStore((s) => s.Fetch_Company_Options);
  const Fetch_Department_Options = useModulePermissionStore((s) => s.Fetch_Department_Options);
  const Get_Module_By_Id = useModulePermissionStore((s) => s.Get_Module_By_Id);
  const Create_Module = useModulePermissionStore((s) => s.Create_Module);
  const Update_Module = useModulePermissionStore((s) => s.Update_Module);
  const Clear_Module_Detail = useModulePermissionStore((s) => s.Clear_Module_Detail);

  useEffect(() => {
    Fetch_System_Permission_Options({ access_token });
    Fetch_Company_Options({ access_token });

    return () => Clear_Module_Detail();
  }, [Clear_Module_Detail, Fetch_Company_Options, Fetch_System_Permission_Options, access_token]);

  useEffect(() => {
    if (!moduleId) return;

    Get_Module_By_Id({
      access_token,
      doc: { id: moduleId },
    });
  }, [Get_Module_By_Id, access_token, moduleId]);

  useEffect(() => {
    if (!isEdit || !moduleDetail) return;

    const company = getId(moduleDetail.company);
    const department = getId(moduleDetail.department);
    const permissions = (moduleDetail.permissions || []).map(getId).filter(Boolean);

    form.setFieldsValue({
      name: moduleDetail.name || '',
      company,
      department,
      description: moduleDetail.description || '',
    });

    setPermissionIds(permissions);

    if (company) {
      Fetch_Department_Options({
        access_token,
        doc: { company },
      });
    }
  }, [Fetch_Department_Options, access_token, form, isEdit, moduleDetail]);

  const handleCompanyChange = (company) => {
    form.setFieldValue('department', undefined);

    if (company) {
      Fetch_Department_Options({
        access_token,
        doc: { company },
      });
    }
  };

  const handleSubmit = async (values) => {
    if (!permissionIds.length) {
      message.error('Please select permission');
      return;
    }

    const doc = {
      name: values.name,
      company: values.company,
      department: values.department,
      description: values.description || '',
      permissions: permissionIds,
    };

    if (isEdit) {
      await Update_Module({
        access_token,
        doc: {
          id: moduleId,
          formData: doc,
        },
      });

      message.success('Module updated successfully');
    } else {
      await Create_Module({
        access_token,
        doc,
      });

      message.success('Module created successfully');
    }

    onDone?.();
  };

  return (
    <div className="rounded-md ">
      <Form id={formId} form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item label="Title" name="name" rules={[{ required: true, message: 'Please input title' }]}>
            <Input placeholder="title" />
          </Form.Item>

          <Form.Item label="Company" name="company" rules={[{ required: true, message: 'Please select company' }]}>
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
            rules={[{ required: true, message: 'Please select department' }]}>
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

        <div className="mb-2 mt-6 border-b pb-2 font-semibold ">Permissions</div>

        <PermissionPanel
          groups={permissionGroups}
          selectedPermissions={permissionIds}
          // disabledPermissions={isEdit ? permissionIds : []}
          onPermissionChange={setPermissionIds}
        />
      </Form>
    </div>
  );
};

export default ModuleForm;
