import React, { useState } from 'react';
import { Modal } from 'antd';
const ModalComponent = (props) => {
  const [state, setState] = useState(false);
  const showModal = () => {
    setState(true);
  };
  const handleOk = () => {
    setState(false);
  };

  const handleCancel = () => {
    setState(false);
  };
  //   const on_close_modal = () => {
  //     setState(false)
  //   }
  return (
    <>
      <Modal
        visible={state}
        okText="create"
        onCancelText="Cancel"
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
        width={500}
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        closable={false}></Modal>
    </>
  );
};
export default ModalComponent;
