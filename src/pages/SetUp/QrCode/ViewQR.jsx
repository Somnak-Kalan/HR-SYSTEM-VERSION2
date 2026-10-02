import { useRef, useCallback } from 'react';
import { Button, Card, Modal, QRCode, Space, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const getRowId = (row) => row?._id || row?.id;

const downloadCanvasQRCode = (container, filename) => {
  if (!container) return false;

  const canvas = container.querySelector('canvas');

  if (!canvas) return false;

  const link = document.createElement('a');
  link.download = `${filename || 'qr-code'}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

const ViewQR = (props) => {
  const { open, setOpen, propData } = props;

  const qrRef = useRef(null);
  const qrId = getRowId(propData);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onDownload = useCallback(() => {
    const ok = downloadCanvasQRCode(qrRef.current, propData?.title);

    ok ? message.success({ content: 'download success' }) : message.warning({ content: 'No QR code' });
  }, [propData]);

  return (
    <Modal
      open={open}
      closeIcon={null}
      onCancel={closeModal}
      width={500}
      footer={
        <Button type="primary" danger onClick={closeModal}>
          Close
        </Button>
      }>
      <Card
        title="View QR"
        extra={
          <CloseCircleOutlined
            onClick={closeModal}
            className="cursor-pointer"
            style={{
              fontSize: 20,
              color: 'red',
            }}
          />
        }>
        <Space
          direction="vertical"
          align="center"
          style={{
            width: '100%',
          }}>
          <div ref={qrRef}>
            <QRCode type="canvas" value={qrId || '-'} size={220} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div>
              <strong>{propData?.title || ''}</strong>
            </div>

            <div
              style={{
                fontSize: 12,
                color: '#888',
                wordBreak: 'break-all',
              }}>
              {qrId || ''}
            </div>

            <div style={{ fontSize: 12, color: '#888' }}>
              {propData?.latitude && propData?.longitude ? `${propData.latitude}, ${propData.longitude}` : ''}
            </div>
          </div>

          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={onDownload}
            disabled={!qrId}>
            Download QR Code
          </Button>
        </Space>
      </Card>
    </Modal>
  );
};

export default ViewQR;
