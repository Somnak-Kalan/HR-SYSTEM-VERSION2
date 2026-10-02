import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";


import {
    Card,
    Tabs,
    Space,
    Button,
    message
} from "antd";


import {
    UserAddOutlined
} from "@ant-design/icons";


import {
    useNavigate,
    useOutletContext,
    useSearchParams
} from "react-router-dom";


import {
    AuthContext
} from "../../../contexts/AuthContext";


import {
    useContent
} from "../../../contexts/ContentContext";


import EmployeeHeader
    from "../../../components/employee/EmployeeHeader";


import EmployeeSearchBar
    from "../../../components/employee/EmployeeSearchBar";


import EmployeeTable
    from "../../../components/employee/EmployeeTable";


import ProbationTable
    from "../../../components/employee/ProbationTable";


import ResignTable
    from "../../../components/employee/ResignTable";


import {
    mockEmployees,
    mockProbation,
    mockResignEmployees
}
    from "../../../components/employee/mockEmployee";



export default function MainEmployeePage() {

    const { setContent } = useContent();

    const { collapsed } = useOutletContext();

    const navigate = useNavigate();


    const {
        access_token,
        username
    } = useContext(AuthContext);



    const [
        openCreate,
        setOpenCreate
    ] = useState(false);



    const [
        activeTab,
        setActiveTab
    ] = useState("employee");



    const [
        selectedEmployee,
        setSelectedEmployee
    ] = useState(null);



    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();



    const [search, setSearch] = useState("");



    useEffect(() => {

        const tab =
            searchParams.get("tab")
            ||
            "employee";


        setActiveTab(tab);


    }, [searchParams]);



    const data = useMemo(() => {


        if (activeTab === "probation") {
            return mockProbation;
        }


        if (activeTab === "resign") {
            return mockResignEmployees;
        }


        return mockEmployees;


    }, [activeTab]);



    const handleTabChange = (key) => {


        setSearchParams({
            tab: key
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

                selectedEmployee={selectedEmployee}

                onHome={() => navigate("/")}

            />

        );

    }, [
        collapsed,
        selectedEmployee
    ]);





    return (

        <div>


            <Card

                title="EMPLOYEE"


                extra={

                    activeTab === "employee"

                        ?

                        <Button

                            type="primary"

                            icon={<UserAddOutlined />}

                            style={{
                                background: "#1677ff"
                            }}

                            onClick={() => setOpenCreate(true)}

                        >

                            Add Employee

                        </Button>

                        : null

                }


            >


                <Tabs

                    activeKey={activeTab}

                    onChange={handleTabChange}


                    items={[


                        {


                            key: "employee",

                            label: "Employee",

                            children: (

                                <>


                                    <EmployeeSearchBar

                                        searchText={search}

                                        setSearchText={setSearch}

                                        setSearchValue={setSearch}

                                    />


                                    <EmployeeTable

                                        data={data}

                                        selectedRowId={
                                            selectedEmployee?.id
                                        }

                                        onSelectRow={handleSelect}

                                    />


                                </>

                            )

                        },



                        {

                            key: "probation",

                            label: "Probation",

                            children: (

                                <ProbationTable

                                    data={data}

                                />

                            )

                        },



                        {

                            key: "resign",

                            label: "Resign",

                            children: (

                                <ResignTable

                                    data={data}

                                />

                            )

                        }



                    ]}


                />


            </Card>


        </div>

    );


}