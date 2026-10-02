// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState, useCallback, useRef } from 'react'
// import {
//   Button,
//   Card,
//   Divider,
//   Form,
//   Modal,
//   Steps,
//   message,
//   QRCode,
//   Space,
//   Spin,
// } from 'antd'
// import { CloseCircleOutlined } from '@ant-design/icons'
// import UpdateQrCodeForm from './UpdateQrCode'
// import { useQRCodeStore } from '../../../stores/qrCode.store'

// const getRowId = row => row?._id || row?.id

// const downloadCanvasQRCode = (container, filename) => {
//   if (!container) return false

//   const canvas = container.querySelector('canvas')

//   if (!canvas) return false

//   const link = document.createElement('a')
//   link.download = `${filename || 'qr-code'}.png`
//   link.href = canvas.toDataURL('image/png')
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)

//   return true
// }

// const StepUpdateQrCode = props => {
//   const { open, setOpen, access_token, propData } = props

//   const [form] = Form.useForm()
//   const qrRef = useRef(null)

//   const updateQRCode = useQRCodeStore(s => s.updateQRCode)
//   const getQRCodeById = useQRCodeStore(s => s.getQRCodeById)
//   const btn_loading = useQRCodeStore(s => s.btn_loading)
//   const detail_loading = useQRCodeStore(s => s.detail_loading)

//   const [current, setCurrent] = useState(0)
//   const [qrData, setQrData] = useState(null)

//   const closeModal = useCallback(() => {
//     setOpen(false)
//   }, [setOpen])

//   useEffect(() => {
//     if (!open) return

//     const id = getRowId(propData)

//     if (!id) {
//       form.resetFields()
//       return
//     }

//     // show old selected data first, then replace by API detail
//     form.setFieldsValue({
//       id,
//       title: propData?.title || '',
//       latitude: propData?.latitude ?? propData?.Latitude,
//       longitude: propData?.longitude ?? propData?.Longitude,
//       round: propData?.round,
//     })

//     ;(async () => {
//       const rec = await getQRCodeById({
//         access_token,
//         id,
//       })

//       if (!rec) {
//         message.warning({ content: 'Cannot get QR detail' })
//         return
//       }

//       form.setFieldsValue({
//         id: getRowId(rec),
//         title: rec?.title || '',
//         latitude: rec?.latitude ?? rec?.Latitude,
//         longitude: rec?.longitude ?? rec?.Longitude,
//         round: rec?.round,
//       })
//     })()
//   }, [open, propData, access_token, getQRCodeById, form])

//   const onFinish = useCallback(async () => {
//     try {
//       const values = await form.validateFields()
//       const id = values?.id

//       if (!id) {
//         message.warning({ content: 'No QR selected' })
//         return
//       }

//       const doc = {
//         title: values?.title,
//         round: Number(values?.round || 0),
//         latitude: Number(values?.latitude),
//         longitude: Number(values?.longitude),
//       }

//       const res = await updateQRCode({
//         access_token,
//         id,
//         doc,
//       })

//       if (!res) {
//         message.warning({ content: 'update fail' })
//         return
//       }

//       const rec = res?.rec || res?.data || res
//       const qrId = rec?._id || rec?.id || id

//       setQrData({
//         id: qrId,
//         title: rec?.title || values?.title,
//       })

//       setCurrent(1)

//       message.success({
//         content: res?.message || 'update success',
//       })
//     } catch (e) {
//       console.log(e)
//       message.warning({ content: 'update fail' })
//     }
//   }, [form, updateQRCode, access_token])

//   const onDownload = useCallback(() => {
//     const ok = downloadCanvasQRCode(qrRef.current, qrData?.title)

//     ok
//       ? message.success({ content: 'download success' })
//       : message.warning({ content: 'No QR code' })
//   }, [qrData])

//   useEffect(() => {
//     if (!open) {
//       setCurrent(0)
//       setQrData(null)
//       form.resetFields()
//     }
//   }, [open, form])

//   const steps = [
//     {
//       title: 'Update QR Code',
//       content: detail_loading ? (
//         <div style={{ textAlign: 'center', padding: 30 }}>
//           <Spin />
//         </div>
//       ) : (
//         <UpdateQrCodeForm form={form} />
//       ),
//     },
//     {
//       title: 'QR Code',
//       content: (
//         <Space
//           direction='vertical'
//           align='center'
//           style={{
//             width: '100%',
//           }}
//         >
//           <div ref={qrRef}>
//             <QRCode type='canvas' value={qrData?.id || '-'} size={220} />
//           </div>

//           <div style={{ textAlign: 'center' }}>
//             <div>
//               <strong>{qrData?.title || ''}</strong>
//             </div>

//             <div
//               style={{
//                 fontSize: 12,
//                 color: '#888',
//                 wordBreak: 'break-all',
//               }}
//             >
//               {qrData?.id || ''}
//             </div>
//           </div>

//           <Button
//             type='primary'
//             style={{ background: '#1677ff' }}
//             className='cursor-pointer text-white'
//             onClick={onDownload}
//             disabled={!qrData?.id}
//           >
//             Download QR Code
//           </Button>
//         </Space>
//       ),
//     },
//   ]

//   const items = steps.map(item => ({
//     key: item.title,
//     title: item.title,
//   }))

//   return (
//     <Modal
//       open={open}
//       closeIcon={null}
//       width={500}
//       onCancel={closeModal}
//       footer={
//         current === 0 ? (
//           <Button
//             onClick={onFinish}
//             loading={btn_loading}
//             disabled={detail_loading}
//             type='primary'
//             style={{ background: '#1677ff' }}
//             className='cursor-pointer text-white'
//           >
//             Update
//           </Button>
//         ) : (
//           <Button
//             onClick={closeModal}
//             type='primary'
//             danger
//             className='!bg-red-500 !border-red-500 hover:!bg-red-500'
//           >
//             Close
//           </Button>
//         )
//       }
//     >
//       <Card
//         title='Update QR Code'
//         extra={
//           <CloseCircleOutlined
//             onClick={closeModal}
//             className='cursor-pointer'
//             style={{
//               fontSize: 20,
//               color: 'red',
//             }}
//           />
//         }
//       >
//         <Steps current={current} items={items} />
//         <Divider />
//         {steps[current].content}
//       </Card>
//     </Modal>
//   )
// }

// export default StepUpdateQrCode
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Card, Divider, Form, Modal, Steps, message, QRCode, Space, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import UpdateQrCodeForm from './UpdateQrCode';
import { useQRCodeStore } from '../../../stores/qrCode.store';

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

const StepUpdateQrCode = (props) => {
  const { open, setOpen, access_token, propData } = props;

  const [form] = Form.useForm();
  const qrRef = useRef(null);

  const loadedIdRef = useRef(null);
  const loadingIdRef = useRef(null);

  const updateQRCode = useQRCodeStore((s) => s.updateQRCode);
  const getQRCodeById = useQRCodeStore((s) => s.getQRCodeById);
  const btn_loading = useQRCodeStore((s) => s.btn_loading);
  const detail_loading = useQRCodeStore((s) => s.detail_loading);

  const [current, setCurrent] = useState(0);
  const [qrData, setQrData] = useState(null);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;

    const id = getRowId(propData);

    if (!id) {
      form.resetFields();
      return;
    }

    // stop duplicate request for same id
    if (loadedIdRef.current === id || loadingIdRef.current === id) {
      return;
    }

    loadedIdRef.current = id;
    loadingIdRef.current = id;

    // show selected row data first
    form.setFieldsValue({
      id,
      title: propData?.title || '',
      latitude: propData?.latitude ?? propData?.Latitude,
      longitude: propData?.longitude ?? propData?.Longitude,
      round: propData?.round,
    });

    let ignore = false;

    (async () => {
      const rec = await getQRCodeById({
        access_token,
        id,
      });

      loadingIdRef.current = null;

      if (ignore) return;

      if (!rec) {
        message.warning({ content: 'Cannot get QR detail' });
        return;
      }

      form.setFieldsValue({
        id: getRowId(rec),
        title: rec?.title || '',
        latitude: rec?.latitude ?? rec?.Latitude,
        longitude: rec?.longitude ?? rec?.Longitude,
        round: rec?.round,
      });
    })();

    return () => {
      ignore = true;
    };
  }, [open, access_token, propData?._id, propData?.id]);

  const onFinish = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const id = values?.id;

      if (!id) {
        message.warning({ content: 'No QR selected' });
        return;
      }

      const doc = {
        title: values?.title,
        round: Number(values?.round || 0),
        latitude: Number(values?.latitude),
        longitude: Number(values?.longitude),
      };

      const res = await updateQRCode({
        access_token,
        id,
        doc,
      });

      if (!res) {
        message.warning({ content: 'update fail' });
        return;
      }

      const rec = res?.rec || res?.data || res;
      const qrId = rec?._id || rec?.id || id;

      setQrData({
        id: qrId,
        title: rec?.title || values?.title,
      });

      setCurrent(1);

      message.success({
        content: res?.message || 'update success',
      });
    } catch (e) {
      console.log(e);
      message.warning({ content: 'update fail' });
    }
  }, [form, updateQRCode, access_token]);

  const onDownload = useCallback(() => {
    const ok = downloadCanvasQRCode(qrRef.current, qrData?.title);

    ok ? message.success({ content: 'download success' }) : message.warning({ content: 'No QR code' });
  }, [qrData]);

  useEffect(() => {
    if (!open) {
      setCurrent(0);
      setQrData(null);
      form.resetFields();

      // reset guard when modal close
      loadedIdRef.current = null;
      loadingIdRef.current = null;
    }
  }, [open, form]);

  const steps = [
    {
      title: 'Update QR Code',
      content: detail_loading ? (
        <div style={{ textAlign: 'center', padding: 30 }}>
          <Spin />
        </div>
      ) : (
        <UpdateQrCodeForm form={form} />
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
            disabled={detail_loading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Update
          </Button>
        ) : (
          <Button onClick={closeModal} type="primary" danger className="!bg-red-500 !border-red-500 hover:!bg-red-500">
            Close
          </Button>
        )
      }>
      <Card
        title="Update QR Code"
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

export default StepUpdateQrCode;
