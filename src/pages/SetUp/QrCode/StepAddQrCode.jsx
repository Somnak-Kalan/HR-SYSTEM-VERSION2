/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Card, Divider, Form, Modal, Steps, message, QRCode, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import AddQrCodeFields from './AddQrCode';
import { useQRCodeStore } from '../../../stores/qrCode.store';

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

const StepAddQrCode = (props) => {
  const { open, setOpen, access_token } = props;

  const [form] = Form.useForm();
  const qrRef = useRef(null);

  const addQRCode = useQRCodeStore((s) => s.addQRCode);
  const btn_loading = useQRCodeStore((s) => s.btn_loading);

  const [current, setCurrent] = useState(0);
  const [qrData, setQrData] = useState(null);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onFinish = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const doc = {
        title: values?.title,
        round: Number(values?.round || 0),
        latitude: Number(values?.latitude),
        longitude: Number(values?.longitude),
      };

      const res = await addQRCode({
        access_token,
        doc,
      });

      const rec = res?.rec || res?.data || res;
      const id = rec?._id || rec?.id;

      if (!id) {
        message.warning({ content: 'add fail' });
        return;
      }

      setQrData({
        id,
        title: rec?.title || values?.title,
      });

      setCurrent(1);
      form.resetFields();
      message.success({ content: res?.message || 'add success' });
    } catch (e) {
      console.log(e);
      message.warning({ content: 'add fail' });
    }
  }, [form, addQRCode, access_token]);

  const onDownload = useCallback(() => {
    const ok = downloadCanvasQRCode(qrRef.current, qrData?.title);

    ok ? message.success({ content: 'download success' }) : message.warning({ content: 'No QR code' });
  }, [qrData]);

  useEffect(() => {
    if (!open) {
      setCurrent(0);
      setQrData(null);
      form.resetFields();
    }
  }, [open, form]);

  const steps = [
    {
      title: 'Add QR Code',
      content: (
        <Form form={form} name="add_qr" autoComplete="off" layout="vertical">
          <AddQrCodeFields />
        </Form>
      ),
    },
    {
      title: 'QR Code',
      content: (
        <Space
          direction="vertical"
          align="center"
          style={{
            width: '100%',
          }}>
          <div ref={qrRef}>
            <QRCode type="canvas" value={qrData?.id || '-'} size={220} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div>
              <strong>{qrData?.title || ''}</strong>
            </div>
            {/* <div
              style={{
                fontSize: 12,
                color: '#888',
                wordBreak: 'break-all',
              }}
            >
              {qrData?.id || ''}
            </div> */}
          </div>

          <Button
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white"
            onClick={onDownload}
            disabled={!qrData?.id}>
            Download QR Code
          </Button>
        </Space>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Modal
      open={open}
      closeIcon={null}
      width={500}
      onCancel={closeModal}
      footer={
        current === 0 ? (
          <Button
            onClick={onFinish}
            loading={btn_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Save
          </Button>
        ) : (
          <Button type="primary" danger onClick={closeModal} className="!bg-red-500 !border-red-500 hover:!bg-red-500">
            Close
          </Button>
        )
      }>
      <Card
        title="Add QR Code"
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
        <Steps current={current} items={items} />
        <Divider />
        {steps[current].content}
      </Card>
    </Modal>
  );
};

export default StepAddQrCode;
