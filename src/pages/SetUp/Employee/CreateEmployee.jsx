import { useEffect, useState } from 'react';
import { Card, Divider, Form, Modal, Steps, Popconfirm } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

import PersonalInfoForm from './PersonalInfoForm';
import CompanyInfoForm from './CompanyInfoForm';
import OtherInfoForm from './OtherInfoForm';

const CreateEmployee = (props) => {
  const { open, setOpen, Get_Employee } = props;

  const [formPersonal] = Form.useForm();
  const [formCompany] = Form.useForm();
  const [formOther] = Form.useForm();

  const [imageUrl, setImageUrl] = useState(null);
  const [current, setCurrent] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);

  const [companyOpts, setCompanyOpts] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [positionOpts, setPositionOpts] = useState([]);
  const [shiftManagementOpts, setShiftManagementOpts] = useState([]);

  const [personalInfoDoc, setPersonalInfoDoc] = useState(null);
  const [companyInfoDoc, setCompanyInfoDoc] = useState(null);

  const resetAll = () => {
    formPersonal.resetFields();
    formCompany.resetFields();
    formOther.resetFields();

    setCurrent(0);
    setImageUrl(null);
    setPersonalInfoDoc(null);
    setCompanyInfoDoc(null);
    setBtnLoading(false);

    setDepartmentOpts([]);
    setPositionOpts([]);
  };

  useEffect(() => {
    if (open) {
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const steps = [
    {
      title: 'Personal Information',
      content: (
        <PersonalInfoForm
          form={formPersonal}
          open={open}
          setOpen={setOpen}
          setCurrent={setCurrent}
          btnLoading={btnLoading}
          setBtnLoading={setBtnLoading}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setPersonalInfoDoc={setPersonalInfoDoc}
        />
      ),
    },
    {
      title: 'Company Information',
      content: (
        <CompanyInfoForm
          form={formCompany}
          open={open}
          setOpen={setOpen}
          setCurrent={setCurrent}
          btnLoading={btnLoading}
          setBtnLoading={setBtnLoading}
          companyOpts={companyOpts}
          departmentOpts={departmentOpts}
          positionOpts={positionOpts}
          shiftManagementOpts={shiftManagementOpts}
          setCompanyOpts={setCompanyOpts}
          setDepartmentOpts={setDepartmentOpts}
          setPositionOpts={setPositionOpts}
          setShiftManagementOpts={setShiftManagementOpts}
          setCompanyInfoDoc={setCompanyInfoDoc}
        />
      ),
    },
    {
      title: 'Other Information',
      content: (
        <OtherInfoForm
          form={formOther}
          open={open}
          setOpen={setOpen}
          setCurrent={setCurrent}
          btnLoading={btnLoading}
          setBtnLoading={setBtnLoading}
          personalInfoDoc={personalInfoDoc}
          companyInfoDoc={companyInfoDoc}
          Get_Employee={Get_Employee}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Modal open={open} closeIcon={null} width="60vw" footer={null} destroyOnClose>
      <Card
        title="Add Employee"
        extra={
          <Popconfirm
            title="Please confirm !"
            description="Are you sure to close this form?"
            onConfirm={() => setOpen(false)}
            okText="Yes"
            cancelText="No"
            overlayClassName="custom-popconfirm">
            <CloseCircleOutlined className="cursor-pointer" style={{ fontSize: '20px', color: 'red' }} />
          </Popconfirm>
        }>
        <Steps current={current} items={items} />
        <Divider />
        {steps[current].content}
      </Card>
    </Modal>
  );
};

export default CreateEmployee;
