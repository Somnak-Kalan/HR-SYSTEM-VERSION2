import React from 'react';
import { DownloadOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { getFile } from '../../../utils/helpFuntions';

const downloadBlob = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(blobUrl);
  document.body.removeChild(a);
};

export default function FileActions({ file, filename, onEdit, isArray = false }) {
  const openFile = (f) => {
    if (!f) return;
    window.open(getFile(f), '_blank');
  };

  const onDownload = async (f) => {
    if (!f) return;
    await downloadBlob(getFile(f), filename);
  };

  return (
    <div className="flex justify-between" style={{ alignSelf: 'center', alignItems: 'center' }}>
      <div className="mx-2">
        {!isArray && file ? (
          <>
            <button
              onClick={() => openFile(file)}
              style={{
                cursor: 'pointer',
                boxShadow: 'rgba(9,30,66,0.25) 0px 1px 1px, rgba(9,30,66,0.13) 0px 0px 1px 1px',
              }}
              className="bg-white border-none py-1 px-5 text-gray-700">
              <EyeOutlined style={{ color: 'blue' }} />
            </button>
            <button
              onClick={() => onDownload(file)}
              style={{
                cursor: 'pointer',
                boxShadow: 'rgba(9,30,66,0.25) 0px 1px 1px, rgba(9,30,66,0.13) 0px 0px 1px 1px',
              }}
              className="bg-white border-none py-1 px-5 text-gray-700">
              <DownloadOutlined style={{ color: 'red' }} />
            </button>
          </>
        ) : null}

        {isArray && Array.isArray(file)
          ? file.map((f, i) => (
              <span key={i} className="mx-2">
                {f ? (
                  <>
                    <button
                      onClick={() => openFile(f)}
                      style={{
                        cursor: 'pointer',
                        boxShadow: 'rgba(9,30,66,0.25) 0px 1px 1px, rgba(9,30,66,0.13) 0px 0px 1px 1px',
                      }}
                      className="bg-white border-none py-1 px-2 text-gray-700">
                      <EyeOutlined style={{ color: 'blue' }} />
                    </button>
                    <button
                      onClick={() => onDownload(f)}
                      style={{
                        cursor: 'pointer',
                        boxShadow: 'rgba(9,30,66,0.25) 0px 1px 1px, rgba(9,30,66,0.13) 0px 0px 1px 1px',
                      }}
                      className="bg-white border-none py-1 px-2 text-gray-700">
                      <DownloadOutlined style={{ color: 'red' }} />
                    </button>
                  </>
                ) : null}
              </span>
            ))
          : null}
      </div>

      <div>
        <button
          onClick={onEdit}
          style={{ cursor: 'pointer', boxShadow: 'rgba(9,30,66,0.25) 0px 1px 1px, rgba(9,30,66,0.13) 0px 0px 1px 1px' }}
          className="bg-white border-none py-1 px-2 text-gray-700">
          <FormOutlined style={{ color: 'green' }} />
        </button>
      </div>
    </div>
  );
}
