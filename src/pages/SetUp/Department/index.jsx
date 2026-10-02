import { useOutletContext, useNavigate } from 'react-router-dom';

import { Card, Row, Col, Input, Breadcrumb, Space, message, Form, Button, Table, Modal, Pagination } from 'antd';

import { HomeOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';

import { useContext, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import './Department.scss'
import { AuthContext } from '../../../contexts/AuthContext';

import { useContent } from '../../../contexts/ContentContext';

import EmployeeOptServices from '../../../services/options/employee';

import GroupBtn from 'components/GroupBtn';

import AddDepartment from './modal/AddDepartment';

import UpdateDepartment from './modal/UpdateDepartment';

import ReadMoreComponent from '../../../components/ReadMore';

import ViewByDepartment from './components/ViewByDept';

import { useDepartmentStore } from '../../../stores/department.store';

import { useCompanyStore } from '../../../stores/comapny.store';

const MainDepartmentPage = () => {
  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const { username, access_token } = useContext(AuthContext);

  // =========================
  // MODAL
  // =========================

  const [openAdd, setOpenAdd] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);

  const [open_modal_view, setOpenModelView] = useState(false);

  // =========================
  // SELECT DATA
  // =========================

  const [propData, setPropData] = useState(null);

  const [listCompany, setListCompany] = useState([]);

  // =========================
  // EMPLOYEE OPTIONS
  // =========================

  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [employeeLoading, setEmployeeLoading] = useState(false);

  const employeeTimer = useRef(null);

  // =========================
  // FORM
  // =========================

  const [formAdd] = Form.useForm();

  const [formUpdate] = Form.useForm();

  // =========================
  // TABLE
  // =========================

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // =========================
  // STORE
  // =========================

  const departmentData = useDepartmentStore((state) => state.department);

  const Get_Department = useDepartmentStore((state) => state.Get_Department);

  const Remove_Department = useDepartmentStore((state) => state.Remove_Department);

  const departmentLoading = useDepartmentStore((state) => state.departmentLoading);

  const company = useCompanyStore((state) => state.company);

  const Get_Company = useCompanyStore((state) => state.Get_Company);

  // =========================
  // MESSAGE
  // =========================

  const [messageApi, contextHolder] = message.useMessage();

  const [modal, modalContextHolder] = Modal.useModal();

  const getRowId = (item) => {
    return item?.id || item?._id || item?.department_id || item?.key;
  };

  // =================================================
  // EMPLOYEE API
  // =================================================

  const getEmployeeRows = (res) => {
    if (Array.isArray(res)) return res;

    if (Array.isArray(res?.data)) return res.data;

    if (Array.isArray(res?.data?.data)) return res.data.data;

    return [];
  };

  const formatEmployeeOptions = (res) => {
    return getEmployeeRows(res)
      .map((item) => ({
        label: item?.full_name || item?.employee_name || item?.name || item?._id,

        value: item?._id || item?.id,
      }))

      .filter((item) => item.label && item.value);
  };



  const handleEmployeeSearch = (value) => {
    clearTimeout(employeeTimer.current);

    employeeTimer.current = setTimeout(() => {

    }, 350);
  };

  // =========================
  // LOAD COMPANY
  // =========================

  useEffect(() => {
    if (openAdd || openUpdate) {
      if (!company?.length) {
        Get_Company({
          access_token,
        });
      }
    }
  }, [openAdd, openUpdate]);

  useEffect(() => {
    setListCompany(company || []);
  }, [company]);

  // =========================
  // LOAD EMPLOYEE
  // =========================

  // =========================
  // FETCH DEPARTMENT
  // =========================

  const fetchDepartmentList = (searchText = '') => {
    return Get_Department({
      access_token,

      doc: {
        search: searchText,
      },

      force: true,
    });
  };

  useEffect(() => {
    if (access_token) {
      fetchDepartmentList('');
    }
  }, [access_token]);

  // =========================
  // SEARCH
  // =========================

  const searchTimer = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    setCurrentPage(1);

    setSelectedRowKeys([]);

    setPropData(null);

    clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      fetchDepartmentList(value);
    }, 350);
  };

  // =========================
  // SELECT ROW
  // =========================

  const rowSelection = {
    type: 'radio',

    selectedRowKeys,

    onChange: (_, rows) => {
      const row = rows?.[0];

      if (!row) {
        setPropData(null);

        setSelectedRowKeys([]);

        return;
      }

      const id = getRowId(row);

      setSelectedRowKeys([id]);

      setPropData({
        ...row,

        id,
      });
    },
  };

  const filtered = departmentData || [];

  const start = (currentPage - 1) * pageSize;

  const pagedData = filtered.slice(start, start + pageSize);

  // =========================
  // DELETE
  // =========================

  // =========================
  // DELETE
  // =========================

  const removeDepartment = () => {

    const id = getRowId(propData);


    if (!id) {

      messageApi.warning('Select department first');

      return;

    }



    modal.confirm({

      title: "Confirm",

      content: "Confirm to Delete",

      okText: "Delete",

      cancelText: "Cancel",


      okButtonProps: {

        danger: true,

        style: {

          background: "#1677ff",

        }

      },


      onOk: async () => {

        try {


          await Remove_Department({

            doc: {

              id,

            },

            access_token,

          });



          messageApi.success(
            "Remove Success"
          );


          setPropData(null);

          setSelectedRowKeys([]);



        } catch (error) {


          console.log(error);


          messageApi.error(
            "Remove Failed"
          );


        }


      },


    });


  };

  useEffect(() => {
    setContent(
      <div className="flex justify-between">
        <GroupBtn
          collapsed={collapsed}

          editBtn={!!propData}

          showEditBtn

          onEditBtnClick={() => {
            if (propData) {
              setOpenUpdate(true);
            }
          }}

          deleteBtn={!!propData}

          showDeleteBtn

          onDeleteBtnClick={removeDepartment}

          viewBtn={!!propData}

          showViewBtn

          onViewBtnClick={() => setOpenModelView(true)}
        />

        <Breadcrumb
          items={[
            {
              title: <HomeOutlined onClick={() => navigate('/')} />,
            },

            {
              title: 'Department',
            },
          ]}
        />
      </div>
    );
  }, [propData, collapsed]);

  return (
    <div>
      {contextHolder}

      {modalContextHolder}

      <Card
        title="DEPARTMENT"

        extra={
          <Button
            type="primary"

            style={{
              background: '#1677ff',
            }}

            onClick={() => setOpenAdd(true)}
          >
            <UserAddOutlined />
            Add Department
          </Button>
        }
      >
        <Row>
          <Col xs={24} lg={8}>
            <Input
              className="mb-5"

              value={search}

              allowClear

              placeholder="search department"

              prefix={
                <SearchOutlined
                  style={{
                    color: '#1890ff',
                  }}
                />
              }

              onChange={handleSearchChange}
            />
          </Col>
        </Row>

        <AddDepartment
          form={formAdd}

          list_company={listCompany}

          open_add={openAdd}

          setOpenAdd={setOpenAdd}

          employeeOptions={employeeOptions}

          employeeLoading={employeeLoading}

          handleEmployeeSearch={handleEmployeeSearch}

        />

        <UpdateDepartment
          form={formUpdate}

          selectedData={propData}

          propData={propData}

          list_company={listCompany}

          open_update={openUpdate}

          setOpenUpdate={setOpenUpdate}

          employeeOptions={employeeOptions}

          employeeLoading={employeeLoading}

          handleEmployeeSearch={handleEmployeeSearch}
        />

        <ViewByDepartment
          propData={propData}
          open={open_modal_view}
          access_token={access_token}
          setOpen={setOpenModelView}
        />

        <Table
          rowKey={getRowId}

          rowSelection={rowSelection}

          dataSource={pagedData}

          loading={departmentLoading}

          pagination={{
            current: currentPage,

            pageSize,

            total: filtered.length,

            onChange: setCurrentPage,

            showSizeChanger: false,
          }}
          bordered
          size="small"
          scroll={{ x: 'max-content' }}
          columns={[
            {
              title: 'No',

              render: (_, __, index) => start + index + 1,
            },

            {
              title: 'Department',

              dataIndex: 'department_name',
            },

            {
              title: 'Company',

              dataIndex: 'company',
            },

            {
              title: 'Leader',

              dataIndex: 'leader_name',
            },

            {
              title: 'Description',

              render: (_, record) => <ReadMoreComponent text={record.department_description} />,
            },

            {
              title: 'Date',

              render: (_, record) => dayjs(record.date_create).format('YYYY-MM-DD'),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MainDepartmentPage;
