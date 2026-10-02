import { useContext, useEffect, useRef, useState } from 'react';
import { Card, Modal, Form, Input, Button, Select, Row, Col, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

import { AuthContext } from '../../../contexts/AuthContext';
import { usePositionStore } from '../../../stores/position.store';

const AddPosition = (props) => {
  const {
    username,
    Get_Company,
    company_list = [],
    department_list = [],
    Emit_Company_Id,
    form,
    open_add,
    setOpenAdd,
    companyLoading = false,
    departmentLoading = false,
  } = props;

  const { access_token } = useContext(AuthContext);

  const [btnLoading, setBtnLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const Create_Position = usePositionStore((s) => s.Create_Position);

  const companySearchTimerRef = useRef(null);

  const handleCancel = () => {
    setOpenAdd(false);
  };

  useEffect(() => {
    if (open_add) {
      form?.resetFields();
      Get_Company?.('');
    }
  }, [open_add]);

  useEffect(() => {
    return () => {
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
        department_id: values.department_id,
        position_name: values.position_name,
        position_description: values.position_description || null,
        // user: username,
      };

      setBtnLoading(true);

      await Create_Position({
        doc,
        access_token,
      });

      messageApi.success('Create Success');
      setOpenAdd(false);
      form?.resetFields();
    } catch (error) {
      if (error?.errorFields) return;

      console.log(error);
      messageApi.error('Create Failed');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <Modal
        open={open_add}
        onCancel={handleCancel}
        footer={
          <Button
            onClick={onFinish}
            loading={btnLoading}
            type="primary"
            style={{ background: '#1677ff' }}
            className="cursor-pointer text-white">
            Save
          </Button>
        }
        closable={false}
        destroyOnHidden
        afterOpenChange={(visible) => {
          if (!visible) form?.resetFields();
        }}>
        <Card
          title="Add Position"
          extra={
            <CloseCircleOutlined
              onClick={handleCancel}
              className="cursor-pointer"
              style={{ fontSize: 20, color: 'red' }}
            />
          }
          styles={{ body: { paddingTop: 12 } }}>
          <Form form={form} name="add_position" autoComplete="off">
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
        </Card>
      </Modal>
    </>
  );
};

export default AddPosition;
