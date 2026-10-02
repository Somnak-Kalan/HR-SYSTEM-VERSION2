import { useContext, useEffect, useRef, useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Row, Col, Modal, message, Card, Spin, Empty } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { usePositionStore } from '../../../stores/position.store';

const { TextArea } = Input;

const getRowId = (item) => {
  return item?.id || item?._id || item?.position_id || item?.key;
};

const getPositionObject = (res) => {
  if (!res) return null;

  if (res?.data?.data && typeof res.data.data === 'object') {
    return res.data.data;
  }

  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
    return res.data;
  }

  if (typeof res === 'object' && !Array.isArray(res)) {
    return res;
  }

  return null;
};

const getCompanyId = (data) => {
  return (
    data?.company_id ||
    data?.companyId ||
    data?.company?._id ||
    data?.company?.id ||
    data?.department?.company_id ||
    data?.department?.company?._id ||
    null
  );
};

const getDepartmentId = (data) => {
  return data?.department_id || data?.departmentId || data?.department?._id || data?.department?.id || null;
};

const UpdatePosition = (props) => {
  const {
    propData,
    username,
    company_list = [],
    department_list = [],
    form,
    Emit_Company_Id,
    open_update,
    setOpenUpdate,
    Get_Company,
    companyLoading = false,
    departmentLoading = false,
  } = props;

  const { access_token } = useContext(AuthContext);

  const [btnLoading, setBtnLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailReady, setDetailReady] = useState(false);
  const [detailEmpty, setDetailEmpty] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const Update_Position = usePositionStore((s) => s.Update_Position);
  const Get_Position_By_Id = usePositionStore((s) => s.Get_Position_By_Id);

  const companySearchTimerRef = useRef(null);
  const requestRef = useRef(0);

  const handleCancel = () => {
    requestRef.current += 1;
    setOpenUpdate(false);
  };

  const loadPositionDetail = async () => {
    if (!open_update) return;

    const id = getRowId(propData);

    if (!id) {
      messageApi.warning('Please select position first');
      setOpenUpdate(false);
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    try {
      setDetailLoading(true);
      setDetailReady(false);
      setDetailEmpty(false);
      form?.resetFields();

      Get_Company?.('');

      const res = await Get_Position_By_Id({
        access_token,
        doc: {
          id,
        },
      });

      if (requestRef.current !== requestId) return;

      const data = getPositionObject(res);

      if (!data || Object.keys(data).length === 0) {
        setDetailEmpty(true);
        setDetailReady(false);
        return;
      }

      const positionId = getRowId(data) || id;
      const companyId = getCompanyId(data);
      const departmentId = getDepartmentId(data);

      if (companyId) {
        await Emit_Company_Id?.(companyId);
      }

      if (requestRef.current !== requestId) return;

      form?.setFieldsValue({
        id: positionId,
        company_id: companyId,
        department_id: departmentId,
        position_name: data?.position_name || '',
        position_description: data?.position_description || '',
      });

      setDetailReady(true);
      setDetailEmpty(false);
    } catch (error) {
      if (requestRef.current !== requestId) return;

      console.log(error);
      setDetailEmpty(true);
      setDetailReady(false);
      messageApi.error('Cannot get position detail');
    } finally {
      if (requestRef.current === requestId) {
        setDetailLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPositionDetail();
  }, [open_update, propData]);

  useEffect(() => {
    return () => {
      requestRef.current += 1;

      if (companySearchTimerRef.current) {
        clearTimeout(companySearchTimerRef.current);
      }
    };
  }, []);

  const Handle_Change_Company = (id) => {
    Emit_Company_Id?.(id);
    form?.setFieldValue('department_id', null);
  };

  const handleCompanySearch = (value) => {
    if (companySearchTimerRef.current) {
      clearTimeout(companySearchTimerRef.current);
    }

    companySearchTimerRef.current = setTimeout(() => {
      Get_Company?.(value);
    }, 350);
  };

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      const doc = {
        id: values.id,
        formData: {
          position_name: values.position_name,
          department_id: values.department_id,
          position_description: values.position_description || null,
          // user: username,
        },
      };

      setBtnLoading(true);

      await Update_Position({
        doc,
        access_token,
      });

      messageApi.success('Update Success');
      setOpenUpdate(false);
      form?.resetFields();
    } catch (error) {
      if (error?.errorFields) return;

      console.log(error);
      messageApi.error('Update Failed');
    } finally {
      setBtnLoading(false);
    }
  };

  const renderContent = () => {
    if (detailLoading) {
      return (
        <div
          style={{
            minHeight: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spin tip="Loading position data..." size="large">
            <div style={{ width: 260, height: 80 }} />
          </Spin>
        </div>
      );
    }

    if (detailEmpty) {
      return (
        <div
          style={{
            minHeight: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Empty description="No position data found" />
        </div>
      );
    }

    if (!detailReady) {
      return (
        <div
          style={{
            minHeight: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spin tip="Preparing form..." />
        </div>
      );
    }

    return (
      <Form form={form} name="edit_position" autoComplete="off">
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Row>
          <Col xs={24} className="my-2">
            <Form.Item
              label="Position"
              labelCol={{ span: 24 }}
              name="position_name"
              className="m-0 p-0"
              rules={[{ required: true, message: 'field require' }]}>
              <Input placeholder="Position" />
            </Form.Item>
          </Col>

          <Col xs={24} className="my-2">
            <Form.Item
              name="company_id"
              label="Company Name"
              className="m-0 p-0"
              rules={[{ required: true, message: 'field require' }]}
              labelCol={{ span: 24 }}>
              <Select
                onChange={Handle_Change_Company}
                placeholder="select company"
                options={company_list}
                allowClear
                showSearch
                loading={companyLoading}
                filterOption={false}
                onSearch={handleCompanySearch}
                onDropdownVisibleChange={(open) => {
                  if (open) Get_Company?.('');
                }}
                onClear={() => {
                  Get_Company?.('');
                  Emit_Company_Id?.(null);
                  form?.setFieldValue('department_id', null);
                }}
                notFoundContent={companyLoading ? 'Loading...' : 'No company found'}
              />
            </Form.Item>
          </Col>

          <Col xs={24} className="my-2">
            <Form.Item
              name="department_id"
              label="Department"
              className="m-0 p-0"
              rules={[{ required: true, message: 'field require' }]}
              labelCol={{ span: 24 }}>
              <Select
                placeholder="select department"
                options={department_list}
                allowClear
                loading={departmentLoading}
                notFoundContent={departmentLoading ? 'Loading...' : 'No department found'}
              />
            </Form.Item>
          </Col>

          <Col xs={24} className="my-2">
            <Form.Item label="Description" labelCol={{ span: 24 }} name="position_description" className="m-0 p-0">
              <TextArea placeholder="Description" rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <>
      {contextHolder}

      <Modal
        open={open_update}
        onCancel={handleCancel}
        footer={
          <Button
            onClick={onFinish}
            loading={btnLoading}
            disabled={detailLoading || detailEmpty || !detailReady}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Update
          </Button>
        }
        closable={false}
        destroyOnHidden={false}
        maskClosable={false}
        centered
        afterOpenChange={(visible) => {
          if (!visible) {
            requestRef.current += 1;
            form?.resetFields();
            setDetailLoading(false);
            setDetailReady(false);
            setDetailEmpty(false);
            setBtnLoading(false);
          }
        }}>
        <Card
          title="Update Position"
          style={{ minHeight: 360 }}
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              className="cursor-pointer"
              style={{ fontSize: 20, color: 'red' }}
            />
          }
          styles={{ body: { paddingTop: 12 } }}>
          {renderContent()}
        </Card>
      </Modal>
    </>
  );
};

export default UpdatePosition;
