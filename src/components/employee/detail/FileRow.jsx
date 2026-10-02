import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography, message, Tooltip, Tag } from 'antd';
import { getFile } from '../../../utils/helpFuntions';

const { Text } = Typography;

const getFilePath = (file) => {
  if (!file) return '';

  if (typeof file === 'string') return file;

  return file?.path || file?.url || file?.file || file?.fileUrl || file?.file_url || file?.src || '';
};

const getOriginalFileName = (file) => {
  const path = getFilePath(file);

  if (!path) return 'file';

  const cleanPath = String(path).split('?')[0];
  const parts = cleanPath.split('/');

  try {
    return decodeURIComponent(parts[parts.length - 1] || 'file');
  } catch {
    return parts[parts.length - 1] || 'file';
  }
};

const getDisplayFileName = (file) => {
  const originalName = getOriginalFileName(file);

  if (!originalName) return 'File';

  const lastDotIndex = originalName.lastIndexOf('.');
  const hasExtension = lastDotIndex > -1;

  const nameOnly = hasExtension ? originalName.slice(0, lastDotIndex) : originalName;

  const extension = hasExtension ? originalName.slice(lastDotIndex) : '';

  // Remove upload timestamp/id prefix:
  // 1782870499832Special Rage.png -> Special Rage.png
  // 17824586787571743127879238request_material_form.pdf -> request_material_form.pdf
  const cleanedName = nameOnly
    .replace(/^\d+/, '')
    .replace(/^[-_\s]+/, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!cleanedName) return `File${extension}`;

  return `${cleanedName}${extension}`;
};

const getFileExtension = (file) => {
  const name = getOriginalFileName(file);
  const ext = name.split('.').pop();

  if (!ext || ext === name) return 'FILE';

  return ext.toUpperCase();
};

const getFileIcon = (file) => {
  const ext = getFileExtension(file).toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return <FileImageOutlined style={{ fontSize: 22, color: '#1677ff' }} />;
  }

  if (ext === 'pdf') {
    return <FilePdfOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />;
  }

  return <FileOutlined style={{ fontSize: 22, color: '#64748b' }} />;
};

const openFile = (file) => {
  const path = getFilePath(file);
  const url = getFile(path);

  if (!url) return;

  window.open(url, '_blank', 'noopener,noreferrer');
};

const downloadFile = async (file) => {
  const path = getFilePath(file);
  const url = getFile(path);
  const fileName = getDisplayFileName(file);

  if (!url) return;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Download failed');
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log(error);
    message.warning('Cannot download directly. Opening file instead.');

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const normalizeFiles = (file) => {
  if (!file) return [];

  if (Array.isArray(file)) {
    return file.filter(Boolean);
  }

  return [file];
};

const FileActions = ({ file, onEdit }) => {
  if (!file) return null;

  return (
    <Space size={4} wrap>
      <Tooltip title="View file">
        <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => openFile(file)} />
      </Tooltip>

      <Tooltip title="Download file">
        <Button size="small" type="text" icon={<DownloadOutlined />} onClick={() => downloadFile(file)} />
      </Tooltip>

      {onEdit ? (
        <Tooltip title="Update file">
          <Button size="small" type="text" icon={<EditOutlined />} onClick={onEdit} />
        </Tooltip>
      ) : null}
    </Space>
  );
};

const FileRow = (props) => {
  const { label, file, onEdit } = props;

  const files = normalizeFiles(file);

  return (
    <tr>
      <td
        style={{
          border: '1px solid #e5e7eb',
          padding: 10,
          verticalAlign: 'top',
          fontWeight: 600,
          width: 220,
          background: '#fafafa',
        }}>
        {label}
      </td>

      <td
        style={{
          border: '1px solid #e5e7eb',
          padding: 10,
          verticalAlign: 'top',
        }}>
        {files.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {files.map((item, index) => {
              const originalName = getOriginalFileName(item);
              const displayName = getDisplayFileName(item);
              const extension = getFileExtension(item);

              return (
                <div
                  key={`${getFilePath(item)}-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    background: '#ffffff',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 0,
                      flex: 1,
                    }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                      {getFileIcon(item)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <Tooltip title={originalName}>
                        <Text
                          strong
                          style={{
                            display: 'block',
                            maxWidth: 260,
                          }}
                          ellipsis>
                          {displayName}
                        </Text>
                      </Tooltip>

                      <Space size={6} wrap>
                        <Tag style={{ margin: 0 }}>{extension}</Tag>

                        {files.length > 1 ? (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            File {index + 1}
                          </Text>
                        ) : null}
                      </Space>
                    </div>
                  </div>

                  <FileActions file={item} onEdit={onEdit} />
                </div>
              );
            })}
          </div>
        ) : (
          <Text type="secondary">No file uploaded</Text>
        )}
      </td>
    </tr>
  );
};

export default FileRow;
