import React, { useMemo } from 'react';
import { Card } from 'antd';
import { getFile } from '../../../../utils/ShowImage';

export default function Detail({ document }) {
  const doc = document || {};

  const fileUrl = useMemo(() => {
    const p = doc?.file_path || doc?.file_url;
    return p ? getFile(p) : '';
  }, [doc]);

  return (
    <Card title="Document Details">
      {fileUrl ? (
        <iframe
          title={doc?.file_name || 'document'}
          src={fileUrl}
          width="100%"
          height="520px"
          style={{ border: 'none', borderRadius: 8 }}
        />
      ) : (
        <div className="text-gray-500">No document to preview</div>
      )}

      <div className="mt-3">
        <strong>{doc?.file_name || '---'}</strong>
      </div>
    </Card>
  );
}
