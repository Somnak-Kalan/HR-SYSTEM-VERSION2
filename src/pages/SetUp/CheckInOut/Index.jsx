import { useOutletContext, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Breadcrumb, Tabs, Input, Form, DatePicker, Select, Table, Tag, Button, Row, Col, Checkbox } from 'antd';

import {
    HomeOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    UserOutlined,
    EnvironmentOutlined,
    EditOutlined
} from '@ant-design/icons';

import GroupBtn from 'components/GroupBtn';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContent } from '../../../contexts/ContentContext';
import EmployeeOptServices from '../../../services/options/employee';
import FrameIcon from '../../../assets/icons/Frame.svg';
import AttendanceAccessModal from './AttendanceAccessForm'
const CheckInOut = () => {
    const { setContent } = useContent();

    const { collapsed } = useOutletContext();

    const navigate = useNavigate();

    const { access_token } = useContext(AuthContext);

    const location = useLocation();

    const tab = location.pathname.split('/').pop();

    const activeTab =
        tab === 'employee'
            ? 'employee'
            : 'attendance';
    const [fullMonth, setFullMonth] = useState(true);
    // selected employee access
    const [selected, setSelected] = useState(null);
    const selectedId = selected?.id;
    const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");

    const [form] = Form.useForm();

    const [employeeOptions, setEmployeeOptions] = useState([]);

    const [employeeLoading, setEmployeeLoading] = useState(false);
    // ============================
    // MOCK ATTENDANCE DATA
    // ============================

    const attendanceData = [
        {
            id: 'VTS-001',
            name: 'អ៊ុយ សុខា',
            department: 'Accounting',
            day: 'Friday',
            date: '2026-04-03',
            clock_in: '09:17 AM',
            clock_out: '05:50 AM',
        },

        {
            id: 'VTS-002',
            name: 'ឈិន វីរៈ',
            department: 'Accounting',
            day: 'Monday',
            date: '2026-04-06',
            clock_in: '07:30 AM',
            clock_out: '04:12 AM',
        },
    ];

    // ============================
    // MOCK EMPLOYEE ACCESS DATA
    // ============================

    const employeeData = [
        {
            id: 'VTS001',
            name: 'អ៊ុយ សុខា',
            position: 'Accounting',
            department: 'FCL - ACCOUNTING',
            date: '2024-06-11',
            status: 'Active',
        },

        {
            id: 'VTS008',
            name: 'ឈិន វីរៈ',
            position: 'Operator',
            department: 'LCL - OPERATION',
            date: '2024-06-11',
            status: 'Inactive',
        },
    ];
    const fetchEmployeeList = async () => {

        try {

            setEmployeeLoading(true);


            const res = await EmployeeOptServices.Get_Employee_Otp({

                access_token,

                doc: {

                    search: "",

                    page: 1,

                    size: 50,

                },

            });



            const list =
                res?.data?.data ||
                res?.data ||
                res ||
                [];



            setEmployeeOptions(

                list.map((item) => ({

                    label:

                        item.full_name ||

                        item.employee_name ||

                        item.name ||

                        item._id,


                    value:

                        item._id ||

                        item.id,

                }))

            );



        } catch (error) {

            console.log(error);

            setEmployeeOptions([]);

        }
        finally {

            setEmployeeLoading(false);

        }

    };

    // ============================
    // ATTENDANCE TABLE COLUMN
    // ============================

    const attendanceColumns = useMemo(
        () => [
            {
                title: 'No',
                width: 50,
                align: 'center',

                render: (_, __, index) => index + 1,
            },

            {
                title: 'Employee Name',

                render: (row) => (
                    <div>
                        <div className="text-blue-600">{row.id}</div>

                        <div>{row.name}</div>

                        <div>{row.department}</div>
                    </div>
                ),
            },

            {
                title: 'Day',

                align: 'center',

                render: (row) => (
                    <>
                        <div>{row.day}</div>

                        <div>{row.date}</div>
                    </>
                ),
            },

            {
                title: 'Clock In',

                render: (row) => (
                    <>
                        <div>
                            <ClockCircleOutlined />

                            <span className="ml-1 font-bold text-[#71169B]">{row.clock_in}</span>
                        </div>

                        <div>
                            <EnvironmentOutlined />

                            <span className="ml-1">https://maps.app.goo.gl/</span>
                        </div>

                        <div className="flex text-blue-500">
                            <img src={FrameIcon} className="w-4" />

                            <p className="mx-1">View Img</p>
                        </div>
                    </>
                ),
            },

            {
                title: 'Clock Out',

                render: (row) => (
                    <>
                        <div>
                            <ClockCircleOutlined />

                            <span className="ml-1 font-bold text-[#71169B]">{row.clock_out}</span>
                        </div>

                        <div>
                            <EnvironmentOutlined />

                            <span className="ml-1">https://maps.app.goo.gl/</span>
                        </div>

                        <div className="flex text-blue-500">
                            <img src={FrameIcon} className="w-4" />

                            <p className="mx-1">View Img</p>
                        </div>
                    </>
                ),
            },
        ],

        []
    );

    // ============================
    // EMPLOYEE ACCESS TABLE COLUMN
    // ============================

    const employeeColumns = useMemo(
        () => [
            {
                title: 'No',

                width: 50,

                align: 'center',

                render: (_, __, index) => index + 1,
            },

            {
                title: 'Employee Name',

                render: (row) => (
                    <div>
                        <div>{row.id}</div>

                        <div>{row.name}</div>
                    </div>
                ),
            },

            {
                title: 'Position',

                dataIndex: 'position',
            },

            {
                title: 'Department',

                dataIndex: 'department',
            },

            {
                title: 'Date Create',

                dataIndex: 'date',
            },

            {
                title: 'Status',

                render: (row) => (
                    <Tag
                        style={{
                            color:
                                row.status === 'Active'
                                    ? '#016630'
                                    : '#414141',

                            background:
                                row.status === 'Active'
                                    ? '#DCFCE7'
                                    : '#E3E3E3',

                            border: 'none',

                            borderRadius: '999px',

                            padding: '2px 14px',

                            fontSize: '12px',

                            fontWeight: 500,

                            lineHeight: '20px',
                        }}
                    >
                        {row.status}
                    </Tag>
                ),
            },
        ],

        []
    );

    // ============================
    // HEADER CONTENT
    // ============================
    useEffect(() => {

        setContent(

            <div className="flex justify-between">

                <GroupBtn

                    showCustomBtn={activeTab === 'employee' ? true : false}

                    customButtons={[

                        {
                            text: 'Edit',

                            enabled: !!selectedId,

                            icon: <EditOutlined />,
                            onClick: () => {

                                setModalMode("update");

                                fetchEmployeeList();

                                form.setFieldsValue({

                                    employee_id: selected?.id,

                                    status: selected?.status,

                                });

                                setOpenAttendanceModal(true);

                            },
                        }

                    ]}

                    collapsed={collapsed}

                />


                <Breadcrumb

                    items={[

                        {

                            title:
                                <HomeOutlined
                                    onClick={() => navigate('/')}
                                />

                        },

                        {

                            title: 'Check in/out'

                        }

                    ]}

                />


            </div>

        );


    }, [
        collapsed,
        navigate,
        selectedId,
        activeTab
    ]);

    // ============================
    // RETURN UI
    // ============================


    return (
        <>
            <AttendanceAccessModal

                open={openAttendanceModal}

                setOpen={setOpenAttendanceModal}

                form={form}

                employeeOptions={employeeOptions}

                employeeLoading={employeeLoading}

                mode={modalMode}

                selectedData={selected}

            />
            <Card
                title="Clock in/out"

                extra={
                    activeTab === 'employee' && (
                        <Button
                            type="primary"

                            icon={<UserOutlined />}
                            onClick={() => {

                                setModalMode("add");

                                setSelected(null);

                                form.resetFields();

                                fetchEmployeeList();

                                setOpenAttendanceModal(true);

                            }}
                            style={{
                                background: '#1677ff',
                                borderRadius: 4,
                            }}
                        >
                            Attendance Access
                        </Button>
                    )
                }
            >
                <Tabs
                    activeKey={activeTab}

                    onChange={(key) => {

                        navigate(`/check-in-out/${key}`);

                    }}

                    items={[
                        {
                            key: 'attendance',

                            label: 'Attendance',

                            children: (
                                <>
                                    <div className="mb-3">
                                        <Checkbox
                                            checked={fullMonth}

                                            onChange={(e) => {
                                                setFullMonth(e.target.checked);
                                            }}

                                            className="mb-2 w-[200px] rounded-md border border-gray-300 px-3 py-1"
                                        >
                                            Full Month
                                        </Checkbox>

                                        <Row gutter={[8, 8]}>
                                            <Col xs={24} md={7}>
                                                <DatePicker.RangePicker
                                                    disabled={fullMonth}

                                                    placeholder={['Start date', 'End date']}

                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            </Col>

                                            <Col xs={24} md={6}>
                                                <Select

                                                    placeholder="Select by department"

                                                    style={{
                                                        width: '100%',
                                                    }}

                                                    prefix={
                                                        <SearchOutlined
                                                            className="text-blue-500"
                                                        />
                                                    }

                                                    options={[
                                                        {
                                                            label: 'Accounting',
                                                            value: 'accounting',
                                                        },

                                                        {
                                                            label: 'IT',
                                                            value: 'it',
                                                        },
                                                    ]}

                                                />
                                            </Col>

                                            <Col xs={24} md={6}>
                                                <Select

                                                    placeholder="Search by employee id"

                                                    style={{
                                                        width: '100%',
                                                    }}

                                                    prefix={
                                                        <SearchOutlined
                                                            className="text-blue-500"
                                                        />
                                                    }

                                                />
                                            </Col>

                                            <Col xs={24} md={2}>
                                                <Button
                                                    icon={<SearchOutlined />}

                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            </Col>
                                        </Row>

                                        <div className="mt-2 text-xs text-gray-500">Range: 2026-05-01 → 2026-05-31</div>
                                    </div>

                                    <Table
                                        className="mt-4"

                                        columns={attendanceColumns}

                                        dataSource={attendanceData}

                                        rowKey="id"

                                        bordered

                                        size="small"

                                        pagination={false}

                                        scroll={{
                                            x: 'max-content',
                                        }}
                                    />
                                </>
                            ),
                        },

                        {
                            key: 'employee',

                            label: 'Employee access',

                            children: (
                                <>
                                    <Row
                                        gutter={[8, 8]}

                                        className="mb-3"
                                    >
                                        <Col xs={24} md={7}>
                                            <Select
                                                placeholder="Search by employee id"

                                                style={{
                                                    width: '100%',
                                                }}
                                                prefix={<SearchOutlined className="text-blue-500" />}
                                            />
                                        </Col>

                                        <Col xs={24} md={2}>
                                            <Button
                                                icon={<SearchOutlined />}

                                                style={{
                                                    width: '100%',
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <Table
                                        rowSelection={{

                                            type: "radio",

                                            onChange: (keys, rows) => {

                                                setSelected(rows[0]);

                                            }

                                        }}

                                        columns={employeeColumns}

                                        dataSource={employeeData}

                                        rowKey="id"

                                        bordered

                                        size="small"

                                        pagination={{
                                            pageSize: 10,
                                        }}

                                        scroll={{
                                            x: 'max-content',
                                        }}
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </Card>
        </>
    );
};

export default CheckInOut;
