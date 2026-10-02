import { Button, Popconfirm } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserDeleteOutlined } from '@ant-design/icons';

const AdminHeader = ({
  title,
  form,
  formId,
  loading = false,
  removeCoreLoading = false,
  showRemoveFromCore = false,
  onBack,
  onRemoveFromCore,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-md">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} disabled={loading || removeCoreLoading}>
            Back
          </Button>
        )}

        {showRemoveFromCore && typeof onRemoveFromCore === 'function' && (
          <Popconfirm
            title="Remove user from System Core?"
            description="The user will lose System Core access and assigned core modules."
            okText="Remove"
            cancelText="Cancel"
            onConfirm={onRemoveFromCore}
            okButtonProps={{
              danger: true,
              loading: removeCoreLoading,
            }}>
            <Button danger icon={<UserDeleteOutlined />} loading={removeCoreLoading} disabled={loading}>
              Remove from Core
            </Button>
          </Popconfirm>
        )}

        {form && (
          <Button
            type="primary"
            htmlType="submit"
            form={formId}
            loading={loading}
            icon={<SaveOutlined />}
            disabled={removeCoreLoading}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
