import {
    Modal,
    Card,
    Button,
    message,
    Form,
    Select,
    Radio,
} from "antd";

import {
    CloseCircleOutlined,
} from "@ant-design/icons";

import {
    useState,
    useEffect,
    useContext,
} from "react";

import {
    AuthContext
} from "../../../contexts/AuthContext";

// import {
//     useAttendanceAccessStore
// } from "../../../stores/attendanceAccess.store";



const AttendanceAccessModal = ({
    open,
    setOpen,
    form,
    employeeOptions = [],
    mode = "add",
    selectedData = null,
}) => {


    const {
        access_token
    } = useContext(AuthContext);



    // const {
    //     Create_Attendance_Access,
    //     Update_Attendance_Access,
    // } = useAttendanceAccessStore();



    const [loading, setLoading] = useState(false);



    useEffect(() => {


        if (open) {


            if (mode === "update" && selectedData) {


                form.setFieldsValue({

                    employee_id:
                        selectedData.employee_id ||
                        selectedData.id,


                    status:
                        selectedData.status ||
                        "Active",

                });


            } else {


                form.resetFields();


                form.setFieldsValue({

                    status: "Active"

                });


            }

        }


    }, [
        open,
        mode,
        selectedData
    ]);






    const close = () => {


        setOpen(false);

        form.resetFields();


    };






    const submit = async () => {


        try {


            await form.validateFields();


            const values =
                form.getFieldsValue(true);



            const doc = {


                employee_id:
                    values.employee_id,


                status:
                    values.status || "Active",


            };



            setLoading(true);




            if (mode === "update") {



                // await Update_Attendance_Access({

                //     doc:{
                //         ...doc,

                //         id:
                //         selectedData?._id ||
                //         selectedData?.id

                //     },

                //     access_token

                // });



                message.success(
                    "Update Success"
                );



            } else {



                // await Create_Attendance_Access({

                //     doc,

                //     access_token

                // });



                message.success(
                    "Add Success"
                );

            }




            close();



        } catch (error) {


            if (error?.errorFields) {

                return;

            }


            console.log(error);


            message.error(
                mode === "update"
                    ?
                    "Update Failed"
                    :
                    "Add Failed"
            );



        } finally {


            setLoading(false);


        }


    };






    return (

        <Modal

            open={open}

            width={650}

            centered

            footer={null}

            closable={false}

            destroyOnHidden

            onCancel={close}


        >



            <Card


                title={

                    <div>


                        <div className="text-sm font-semibold">

                            Attendance Access

                        </div>


                        <div className="text-xs text-gray-400">

                            Control which employees or departments can use field clock.

                        </div>


                    </div>

                }



                extra={


                    <CloseCircleOutlined


                        className="cursor-pointer text-red-500"


                        onClick={close}


                    />


                }


            >




                <div className="mb-3 border-b pb-2 text-xs text-gray-500">

                    APPLICABLE

                </div>






                <Form

                    form={form}

                    layout="vertical"

                >




                    <Form.Item


                        label="Employee"


                        name="employee_id"


                        rules={[

                            {

                                required: true,

                                message: "Employee required"

                            }

                        ]}


                    >


                        <Select


                            placeholder="Select an option"


                            options={employeeOptions}


                            showSearch


                            optionFilterProp="label"



                            filterOption={
                                (input, option) =>

                                    option?.label
                                        ?.toLowerCase()
                                        .includes(
                                            input.toLowerCase()
                                        )
                            }


                            disabled={
                                mode === "update"
                            }


                        />


                    </Form.Item>







                    {
                        mode === "update" && (


                            <>


                                <div className="mb-2 border-t pt-2 text-xs text-gray-500">

                                    STATUS

                                </div>



                                <Form.Item


                                    name="status"


                                >


                                    <Radio.Group>


                                        <Radio value="Active">

                                            Active

                                        </Radio>


                                        <Radio value="Inactive">

                                            Inactive

                                        </Radio>



                                    </Radio.Group>


                                </Form.Item>



                            </>

                        )
                    }






                </Form>







                <div className="mt-5 flex gap-2">


                    <Button


                        className="flex-1"


                        onClick={close}


                    >

                        Cancel


                    </Button>





                    <Button


                        type="primary"


                        loading={loading}


                        className="flex-1"


                        style={{

                            background:

                                mode === "update"

                                    ?

                                    "#ff8500"

                                    :

                                    "#1677ff"

                        }}



                        onClick={submit}


                    >


                        {
                            mode === "update"

                                ?

                                "Update"

                                :

                                "Add"

                        }


                    </Button>



                </div>






            </Card>






        </Modal>


    );

};



export default AttendanceAccessModal;