// import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { Card, Space, Button, message, Tabs } from 'antd';
// import { UserAddOutlined } from '@ant-design/icons';
// import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';

// import { AuthContext } from '../../../contexts/AuthContext';
// import { useContent } from '../../../contexts/ContentContext';
// import { useEmployeeStore } from '../../../stores/employee.store';

// import CreateEmployee from './CreateEmployee';
// import EmployeeHeader from '../../../components/employee/EmployeeHeader';
// import EmployeeSearchBar from '../../../components/employee/EmployeeSearchBar';
// import EmployeeTable from '../../../components/employee/EmployeeTable';
// import ChangeEmployeeStatus from './ChangeStatus';
// import ResignEmployee from './ResignEmployee';

// const getEmployeeId = (employee) => {
//   return employee?.id || employee?._id;
// };

// const buildEmployeeDoc = (tab) => {
//   if (tab === 'resign') {
//     return {
//       status: 'resign',
//     };
//   }

//   return {};
// };

// export default function MainEmployeePage() {
//   const { setContent } = useContent();
//   const { collapsed } = useOutletContext();
//   const navigate = useNavigate();
//   const { username, access_token } = useContext(AuthContext);

//   const [openCreate, setOpenCreate] = useState(false);
//   const [openChangeStatus, setOpenChangeStatus] = useState(false);
//   const [openResign, setOpenResign] = useState(false);
//   const [activeTab, setActiveTab] = useState('employee');
//   const [searchParams, setSearchParams] = useSearchParams();

//   const loading = useEmployeeStore((s) => s.loading);
//   const employees = useEmployeeStore((s) => s.employees);
//   const totalEmployees = useEmployeeStore((s) => s.totalEmployees);
//   const selectedEmployee = useEmployeeStore((s) => s.selectedEmployee);

//   const searchText = useEmployeeStore((s) => s.searchText);
//   const searchValue = useEmployeeStore((s) => s.searchValue);
//   const currentPage = useEmployeeStore((s) => s.currentPage);
//   const pageSize = useEmployeeStore((s) => s.pageSize);

//   const fetchEmployees = useEmployeeStore((s) => s.fetchEmployees);
//   const setSelectedEmployee = useEmployeeStore((s) => s.setSelectedEmployee);
//   const setSearchText = useEmployeeStore((s) => s.setSearchText);
//   const setSearchValue = useEmployeeStore((s) => s.setSearchValue);
//   const setCurrentPage = useEmployeeStore((s) => s.setCurrentPage);
//   const setPageSize = useEmployeeStore((s) => s.setPageSize);

//   const normalizedSearch = String(searchValue || '').trim();

//   const employeeDoc = useMemo(() => {
//     const doc = {
//       ...buildEmployeeDoc(activeTab),
//       page: currentPage,
//       size: pageSize,
//     };

//     if (normalizedSearch) {
//       doc.search = normalizedSearch;
//     }

//     return doc;
//   }, [activeTab, currentPage, pageSize, normalizedSearch]);

//   useEffect(() => {
//     const tabFromUrl = searchParams.get('tab');
//     const tab = tabFromUrl === 'resign' ? 'resign' : 'employee';

//     setActiveTab(tab);
//   }, [searchParams]);

//   useEffect(() => {
//     if (!access_token) return;

//     fetchEmployees({
//       access_token,
//       doc: employeeDoc,
//     });
//   }, [access_token, employeeDoc, fetchEmployees]);

//   const toastWarning = useCallback((content) => {
//     message.warning({ content });
//   }, []);

//   const refreshCurrentTab = useCallback(async () => {
//     await fetchEmployees({
//       access_token,
//       doc: employeeDoc,
//       force: true,
//     });
//   }, [access_token, employeeDoc, fetchEmployees]);

//   const onChangeStatusBtn = useCallback(() => {
//     const selectedId = getEmployeeId(selectedEmployee);

//     if (!selectedId) {
//       toastWarning('Please select employee');
//       return;
//     }

//     setOpenChangeStatus(true);
//   }, [selectedEmployee, toastWarning]);

//   const onResignBtn = useCallback(() => {
//     const selectedId = getEmployeeId(selectedEmployee);

//     if (!selectedId) {
//       toastWarning('Please select employee');
//       return;
//     }

//     setOpenResign(true);
//   }, [selectedEmployee, toastWarning]);

//   useEffect(() => {
//     setContent(
//       <EmployeeHeader
//         collapsed={collapsed}
//         selectedEmployee={selectedEmployee}
//         activeTab={activeTab}
//         onChangeStatus={onChangeStatusBtn}
//         onResignBtn={onResignBtn}
//         onHome={() => navigate('/')}
//       />
//     );
//   }, [setContent, collapsed, selectedEmployee, activeTab, navigate, onChangeStatusBtn, onResignBtn]);

//   const handleTabChange = (key) => {
//     setSearchParams({
//       tab: key,
//     });

//     setOpenChangeStatus(false);
//     setOpenResign(false);
//     setSelectedEmployee(null);
//     setSearchText('');
//     setSearchValue('');
//     setCurrentPage(1);
//   };

//   const handleSetSearchValue = (value) => {
//     setSelectedEmployee(null);
//     setCurrentPage(1);
//     setSearchValue(String(value || '').trim());
//   };

//   const handleChangePage = (page) => {
//     setSelectedEmployee(null);
//     setCurrentPage(page);
//   };

//   const handleChangePageSize = (size) => {
//     setSelectedEmployee(null);
//     setPageSize(size);
//     setCurrentPage(1);
//   };

//   const handleSelectEmployee = (employee) => {
//     if (!employee) {
//       setSelectedEmployee(null);
//       return;
//     }

//     setSelectedEmployee({
//       ...employee,
//       id: getEmployeeId(employee),
//     });
//   };

//   const tabBarExtraContent = (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         paddingRight: 8,
//         fontSize: 14,
//         fontWeight: 700,
//         lineHeight: '32px',
//       }}>
//       <span
//         style={{
//           color: '#9CA3AF',
//           letterSpacing: 1,
//         }}>
//         {totalEmployees || 0}
//       </span>

//       <span
//         style={{
//           color: '#9ca3af',
//           margin: '0 10px',
//         }}>
//         |
//       </span>

//       <span
//         style={{
//           color: '#9ca3af',
//         }}>
//         Total Amount
//       </span>
//     </div>
//   );

//   return (
//     <div>
//       <ChangeEmployeeStatus
//         open={openChangeStatus}
//         setOpen={setOpenChangeStatus}
//         selectedEmployee={selectedEmployee}
//         access_token={access_token}
//         username={username}
//         onRefresh={refreshCurrentTab}
//       />
//       <ResignEmployee
//         open={openResign}
//         setOpen={setOpenResign}
//         selectedEmployee={selectedEmployee}
//         access_token={access_token}
//         username={username}
//         onRefresh={refreshCurrentTab}
//       />

//       <Card
//         title="EMPLOYEE"
//         extra={
//           activeTab === 'employee' ? (
//             <Space>
//               <Button
//                 type="primary"
//                 style={{
//                   background: '#1677ff',
//                 }}
//                 icon={<UserAddOutlined />}
//                 onClick={() => setOpenCreate(true)}>
//                 Add Employee
//               </Button>
//             </Space>
//           ) : null
//         }>
//         <Tabs
//           activeKey={activeTab}
//           onChange={handleTabChange}
//           tabBarExtraContent={{
//             right: tabBarExtraContent,
//           }}
//           items={[
//             {
//               key: 'employee',
//               label: 'Employee',
//               children: (
//                 <>
//                   <EmployeeSearchBar
//                     searchText={searchText}
//                     setSearchText={setSearchText}
//                     setSearchValue={handleSetSearchValue}
//                     onResetPage={() => setCurrentPage(1)}
//                   />

//                   <EmployeeTable
//                     loading={loading}
//                     data={employees}
//                     total={totalEmployees}
//                     currentPage={currentPage}
//                     pageSize={pageSize}
//                     selectedRowId={getEmployeeId(selectedEmployee)}
//                     onChangePage={handleChangePage}
//                     onChangePageSize={handleChangePageSize}
//                     onSelectRow={handleSelectEmployee}
//                   />
//                 </>
//               ),
//             },
//             {
//               key: 'resign',
//               label: 'Resign',
//               children: (
//                 <>
//                   <EmployeeSearchBar
//                     searchText={searchText}
//                     setSearchText={setSearchText}
//                     setSearchValue={handleSetSearchValue}
//                     onResetPage={() => setCurrentPage(1)}
//                   />

//                   <EmployeeTable
//                     loading={loading}
//                     data={employees}
//                     total={totalEmployees}
//                     currentPage={currentPage}
//                     pageSize={pageSize}
//                     selectedRowId={getEmployeeId(selectedEmployee)}
//                     onChangePage={handleChangePage}
//                     onChangePageSize={handleChangePageSize}
//                     onSelectRow={handleSelectEmployee}
//                   />
//                 </>
//               ),
//             },
//           ]}
//         />
//       </Card>

//       <CreateEmployee
//         Get_Employee={() => {
//           return fetchEmployees({
//             access_token,
//             doc: employeeDoc,
//             force: true,
//           });
//         }}
//         open={openCreate}
//         setOpen={setOpenCreate}
//       />
//     </div>
//   );
// }

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Card, Tabs, Space, Button, message } from 'antd';

import { UserAddOutlined } from '@ant-design/icons';

import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';

import { useContent } from '../../../contexts/ContentContext';

import EmployeeHeader from '../../../components/employee/EmployeeHeader';

import EmployeeSearchBar from '../../../components/employee/EmployeeSearchBar';

import EmployeeTable from '../../../components/employee/EmployeeTable';

import ProbationTable from '../../../components/employee/ProbationTable';
import UpdateProbationModal from './modal/UpdateProbationModal'
import ResignTable from '../../../components/employee/ResignTable';
import CreateEmployee from './CreateEmployee';
import { mockEmployees, mockProbation, mockResignEmployees } from './mockEmployee';
import './employee.css';
import Resign from './modal/Resign';
export default function MainEmployeePage() {
  const { setContent } = useContent();

  const { collapsed } = useOutletContext();

  const navigate = useNavigate();

  const { access_token, username } = useContext(AuthContext);

  const [openCreate, setOpenCreate] = useState(false);

  const [activeTab, setActiveTab] = useState('employee');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');

  const [positionSearch, setPositionSearch] = useState('');
  //
  const [openProbation, setOpenProbation] = useState(false);
  const [openResign, setOpenResign] = useState(false);
  //
  useEffect(() => {
    const tab = searchParams.get('tab') || 'employee';

    setActiveTab(tab);
  }, [searchParams]);

  const data = useMemo(() => {
    if (activeTab === 'probation') {
      return mockProbation;
    }

    if (activeTab === 'resign') {
      return mockResignEmployees;
    }

    return mockEmployees;
  }, [activeTab]);

  const handleTabChange = (key) => {
    setSearchParams({
      tab: key,
    });

    setSelectedEmployee(null);
  };

  const handleSelect = (row) => {
    setSelectedEmployee(row);
  };

  const toastWarning = (text) => {
    message.warning(text);
  };

  useEffect(() => {
    setContent(
      <EmployeeHeader
        collapsed={collapsed}
        activeTab={activeTab}
        selectedEmployee={selectedEmployee}
        onResignBtn={() => setOpenResign(true)}
        onHome={() => navigate('/')}
      />
    );
  }, [collapsed, selectedEmployee, activeTab, openResign]);

  return (
    <div className="employee-wrapper">
      <div className="employee-card">
        <div className="employee-header">
          <div className="employee-title">EMPLOYEE</div>
          {activeTab === 'employee' && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              style={{
                background: '#1677ff',
                height: 30,
                fontSize: 13,
              }}
              onClick={() => setOpenCreate(true)}>
              Add Employee
            </Button>
          )}
        </div>

        <div className="employee-tabs-wrapper">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            tabBarExtraContent={{
              right: (
                <div className="employee-total">
                  <span>204</span>
                  <span
                    style={{
                      margin: '0 10px',
                    }}
                  >
                    |
                  </span>
                  <span>Total Amount</span>
                </div>
              ),
            }}

            items={[
              {
                key: 'employee',
                label: 'Employee',
                children: (
                  <>
                    <div className="my-4">
                      <EmployeeSearchBar
                        searchText={search}
                        setSearchText={setSearch}
                        positionText={positionSearch}
                        setPositionText={setPositionSearch}
                      />
                    </div>
                    <EmployeeTable
                      data={data}
                      selectedRowId={selectedEmployee?.id}

                      onSelectRow={handleSelect}
                    />
                    <Resign
                      open={openResign}
                      setOpen={setOpenResign}
                      employee={selectedEmployee}
                      onSave={async (employee) => {
                        console.log('resign employee:', employee);
                        // call API here later

                        message.success('Employee resigned successfully');

                        setOpenResign(false);
                        setSelectedEmployee(null);
                      }}
                    />
                    <CreateEmployee
                      Get_Employee={() => {
                        return fetchEmployees({
                          access_token,
                          doc: employeeDoc,
                          force: true,
                        });
                      }}
                      open={openCreate}
                      setOpen={setOpenCreate}
                    />
                  </>
                ),
              },

              {
                key: 'probation',

                label: 'Probation',

                children: (
                  <>
                    <div className="my-4">
                      <UpdateProbationModal
                        open={openProbation}
                        setOpen={setOpenProbation}
                        employee={selectedEmployee}
                      />
                      <EmployeeSearchBar
                        searchText={search}
                        setSearchText={setSearch}
                        positionText={positionSearch}
                        setPositionText={setPositionSearch}
                      />
                    </div>

                    <ProbationTable
                      data={data}
                      selectedRowId={selectedEmployee?.id}
                      onSelectRow={handleSelect}
                      setOpen={setOpenProbation}

                    />
                  </>
                ),
              },

              {
                key: 'resign',
                label: 'Resign',
                children: (
                  <>
                    <div className="my-4">
                      <EmployeeSearchBar
                        searchText={search}
                        setSearchText={setSearch}
                        positionText={positionSearch}
                        setPositionText={setPositionSearch}
                      />
                    </div>
                    <ResignTable
                      data={data}
                      selectedRowId={selectedEmployee?.id}
                      onSelectRow={handleSelect}

                    />
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
